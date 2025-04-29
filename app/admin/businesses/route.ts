// /app/api/admin/businesses/route.ts

import { connectToDatabase } from "@/lib/db";
import Business from "@/models/business";

export async function GET() {
  await connectToDatabase();

  const businesses = await Business.find();

  return Response.json(businesses);
}
