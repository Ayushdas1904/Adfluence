import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Business from "@/models/business";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  await connectToDatabase();

  await Business.findByIdAndUpdate(params.id, { verified: true });

  return NextResponse.json({ message: "Business verified successfully" });
}
