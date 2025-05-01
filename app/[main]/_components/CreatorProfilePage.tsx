"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageLoading } from "@/components/ui/message-loading";

export default function CreatorProfilePage() {
  const [profile, setProfile] = useState<{
    channelName: string;
    profilePicture: string;
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
    bio: string;
    isPro: boolean; // Adding isPro to track pro status
  } | null>(null);

  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const capitalize = (name: string) => name.toUpperCase();

  useEffect(() => {
    const channelId = searchParams.get("channelId") || localStorage.getItem("channelId");

    if (!channelId) return;

    // Fetch profile data
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

    // Fetch collaborations data
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

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!profile) return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <MessageLoading />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-full p-6 bg-gray-100 dark:bg-black transition-colors duration-300">
      {/* Dashboard Title */}
      <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        CREATOR'S DASHBOARD
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-center mb-6 w-full gap-16">
        {/* Left: Profile Info */}
        <div className="flex items-center gap-6">
          <Image
            src={profile.profilePicture.replace("=s88", "=s800")}
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-gray-300 dark:border-gray-600"
            unoptimized
          />
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{profile.channelName}</h2>
            {/* Stats */}
            <div className="mt-4 flex space-x-8">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{profile.subscriberCount}</p>
                <p className="text-gray-500 dark:text-gray-400">Subscribers</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{profile.viewCount}</p>
                <p className="text-gray-500 dark:text-gray-400">Views</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{profile.videoCount}</p>
                <p className="text-gray-500 dark:text-gray-400">Videos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Logout Button */}
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
          className="text-white font-semibold hover:underline"
        >
          Logout
        </Button>

        {/* Conditional Render for Pro Creator */}
        {profile.isPro ? (
          <div className="mt-4 self-center">
            <div className="text-xl font-semibold text-yellow-500 bg-black p-2 rounded-lg">
              Pro Creator 🌟
            </div>
          </div>
        ) : (
          <div className="mt-4 self-center">
            <Button
              className="bg-yellow-500 text-black font-bold hover:bg-yellow-600"
              onClick={() => {
                window.location.href = "/main/upgrade";
              }}
            >
              Upgrade to Pro 🚀
            </Button>
          </div>
        )}
      </div>

      {/* Collaborations Section */}
      <div className="mt-8 bg-white border dark:bg-black p-6 rounded-xl shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Your Collaborations</h2>

        {collaborations.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">No collaborations yet.</p>
        ) : (
          <div className="space-y-4">
            {collaborations.map((collab) => (
              <div key={collab._id} className="p-4 bg-gray-100 dark:bg-orange-900 rounded-lg">
                <h3 className="text-xl font-semibold">Brand : {capitalize(collab.brandName)}</h3>
                <p>Status: <span className="font-medium text-green-500">{collab.status}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
