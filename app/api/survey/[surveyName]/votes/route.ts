import { NextResponse } from "next/server";
import { createResponse } from "../../../../helpers";
import { getUsers } from "../users/route";
import { getVotes } from "../[userName]/votes/route";

export async function GET(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  if (!surveyName) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  try {
    const users = await getUsers(surveyName);
    const allVotes = (
      await Promise.all(users.map((user) => getVotes(surveyName, user.name)))
    ).flatMap((votes) => votes);
    return NextResponse.json(
      createResponse("Here are all votes in the survey", allVotes)
    );
  } catch (error) {
    console.error(error);
  }
}
