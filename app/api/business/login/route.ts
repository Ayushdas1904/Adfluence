import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Business from "@/models/business";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  await connectToDatabase();

  const { email, password } = await req.json();

  const business = await Business.findOne({ email });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const isPasswordCorrect = await bcrypt.compare(password, business.password);

  if (!isPasswordCorrect) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // ✅ Mark user as logged in
  business.isLoggedIn = true;
  await business.save();

  // Return the brandId in the response
  return NextResponse.json({
    message: "Login successful",
    brandId: business._id.toString(), // Include the brandId (business ID)
  });
}
