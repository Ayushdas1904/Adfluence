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
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>
          ADfluence
        </h1>
        {/* <nav>
          <ul className="flex space-x-4 gap-4">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </nav> */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isLoggedIn && profile ? (
              <Image
                src={profile.profilePicture}
                alt={profile.channelName}
                width={40}
                height={40}
                className="rounded-full border border-gray-400 dark:border-gray-600"
              />
          ) : (
            null
          )}
        </div>
      </div>
    </header>
  );
}
