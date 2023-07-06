import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { Vote, getVotesKey } from "../../../../../types";
import { createResponse } from "../../../../../helpers";

export const getVotes = async (surveyName: string, userName: string) => {
  const votes = await kv.lrange<Vote>(getVotesKey(surveyName, userName), 0, -1);
  return votes.reverse();
};

export const getVotesForOption = async (
  surveyName: string,
  userName: string,
  optionName: string
) => {
  const votes = await getVotes(surveyName, userName);
  return votes.filter((vote) => vote.optionName === optionName);
};

export async function GET(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const userName = context.params["userName"];

  try {
    const votes = await getVotes(surveyName, userName);

    return NextResponse.json(createResponse("Here is your survey", votes));
  } catch (error) {
    console.error(error);
  }
}
