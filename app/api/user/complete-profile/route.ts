import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { niche, channelId } = body;

    if (!channelId || !niche) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { channelId },
      { niche, isProfileComplete: true },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
