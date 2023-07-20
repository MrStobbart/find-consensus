import { NextResponse } from "next/server";
import { createResponse } from "../../../../helpers";
import { getOptions } from "../../../apiHelpers";

export const revalidate = 0;

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
