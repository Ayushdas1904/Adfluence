import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channelId");

  if (!channelId) {
    return NextResponse.json({ error: "Channel ID is required" }, { status: 400 });
  }

  try {
    console.log("Connecting to the database...");
    await connectToDatabase();

    console.log("Fetching user with channelId:", channelId);
    const user = await User.findOne({ channelId });

    if (!user) {
      console.log("User not found for channelId:", channelId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = {
      channelId: user.channelId,
      channelName: user.channelName,
      profilePicture: user.profilePicture,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      expiresAt: user.expiresAt,
      subscriberCount: user.subscriberCount,
      viewCount: user.viewCount,
      videoCount: user.videoCount,
      isPro: user.isPro,
    };

    console.log("Fetched user data:", userData);

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
