import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { Option, Survey, getOptionsKey } from "../../types";
import { surveysKey } from "../../redisKeys";
import { createResponse } from "../../helpers";

export const getSurveys = async () => {
  const surveys = await kv.lrange<Survey>(surveysKey, -20, -1);
  return surveys.reverse();
};

export async function GET() {
  const surveys = await getSurveys();
  return NextResponse.json(createResponse("The surveys", surveys));
}
