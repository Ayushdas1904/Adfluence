import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db"; // Adjust if your path is different
import Collaboration from "@/models/collaboration"; // Adjust if your path is different

export async function PUT(req: NextRequest) {
  try {
    const { collaborationId, status } = await req.json();

    if (!collaborationId || !status) {
      return NextResponse.json({ message: "Missing collaborationId or status" }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await Collaboration.findByIdAndUpdate(
      collaborationId,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Collaboration not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
