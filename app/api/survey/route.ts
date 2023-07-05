import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createResponse } from "../../helpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name");

  if (name) {
    await kv.get(name);
    return NextResponse.json(createResponse("Here is your survey", name));
  }
  return NextResponse.json(createResponse("You must provide a name"));
}
