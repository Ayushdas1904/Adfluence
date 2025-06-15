"use client";

import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<{
    channelName: string;
    profilePicture: string;
  } | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const channelId = localStorage.getItem("channelId");
      if (!channelId) return;

      const res = await fetch(`/api/user-status`, {
        headers: { "x-channel-id": channelId },
      });

      const data = await res.json();
      if (data.isLoggedIn) {
        setIsLoggedIn(true);

        const profileRes = await fetch(`/api/user/profile?channelId=${channelId}`);
        const profileData = await profileRes.json();

        setProfile({
          channelName: profileData.channelName,
          profilePicture: profileData.profilePicture.replace("=s88", "=s800"),
        });
      }
    };

    checkStatus();
  }, []);

  // const handleLogout = async () => {
  //   await fetch("/api/logout", { method: "POST" });
  //   localStorage.removeItem("channelId");
  //   router.push("/");
  //   window.location.reload();
  // };

  return (
    <header className="bg-gray-300 text-black dark:bg-black dark:text-white p-4">

        <Image
          src="/adfluence.png"
          alt="ADfluence Logo"
          width={200}
          height={200}
          className="rounded-full dark:invert fixed left-0 top-[-40px]"
        />

        <div className="flex items-center space-x-4 fixed right-10 top-10">
          <ThemeToggle />
          {isLoggedIn && profile ? (
            <Image
              src={profile.profilePicture}
              alt={profile.channelName}
              width={40}
              height={40}
              className="rounded-full border border-gray-400 dark:border-gray-600"
            />
          ) : null}
        </div>
        
    </header>
  );
}
