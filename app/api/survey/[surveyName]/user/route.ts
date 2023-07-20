import { NextResponse } from "next/server";
import { createResponse } from "../../../../helpers";
import { kv } from "@vercel/kv";
import {
  Option,
  SurveyUser,
  getOptionsKey,
  getSurveyUsersKey,
} from "../../../../types";
import { getUsers } from "../../../apiHelpers";

export type PostUserRequestBody = SurveyUser;

export async function POST(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const surveyUser: PostUserRequestBody = await request.json();

  if (!surveyName) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  if (!surveyUser.name) {
    return NextResponse.json(createResponse("You must provide a user name"));
  }

  await kv.rpush(getSurveyUsersKey(surveyName), surveyUser);
  const users = await getUsers(surveyName);
  return NextResponse.json(createResponse<Option[]>("User created", users));
}

export type DeleteUserRequestBody = SurveyUser;

export async function DELETE(
  request: Request,
  context: { params: Record<string, string> }
) {
  const surveyName = context.params["surveyName"];
  const userToDelete: PostUserRequestBody = await request.json();

  if (!surveyName) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  await kv.lrem(getSurveyUsersKey(surveyName), 1, userToDelete);
  const users = await getUsers(surveyName);
  return NextResponse.json(createResponse<Option[]>("User created", users));
}
