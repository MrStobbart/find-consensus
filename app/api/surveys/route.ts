import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { Option, Survey, getOptionsKey } from "../../types";
import { surveysKey } from "../../redisKeys";
import { createResponse } from "../../helpers";
import { getSurveys } from "../apiHelpers";

export async function GET() {
  const surveys = await getSurveys();
  return NextResponse.json(createResponse("The surveys", surveys));
}
