import { NextResponse } from "next/server";
import { createResponse } from "../../../../helpers";
import { getUsers } from "../../../apiHelpers";

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
    return NextResponse.json(createResponse("Here are your users", users));
  } catch (error) {
    console.error(error);
  }
}
