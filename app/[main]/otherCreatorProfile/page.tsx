"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MessageLoading } from "@/components/ui/message-loading";

interface UserData {
  channelId: string;
  channelName: string;
  profilePicture: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

export default function OtherProfilePage() {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("creatorId");
  const brandId = searchParams.get("brandId");
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channelId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/profile?channelId=${channelId}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [channelId]);

  const handleScheduleMeet = () => {
    alert("Google Meet scheduling modal triggered");
  };

  if (loading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black">
        <MessageLoading />
      </div>
    );

  if (!userData)
    return <div className="p-4 text-red-500">User not found</div>;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-neutral-950 px-4 py-10">
      <div className="w-full max-w-2xl rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-md dark:shadow-xl transition-colors duration-300">
        <div className="flex items-center space-x-5">
          <Image
            src={userData.profilePicture}
            alt="Profile"
            width={72}
            height={72}
            className="rounded-full border border-neutral-300 dark:border-neutral-700"
          />
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {userData.channelName}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-gray-400">
              {userData.subscriberCount} subscribers
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-1 text-sm text-neutral-700 dark:text-gray-300">
          <p>
            <span className="font-medium text-neutral-900 dark:text-white">Views:</span>{" "}
            {userData.viewCount}
          </p>
          <p>
            <span className="font-medium text-neutral-900 dark:text-white">Videos:</span>{" "}
            {userData.videoCount}
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          <button
            onClick={() =>
              router.push(`/main/chat?creatorId=${channelId}&brandId=${brandId}`)
            }
            className="w-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium py-2 rounded-md transition"
          >
            Chat with Creator
          </button>
          <button
            onClick={() =>
              router.push(`/main/collaborate?creatorId=${channelId}&brandId=${brandId}`)
            }
            className="w-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium py-2 rounded-md transition"
          >
            Collaborate
          </button>
          <button
            onClick={handleScheduleMeet}
            className="w-full bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-medium py-2 rounded-md transition"
          >
            Schedule Google Meet
          </button>
        </div>
      </div>
    </div>
  );
}
