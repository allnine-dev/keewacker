import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    const results = await searchMulti(query, page);

    if (!results) {
      return NextResponse.json(
        { error: "Search failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in search API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
