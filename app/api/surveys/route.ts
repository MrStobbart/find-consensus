import { NextResponse } from "next/server";
import { createResponse } from "../../helpers";
import { getSurveys } from "../apiHelpers";

export const revalidate = 0;

export async function GET() {
  const surveys = await getSurveys();
  return NextResponse.json(createResponse("The surveys", surveys));
}
