import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";

export async function refreshAccessToken(youtubeId: string) {
  await connectToDatabase();
  const user = await User.findOne({ youtubeId });

  if (!user || !user.refreshToken) {
    throw new Error("No refresh token found");
  }

  // Check if token is expired
  if (Date.now() < user.expiresAt) {
    return user.accessToken; // Token still valid
  }

  try {
    // 🌟 Refresh Token API Call
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        refresh_token: user.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const tokenData = await response.json();
    if (!tokenData.access_token) throw new Error("Failed to refresh access token");

    // 🌟 Update MongoDB with New Token
    await User.findOneAndUpdate(
      { youtubeId },
      {
        accessToken: tokenData.access_token,
        expiresAt: Date.now() + tokenData.expires_in * 1000,
      },
      { new: true }
    );

    return tokenData.access_token;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
}
