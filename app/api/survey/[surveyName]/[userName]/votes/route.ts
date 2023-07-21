import { NextResponse } from "next/server";
import { createResponse } from "../../../../../helpers";
import { getVotesForUser } from "../../../../apiHelpers";

export const revalidate = 0;

export async function GET(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const userName = context.params["userName"];

  try {
    const votes = await getVotesForUser(surveyName, userName);

    return NextResponse.json(createResponse("Here are your votes", votes));
  } catch (error) {
    console.error(error);
  }
}
