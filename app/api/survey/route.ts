import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createResponse } from "../../helpers";
import { Survey } from "../../types";
import { getSurveyIndexKey, surveysKey } from "../../redisKeys";
import { getSurveys } from "../apiHelpers";

export type PostSurveyRequestBody = Survey;

export async function POST(request: Request) {
  const survey: PostSurveyRequestBody = await request.json();

  if (!survey.name) {
    return NextResponse.json(
      createResponse("You must provide a survey name in the body")
    );
  }

  const length = await kv.rpush(surveysKey, survey);
  await kv.set(getSurveyIndexKey(survey.name), length - 1);
  const surveys = await getSurveys();
  return NextResponse.json(createResponse<Survey[]>("Survey created", surveys));
}

export type DeleteSurveyRequestBody = Pick<Survey, "name">;

export async function DELETE(request: Request) {
  const survey: DeleteSurveyRequestBody = await request.json();
  await kv.lrem(surveysKey, 1, survey);
  const surveys = await getSurveys();
  return NextResponse.json(
    createResponse<Survey[]>(`Survey ${survey.name} deleted`, surveys)
  );
}
