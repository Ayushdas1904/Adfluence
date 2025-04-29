// /app/api/user-status/route.ts (Next.js 13+/app dir)
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const channelId = req.headers.get("x-channel-id"); // custom header

  if (!channelId) {
    return NextResponse.json({ isLoggedIn: false });
  }

  await connectToDatabase();
  const user = await User.findOne({ channelId });

  return NextResponse.json({ isLoggedIn: !!user });
}
