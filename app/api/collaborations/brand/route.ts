import { connectToDatabase } from "@/lib/db";
import Collaboration from "@/models/collaboration";
import { User } from "@/models/user"; // Import correctly
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get("brandId");

  if (!brandId) {
    return NextResponse.json({ error: "No brandId provided" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const collaborations = await Collaboration.find({ brandId })
      .populate({
        path: "creatorId",
        model: User,
        localField: "creatorId",
        foreignField: "channelId",
        justOne: true,
        select: "channelName profilePicture",
      });

    return NextResponse.json(collaborations);
  } catch (err) {
    console.error("Error fetching collaborations:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
