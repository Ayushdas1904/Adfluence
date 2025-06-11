"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageLoading } from "@/components/ui/message-loading";

interface UserData {
  channelId: string;
  channelName: string;
  profilePicture: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

export default function OtherCreatorProfilePage() {
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
    return <div className="p-4 text-red-500 dark:text-red-400">User not found</div>;

  return (
    <div className="flex flex-col min-h-screen w-full p-6 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      {/* Header Title */}
      <div className="text-4xl font-extrabold text-center mb-8 tracking-wide text-yellow-600 dark:text-yellow-400">
        CREATOR'S PROFILE
      </div>

      {/* Profile Card */}
      <div className="flex flex-wrap items-center justify-between gap-8 mb-8 w-full bg-gray-100 dark:bg-[#1a1a1a] p-6 rounded-xl shadow-xl">
        {/* Left: Profile Info */}
        <div className="flex items-center gap-6">
          <Image
            src={userData.profilePicture.replace("=s88", "=s800")}
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-yellow-600 dark:border-yellow-500"
            unoptimized
          />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {userData.channelName}
            </h2>
            <div className="mt-4 flex space-x-8 text-sm">
              <div>
                <p className="font-semibold">{userData.subscriberCount}</p>
                <p className="text-gray-600 dark:text-gray-400">Subscribers</p>
              </div>
              <div>
                <p className="font-semibold">{userData.viewCount}</p>
                <p className="text-gray-600 dark:text-gray-400">Views</p>
              </div>
              <div>
                <p className="font-semibold">{userData.videoCount}</p>
                <p className="text-gray-600 dark:text-gray-400">Videos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="bg-gray-100 dark:bg-[#1c1c1c] border border-gray-300 dark:border-gray-700 p-6 rounded-xl shadow-md w-full space-y-4">
        <h2 className="text-2xl font-bold mb-2 text-yellow-600 dark:text-yellow-400">
          Take Action
        </h2>

        <Button
          className="w-full bg-yellow-500 text-black font-bold hover:bg-yellow-600 rounded-lg shadow-md"
          onClick={() =>
            router.push(`/main/chat?creatorId=${channelId}&brandId=${brandId}`)
          }
        >
          💬 Chat with Creator
        </Button>
        <Button
          className="w-full bg-yellow-500 text-black font-bold hover:bg-yellow-600 rounded-lg shadow-md"
          onClick={() =>
            router.push(`/main/collaborate?creatorId=${channelId}&brandId=${brandId}`)
          }
        >
          🤝 Collaborate
        </Button>
        <Button
          className="w-full bg-yellow-500 text-black font-bold hover:bg-yellow-600 rounded-lg shadow-md"
          onClick={handleScheduleMeet}
        >
          📅 Schedule Google Meet
        </Button>
        <Button
          className="w-full bg-yellow-500 text-black font-bold hover:bg-yellow-600 rounded-lg shadow-md"
          onClick={() =>
            window.open(`https://www.youtube.com/channel/${userData.channelId}`, "_blank")
          }
        >
          ▶️ Visit YouTube Channel
        </Button>
      </div>
    </div>
  );
}
