import { connectToDatabase } from "@/lib/db";
import Business from "@/models/business";
import { NextRequest, NextResponse } from "next/server";

type BusinessType = {
  _id: string;
  name: string;
  email: string;
  website: string;
  licenseNumber: string;
  document: string;
  verified: boolean;
  isLoggedIn: boolean;
  password?: string;
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const email = req.headers.get("x-business-email");
    if (!email) {
      return NextResponse.json({ error: "Business email header is missing" }, { status: 400 });
    }

    const business = await Business.findOne({ email }).lean<BusinessType>();
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const { password, ...businessData } = business;
    return NextResponse.json(businessData, { status: 200 });
    
  } catch (err) {
    console.error("Error fetching business profile:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
