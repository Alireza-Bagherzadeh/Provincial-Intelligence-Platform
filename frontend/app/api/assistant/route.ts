import { NextRequest, NextResponse } from "next/server";

function backendBase() {
  if (process.env.SEMNAN_BACKEND_URL) return process.env.SEMNAN_BACKEND_URL.replace(/\/$/, "");
  if (process.env.SEMNAN_API_URL) return process.env.SEMNAN_API_URL.replace(/\/graphql\/?$/, "");
  return "http://localhost:9000";
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const response = await fetch(`${backendBase()}/api/ai/assistant/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-management-token": process.env.MANAGEMENT_API_TOKEN ?? ""
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });
  const payload = await response.json().catch(() => ({ error: "پاسخ Backend قابل خواندن نیست." }));
  return NextResponse.json(payload, { status: response.status });
}
