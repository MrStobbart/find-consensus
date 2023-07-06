import { NextResponse } from "next/server";
import { createResponse } from "../../../../../helpers";
import { getVotes } from "../../../../apiHelpers";

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
