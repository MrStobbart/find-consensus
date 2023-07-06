import { NextResponse } from "next/server";
import { PostSurveyRequestBody } from "../../route";
import { createResponse } from "../../../../helpers";
import { kv } from "@vercel/kv";
import { Option, getOptionsKey } from "../../../../types";
import { getOptions } from "../options/route";

export type PostOptionRequestBody = { optionName: string };

export async function POST(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const { optionName }: PostOptionRequestBody = await request.json();

  if (!surveyName) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  if (!optionName) {
    return NextResponse.json(createResponse("You must provide an option name"));
  }

  const option: Option = { name: optionName };
  await kv.rpush(getOptionsKey(surveyName), option);
  const options = await getOptions(surveyName);
  return NextResponse.json(createResponse<Option[]>("Survey created", options));
}
