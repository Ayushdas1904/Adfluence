"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageLoading } from "@/components/ui/message-loading";

type Collaboration = {
  _id: string;
  brandName: string;
  status: string;
};

export default function CreatorProfilePage() {
  const [profile, setProfile] = useState<{
    channelName: string;
    profilePicture: string;
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
    bio: string;
    isPro: boolean;
  } | null>(null);

  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [error] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const capitalize = (name: string) => name.toUpperCase();

  useEffect(() => {
    const channelId = searchParams.get("channelId") || localStorage.getItem("channelId");
    if (!channelId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/profile?channelId=${channelId}`);
        const profileData = await res.json();
        if (profileData.error) throw new Error(profileData.error);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchCollaborations = async () => {
      try {
        const res = await fetch(`/api/collaborations/creator?creatorId=${channelId}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setCollaborations(data);
      } catch (error) {
        console.error("Error fetching collaborations:", error);
      }
    };

    fetchProfile();
    fetchCollaborations();
  }, [searchParams]);

  if (error)
    return <div className="text-red-500 p-4">{error}</div>;

  if (!profile)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <MessageLoading />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen w-full p-6 bg-[#0e0e0e] text-white transition-colors duration-300">
      {/* Dashboard Title */}
      <div className="text-4xl font-extrabold text-center mb-8 tracking-wide text-yellow-400">
        CREATOR&apos;S DASHBOARD
      </div>

      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-8 mb-8 w-full bg-[#1a1a1a] p-6 rounded-xl shadow-xl">
        {/* Left: Profile Info */}
        <div className="flex items-center gap-6">
          <Image
            src={profile.profilePicture.replace("=s88", "=s800")}
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-yellow-500"
            unoptimized
          />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-yellow-400">{profile.channelName}</h2>
            <div className="mt-4 flex space-x-8 text-sm">
              <div>
                <p className="font-semibold text-white">{profile.subscriberCount}</p>
                <p className="text-gray-400">Subscribers</p>
              </div>
              <div>
                <p className="font-semibold text-white">{profile.viewCount}</p>
                <p className="text-gray-400">Views</p>
              </div>
              <div>
                <p className="font-semibold text-white">{profile.videoCount}</p>
                <p className="text-gray-400">Videos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Pro Tag + Logout */}
        <div className="flex flex-col items-end space-y-4">
          {profile.isPro ? (
            <div className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-3xl shadow-md animate-pulse">
              🌟 Pro Creator
            </div>
          ) : (
            <Button
              className="bg-yellow-500 text-black font-bold hover:bg-yellow-600 rounded-lg shadow-md"
              onClick={() => {
                window.location.href = "/main/upgrade";
              }}
            >
              Upgrade to Pro 🚀
            </Button>
          )}

          <Button
            className="px-4 py-2 bg-yellow-500 text-black font-bold hover:bg-yellow-600 rounded-3xl shadow-md"
            onClick={() => {
              const channelId = searchParams.get("channelId") || localStorage.getItem("channelId");
              if (channelId)
                window.open(`https://www.youtube.com/channel/${channelId}`, "_blank");
            }}
          >
            ▶️ Visit YouTube Channel
          </Button>
          <Button
            variant={"destructive"}
            onClick={async () => {
              try {
                const res = await fetch("/api/logout", { method: "POST" });
                if (res.ok) {
                  localStorage.removeItem("userType");
                  localStorage.removeItem("channelId");
                  window.location.href = "/";
                } else {
                  console.error("Logout failed:", await res.text());
                }
              } catch (err) {
                console.error("Logout error:", err);
              }
            }}
            className="text-white rounded-3xl font-semibold border border-red-400 bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Collaborations Section */}
      <div className="mt-4 bg-[#1c1c1c] border border-gray-700 p-6 rounded-xl shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Your Collaborations</h2>
        {collaborations.length === 0 ? (
          <p className="text-gray-400">No collaborations yet.</p>
        ) : (
          <div className="space-y-4">
            {collaborations.map((collab) => (
              <div
                key={collab._id}
                className="p-4 bg-gradient-to-r from-[#27272a] to-[#3f3f46] rounded-lg shadow-inner border border-gray-600"
              >
                <h3 className="text-lg font-semibold text-white">
                  Brand: <span className="text-yellow-300">{capitalize(collab.brandName)}</span>
                </h3>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span className="font-medium text-green-400">{collab.status}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
