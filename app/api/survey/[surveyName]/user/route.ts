import { NextResponse } from "next/server";
import { PostSurveyRequestBody } from "../../route";
import { createResponse } from "../../../../helpers";
import { kv } from "@vercel/kv";
import {
  Option,
  SurveyUser,
  getOptionsKey,
  getSurveyUsersKey,
} from "../../../../types";
import { getOptions } from "../options/route";
import { getUsers } from "../users/route";

export type PostUserRequestBody = { userName: string };

export async function POST(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const { userName }: PostUserRequestBody = await request.json();

  if (!surveyName) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  if (!userName) {
    return NextResponse.json(createResponse("You must provide a user name"));
  }

  const user: SurveyUser = { name: userName };
  await kv.rpush(getSurveyUsersKey(surveyName), user);
  const users = await getUsers(surveyName);
  return NextResponse.json(createResponse<Option[]>("User created", users));
}
