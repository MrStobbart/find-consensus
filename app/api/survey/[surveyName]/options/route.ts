import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { createResponse } from "../../../../helpers";
import { getSurveyIndexKey, surveysKey } from "../../../../redisKeys";
import { Option, getOptionsKey } from "../../../../types";

export const getOptions = async (surveyName: string) => {
  const options = await kv.lrange<Option>(getOptionsKey(surveyName), 0, -1);
  return options.reverse();
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
    const options = await getOptions(surveyName);
    return NextResponse.json(createResponse("Here are your options", options));
  } catch (error) {
    console.error(error);
  }
}
