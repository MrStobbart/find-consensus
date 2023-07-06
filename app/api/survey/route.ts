import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createResponse } from "../../helpers";
import { Survey } from "../../types";
import { getSurveyIndexKey, surveysKey } from "../../redisKeys";
import { getSurveys } from "../surveys/route";

export type PostSurveyRequestBody = { name: string };

export async function POST(request: Request) {
  const { name }: PostSurveyRequestBody = await request.json();

  if (!name) {
    return NextResponse.json(
      createResponse("You must provide a survey name in the body")
    );
  }

  // TODO validation
  const survey: Survey = { name };
  const length = await kv.rpush(surveysKey, survey);
  await kv.set(getSurveyIndexKey(name), length - 1);
  const surveys = await getSurveys();
  return NextResponse.json(createResponse<Survey[]>("Survey created", surveys));
}
