import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { Survey } from "../../types";
import { surveysKey } from "../../redisKeys";
import { createResponse } from "../../helpers";

export async function GET() {
  const surveys = await kv.lrange<Survey>(surveysKey, 0, 25);
  return NextResponse.json(createResponse("The surveys", surveys.reverse()));
}
