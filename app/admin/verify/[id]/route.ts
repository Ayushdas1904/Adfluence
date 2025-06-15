import { connectToDatabase } from "@/lib/db";
import Business from "@/models/business";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  await Business.findByIdAndUpdate(params.id, { verified: true });

  return new Response("Business verified successfully", { status: 200 });
}
