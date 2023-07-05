import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createResponse } from "../../../helpers";
import { Survey } from "../../../types";
import { getSurveyIndexKey, surveysKey } from "../../../redisKeys";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = searchParams.get("name");

  if (name) {
    const survey: Survey = { name, options: [] };
    const length = await kv.rpush(surveysKey, survey);
    await kv.set(getSurveyIndexKey(name), length - 1);
    return NextResponse.json(createResponse<Survey>("Survey created", survey));
  }
  return NextResponse.json(createResponse("You must provide a name"));
}
