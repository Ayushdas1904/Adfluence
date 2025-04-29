import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Business from "@/models/business";

export async function GET(req: Request) {
  await connectToDatabase();

  const businessEmail = req.headers.get("x-business-email");

  if (!businessEmail) {
    return NextResponse.json({ error: "Missing business email" }, { status: 400 });
  }

  const business = await Business.findOne({ email: businessEmail });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  return NextResponse.json({
    isLoggedIn: business.isLoggedIn || false,
  });
}
