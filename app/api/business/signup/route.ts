// /app/api/business/signup/route.ts

import { connectToDatabase } from "@/lib/db";
import Business from "@/models/business";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectToDatabase();

  const formData = await req.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const website = formData.get("website") as string;
  const licenseNumber = formData.get("licenseNumber") as string;
  const file = formData.get("document") as File;

  if (!file || file.size === 0) {
    return new Response("Document file is required", { status: 400 });
  }

  // Prepare upload to Cloudinary
  const uploadForm = new FormData();
  uploadForm.append("file", file); // File object from formData
  uploadForm.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

  const cloudRes = await fetch(process.env.CLOUDINARY_UPLOAD_URL!, {
    method: "POST",
    body: uploadForm,
  });

  const cloudData = await cloudRes.json();

  if (!cloudData.secure_url) {
    return new Response("Cloudinary upload failed", { status: 500 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const business = new Business({
    name,
    email,
    password: hashedPassword,
    website,
    licenseNumber,
    document: cloudData.secure_url,
    verified: false,
    isLoggedIn: false,
  });

  await business.save();

  return new Response("Business registered successfully", { status: 201 });
}
