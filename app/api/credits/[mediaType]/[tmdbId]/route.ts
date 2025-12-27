import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(
  request: Request,
  { params }: { params: { mediaType: string; tmdbId: string } }
) {
  const { mediaType, tmdbId } = params;

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB API key not configured" },
      { status: 500 }
    );
  }

  if (!["movie", "tv"].includes(mediaType)) {
    return NextResponse.json(
      { error: "Invalid media type" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${tmdbId}/credits?api_key=${TMDB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Process cast - take top 12
    const cast = (data.cast || []).slice(0, 12).map((person: any) => ({
      id: person.id,
      name: person.name,
      character: person.character,
      profilePath: person.profile_path,
      order: person.order,
    }));

    // Process crew - get key roles
    const keyRoles = ["Director", "Producer", "Executive Producer", "Writer", "Screenplay", "Creator"];
    const crew = (data.crew || [])
      .filter((person: any) => keyRoles.includes(person.job))
      .slice(0, 8)
      .map((person: any) => ({
        id: person.id,
        name: person.name,
        job: person.job,
        profilePath: person.profile_path,
        department: person.department,
      }));

    return NextResponse.json({
      cast,
      crew,
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    );
  }
}
