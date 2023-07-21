import { NextResponse } from "next/server";
import { PostSurveyRequestBody } from "../../route";
import { createResponse } from "../../../../helpers";
import { kv } from "@vercel/kv";
import { Option, getOptionsKey } from "../../../../types";
import { getOptions } from "../../../apiHelpers";

export type PostOptionRequestBody = Option;

export async function POST(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const option: PostOptionRequestBody = await request.json();

  if (!surveyName) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  if (!option.name) {
    return NextResponse.json(createResponse("You must provide an option name"));
  }

  await kv.rpush(getOptionsKey(surveyName), option);
  const options = await getOptions(surveyName);
  return NextResponse.json(createResponse<Option[]>("Survey created", options));
}

export type DeleteOptionRequestBody = Option;

export async function DELETE(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const optiontoDelete: DeleteOptionRequestBody = await request.json();
  await kv.lrem(getOptionsKey(surveyName), 1, optiontoDelete);
  const options = await getOptions(surveyName);
  return NextResponse.json(
    createResponse<Option[]>(`Option ${optiontoDelete.name} deleted`, options)
  );
}
