import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";

interface UpdateData {
  channelId: string;
  channelName: string;
  profilePicture: string;
  accessToken: string;
  expiresAt: number;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  refreshToken?: string;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Authorization code missing" }, { status: 400 });
  }

  try {
    // 🌟 Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error("Failed to retrieve token:", tokenData);
      return NextResponse.redirect(new URL("/?error=Token fetch failed", req.nextUrl.origin));
    }

    // 🌟 Fetch YouTube Channel Data
    const userResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
        },
      }
    );

    const userData = await userResponse.json();
    if (!userData.items || userData.items.length === 0) {
      console.error("YouTube data fetch failed:", userData);
      return NextResponse.redirect(new URL("/?error=YouTube data fetch failed", req.nextUrl.origin));
    }

    // 🌟 Extract channel details
    const channel = userData.items[0];
    const updateData: UpdateData = {
      channelId: channel.id,
      channelName: channel.snippet.title,
      profilePicture: channel.snippet.thumbnails.high.url,
      accessToken: tokenData.access_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
      subscriberCount: channel.statistics.subscriberCount || 0,
      viewCount: channel.statistics.viewCount,
      videoCount: channel.statistics.videoCount,
    };

    if (tokenData.refresh_token) {
      updateData.refreshToken = tokenData.refresh_token;
    }

    // 🌟 Store/update user in MongoDB
    await connectToDatabase();

    // ✅ Safety: Skip if channel.id is undefined/null
    if (!channel?.id) {
      console.error("Missing channel ID from YouTube data");
      return NextResponse.redirect(new URL("/?error=Missing Channel ID", req.nextUrl.origin));
    }

    let existingUser = await User.findOne({ channelId: channel.id });

    if (existingUser) {
      existingUser = await User.findOneAndUpdate(
        { channelId: channel.id },
        {
          $set: {
            ...updateData,
            isLoggedIn: true,
          },
        },
        { new: true } // returns the updated document directly
      );
      
      // // 💥 Fetch updated user again after updateOne
      // existingUser = await User.findOne({ channelId: channel.id });

      // ✅ Redirect to profile if already completed
      if (existingUser.isProfileComplete) {
        const redirectUrl = new URL("/main/profile", req.nextUrl.origin);
        return NextResponse.redirect(redirectUrl);
      }
    } 
    
    else {
      // 👇 Create new user
      await User.create({
        ...updateData,
        isLoggedIn: true,
        isProfileComplete: false,
      });
    }

    // 🚀 Redirect to complete-profile if new or incomplete
    const redirectUrl = new URL("/complete-profile", req.nextUrl.origin);
    redirectUrl.searchParams.set("channelId", channel.id);
    redirectUrl.searchParams.set("accessToken", tokenData.access_token);
    redirectUrl.searchParams.set("userType", "creator");

    if (tokenData.refresh_token) {
      redirectUrl.searchParams.set("refreshToken", tokenData.refresh_token);
    }

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error("Server error:", error);
    const url = new URL("/", req.nextUrl.origin);
    url.searchParams.set("error", "Server error");
    return NextResponse.redirect(url);
  }
}
