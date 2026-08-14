import { NextRequest, NextResponse } from "next/server";

type AssistantRequest = {
  question?: string;
  context?: unknown;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
};

function backendBase() {
  if (process.env.SEMNAN_BACKEND_URL) return process.env.SEMNAN_BACKEND_URL.replace(/\/$/, "");
  if (process.env.SEMNAN_API_URL) return process.env.SEMNAN_API_URL.replace(/\/graphql\/?$/, "");
  return "http://localhost:9000";
}

async function askBackend(body: AssistantRequest) {
  const response = await fetch(`${backendBase()}/api/ai/assistant/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-management-token": process.env.MANAGEMENT_API_TOKEN ?? ""
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(3_500)
  });

  if (!response.ok) throw new Error(`PRIMARY_ASSISTANT_${response.status}`);
  const payload = await response.json() as { answer?: string; model?: string };
  if (!payload.answer?.trim()) throw new Error("PRIMARY_ASSISTANT_EMPTY");
  return payload;
}

function compactContext(context: unknown) {
  try {
    return JSON.stringify(context ?? {}).slice(0, 24_000);
  } catch {
    return "{}";
  }
}

async function askGemini(question: string, context: unknown) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_KEY_MISSING");

  const configuredModel = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const model = /^[a-zA-Z0-9._-]+$/.test(configuredModel) ? configuredModel : "gemini-2.5-flash";
  const prompt = [
    "تو دستیار مدیریتی مرکز فرماندهی استانداری سمنان هستی.",
    "مخاطب اصلی محمدجواد کولیوند، استاندار سمنان است.",
    "پاسخ را فقط به زبان فارسی، دقیق، اجرایی و کوتاه ارائه کن.",
    "فقط از اطلاعات زمینه‌ای زیر استفاده کن و اگر داده کافی نیست، صریح بگو اطلاعات کافی ثبت نشده است.",
    "در پاسخ از اصطلاحات فنی پیاده‌سازی، نام سرویس‌ها یا توضیح درباره منبع جایگزین استفاده نکن.",
    `اطلاعات مرکز فرماندهی: ${compactContext(context)}`,
    `پرسش مدیر: ${question}`
  ].join("\n\n");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.25, maxOutputTokens: 900 }
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(25_000)
  });

  const payload = await response.json().catch(() => ({})) as GeminiResponse;
  if (!response.ok) throw new Error(payload.error?.message || `GEMINI_${response.status}`);

  const answer = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!answer) throw new Error("GEMINI_EMPTY");

  return { answer, model, source: "gemini-fallback" };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as AssistantRequest;
  const question = body.question?.trim().slice(0, 2_000);
  if (!question) return NextResponse.json({ error: "لطفاً پرسش خود را وارد کنید." }, { status: 400 });

  const safeBody = { question, context: body.context };

  try {
    return NextResponse.json(await askBackend(safeBody));
  } catch (primaryError) {
    try {
      return NextResponse.json(await askGemini(question, body.context));
    } catch (fallbackError) {
      console.error("Assistant services unavailable", { primaryError, fallbackError });
      return NextResponse.json(
        { error: "دستیار هوشمند موقتاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید." },
        { status: 503 }
      );
    }
  }
}
