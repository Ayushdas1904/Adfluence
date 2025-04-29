// /app/api/logout/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user"; // your user model
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = cookies();
  const channelId = (await cookieStore).get("channelId")?.value;

  try {
    await connectToDatabase();
    if (channelId) {
      await User.findOneAndUpdate({ channelId }, { isLoggedIn: false });
    }

    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.delete("channelId");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
