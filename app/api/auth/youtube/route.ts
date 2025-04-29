import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/auth");

  authUrl.searchParams.set("client_id", process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID!);
  authUrl.searchParams.set("redirect_uri", process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI!);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/youtube.readonly");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  return NextResponse.redirect(authUrl.toString());
}
