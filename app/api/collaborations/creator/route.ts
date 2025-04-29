import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Collaboration from '@/models/collaboration';
import Business from '@/models/business';

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId');

    if (!creatorId) {
      return NextResponse.json({ error: "Missing creatorId" }, { status: 400 });
    }

    // Populate the brand details
    const collaborations = await Collaboration.find({ creatorId })
      .populate({
        path: "brandId",
        model: Business,
        select: "name",
      });

    // Format collaborations nicely
    const formattedCollaborations = collaborations.map((collab) => ({
      ...collab.toObject(),
      brandName: collab.brandId?.name || "Unknown Brand",
    }));

    return NextResponse.json(formattedCollaborations, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
