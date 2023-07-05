import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { Survey } from "../../types";

export async function GET() {
  if (true) {
    const mockData: Survey[] = [
      { name: "mock1", options: [] },
      { name: "mock2", options: [] },
      { name: "mock3", options: [] },
    ];
    return NextResponse.json({
      successful: true,
      data: mockData,
      message: "here is the survey",
    });
  }
  return NextResponse.json({
    successful: false,
    message: "You must provide a name",
  });
}
