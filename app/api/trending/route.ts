import { NextRequest, NextResponse } from "next/server";
import { getTrending } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mediaType = (searchParams.get("type") || "all") as "movie" | "tv" | "all";
  const timeWindow = (searchParams.get("window") || "week") as "day" | "week";

  try {
    const results = await getTrending(mediaType, timeWindow);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in trending API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
