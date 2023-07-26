import { NextResponse } from "next/server";
import { PostSurveyRequestBody } from "../../route";
import { createResponse } from "../../../../helpers";
import { kv } from "@vercel/kv";
import { Option, Vote, getOptionsKey } from "../../../../types";
import { getOptions, getVotesForUser } from "../../../apiHelpers";

export type PostOptionRequestBody = Vote;

export async function POST(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const { option, userName }: PostOptionRequestBody = await request.json();

  if (!surveyName) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  if (!option.name) {
    return NextResponse.json(createResponse("You must provide an option name"));
  }

  await kv.rpush(getOptionsKey(surveyName), option);
  const votes = await getVotesForUser(surveyName, userName);
  return NextResponse.json(
    createResponse<Vote[]>(
      "Option created. Here are the votes for the current user",
      votes
    )
  );
}

export type DeleteOptionRequestBody = Vote;

export async function DELETE(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const { option: optionToDelete, userName }: DeleteOptionRequestBody =
    await request.json();
  await kv.lrem(getOptionsKey(surveyName), 1, optionToDelete);
  const votes = await getVotesForUser(surveyName, userName);
  return NextResponse.json(
    createResponse<Vote[]>(`Option ${optionToDelete.name} deleted`, votes)
  );
}
