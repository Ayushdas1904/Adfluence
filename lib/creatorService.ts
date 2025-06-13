import Creator from "@/models/creator";
import { connectToDatabase } from "@/lib/db";

export const storeCreatorData = async (
  userId: string,
  data: Record<string, unknown>
) => {
  await connectToDatabase();
  await Creator.findOneAndUpdate({ userId }, data, { upsert: true, new: true });
};
