import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createResponse } from "../../../helpers";
import { getSurveyIndexKey, surveysKey } from "../../../redisKeys";
import { Option, getOptionsKey } from "../../../types";

export async function GET(
  request: Request,
  context: { params: Record<string, string> }
) {
  const name = context.params["surveyName"];
  if (!name) {
    return NextResponse.json(createResponse("You must provide a survey name"));
  }

  try {
    const index = await kv.get<number>(getSurveyIndexKey(name));

    if (!index) {
      return NextResponse.json(
        createResponse(`Could not find survey with name ${name}`)
      );
    }
    const survey = await kv.lindex(surveysKey, index);
    return NextResponse.json(createResponse("Here is your survey", survey));
  } catch (error) {
    console.error(error);
  }
}
