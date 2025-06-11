import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const niche = searchParams.get("niche");

    const query = niche ? { niche } : {};

    const creators = await User.find(query).select("-_id channelName niche subscriberCount viewCount videoCount profilePicture channelId isPro");

    return NextResponse.json(creators);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
