import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Business from "@/models/business";

export async function PATCH(
  req: NextRequest
) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // or use regex to extract [id]

  await connectToDatabase();
  await Business.findByIdAndUpdate(id, { verified: true });

  return NextResponse.json({ success: true });
}
