import { NextResponse } from "next/server";
import { createResponse } from "../../../../helpers";
import { getUsers, getResults, getVotesForUser } from "../../../apiHelpers";

export const revalidate = 0;

export async function GET(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  if (!surveyName) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  const votes = await getResults(surveyName);
  return NextResponse.json(
    createResponse("Here are all votes in the survey", votes)
  );
}
