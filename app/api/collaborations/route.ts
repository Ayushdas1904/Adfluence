import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db'; // your DB connection
import Collaboration from '@/models/collaboration'; // your Collaboration model

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const { creatorId, brandId, agreementDetails } = body; // receive brandId directly from frontend

  if (!brandId) {
    return NextResponse.json({ message: 'Brand ID is required' }, { status: 400 });
  }

  try {
    const newCollaboration = await Collaboration.create({
      creatorId,
      brandId,
      status: 'pending',
      agreementDetails,
    });

    return NextResponse.json(newCollaboration, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
