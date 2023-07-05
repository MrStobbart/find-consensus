import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createResponse } from "../../../helpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name");

  if (name) {
    await kv.set(name, "test value");
    return NextResponse.json(createResponse("Survey created", name));
  }
  return NextResponse.json(createResponse("You must provide a name"));
}
