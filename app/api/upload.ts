import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const { image } = await req.json();

  if (!image) {
    return NextResponse.json({ message: "No image provided" }, { status: 400 });
  }

  const uploadResponse = await cloudinary.uploader.upload(image, {
    folder: "business_documents", // Change folder name if needed
  });

  return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });
}
