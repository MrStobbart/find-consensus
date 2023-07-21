import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createResponse } from "../../../../../helpers";
import { Vote, VoteValue, Votes, getVotesKey } from "../../../../../types";
import { getVotesForUser } from "../../../../apiHelpers";

export type PutVoteRequestBody = { value: number; optionName: string };

export async function PUT(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const userName = context.params["userName"];
  const { optionName, value }: PutVoteRequestBody = await request.json();

  if (!surveyName) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  if (!userName) {
    return NextResponse.json(createResponse("You must provide a user name"));
  }

  await kv.set(getVotesKey(surveyName, userName, optionName), value);

  const updatedVotes = await getVotesForUser(surveyName, userName);
  return NextResponse.json(
    createResponse<Votes>("Vote upserted", updatedVotes)
  );
}
