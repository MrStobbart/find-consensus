import { kv } from "@vercel/kv";
import { SurveyUser, getSurveyUsersKey } from "../../../../types";
import { NextResponse } from "next/server";
import { createResponse } from "../../../../helpers";

export const getUsers = async (surveyName: string) => {
  const users = await kv.lrange<SurveyUser>(
    getSurveyUsersKey(surveyName),
    0,
    -1
  );
  return users.reverse();
};

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
