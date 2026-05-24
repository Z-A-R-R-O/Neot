import { NextResponse } from "next/server";
import { aiService } from "@/lib/ai/ai-service";

export async function GET() {
  const report = aiService.getUsageReport();
  return NextResponse.json(report);
}
