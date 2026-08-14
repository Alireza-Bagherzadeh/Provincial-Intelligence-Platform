import { NextRequest, NextResponse } from "next/server";

function backendBase() {
  if (process.env.SEMNAN_BACKEND_URL) return process.env.SEMNAN_BACKEND_URL.replace(/\/$/, "");
  if (process.env.SEMNAN_API_URL) return process.env.SEMNAN_API_URL.replace(/\/graphql\/?$/, "");
  return "http://localhost:9000";
}

function backendHeaders() {
  return {
    "content-type": "application/json",
    "x-management-token": process.env.MANAGEMENT_API_TOKEN ?? ""
  };
}

async function pass(response: Response) {
  const payload = await response.json().catch(() => ({ error: "پاسخ Backend قابل خواندن نیست." }));
  return NextResponse.json(payload, { status: response.status });
}

export async function GET(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get("resource") ?? "";
  const search = request.nextUrl.searchParams.get("search") ?? "";
  const query = new URLSearchParams({ resource });
  if (search) query.set("search", search);
  const response = await fetch(`${backendBase()}/api/management/crud/?${query.toString()}`, {
    method: "GET",
    headers: backendHeaders(),
    cache: "no-store"
  });
  return pass(response);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const action = String(body.action ?? "crud");

  if (action === "import_archive" || action === "ingest_news") {
    const target = action === "import_archive"
      ? "/api/management/import-archive/"
      : "/api/management/ingest-news/";
    const response = await fetch(`${backendBase()}${target}`, {
      method: "POST",
      headers: backendHeaders(),
      body: JSON.stringify(body),
      cache: "no-store"
    });
    return pass(response);
  }

  const resource = String(body.resource ?? "");
  const response = await fetch(`${backendBase()}/api/management/crud/?resource=${encodeURIComponent(resource)}`, {
    method: "POST",
    headers: backendHeaders(),
    body: JSON.stringify({ data: body.data ?? {} }),
    cache: "no-store"
  });
  return pass(response);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const resource = String(body.resource ?? "");
  const response = await fetch(`${backendBase()}/api/management/crud/?resource=${encodeURIComponent(resource)}`, {
    method: "PATCH",
    headers: backendHeaders(),
    body: JSON.stringify({ id: body.id, data: body.data ?? {} }),
    cache: "no-store"
  });
  return pass(response);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const resource = String(body.resource ?? "");
  const response = await fetch(`${backendBase()}/api/management/crud/?resource=${encodeURIComponent(resource)}`, {
    method: "DELETE",
    headers: backendHeaders(),
    body: JSON.stringify({ id: body.id }),
    cache: "no-store"
  });
  return pass(response);
}
