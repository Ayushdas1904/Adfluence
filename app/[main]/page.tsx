"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageLoading } from "@/components/ui/message-loading";
import Link from "next/link";
import Image from "next/image";

type Creator = {
  _id: string;
  channelId: number;
  channelName: string;
  niche: string;
  subscriberCount: number;
  viewCount: number;
  profilePicture: string;
  isPro?: boolean;
};

type Business = {
  _id: string;
  name: string;
  email: string;
  website: string;
  licenseNumber: string;
  verified?: boolean;
};

export default function MainPage() {
  const [userType, setUserType] = useState<"creator" | "business" | null>(null);
  const [groupedCreators, setGroupedCreators] = useState<Record<string, Creator[]>>({});
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [creatorChannelId, setCreatorChannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const capitalize = (str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    const type = localStorage.getItem("userType") as "creator" | "business" | null;
    const storedBrandId = localStorage.getItem("brandId");
    const storedChannelId = localStorage.getItem("channelId");

    setUserType(type);
    if (storedBrandId) setBrandId(storedBrandId);
    if (storedChannelId) setCreatorChannelId(storedChannelId);

    const fetchData = async () => {
      try {
        if (type === "creator") {
          const res = await fetch("/admin/businesses");
          const data = await res.json();
          setBusinesses(data);
        } else if (type === "business") {
          const res = await fetch("/api/users");
          const data: Creator[] = await res.json();

          const grouped: Record<string, Creator[]> = {};
          data.forEach((creator) => {
            const nicheKey = creator.niche || "Other";
            if (!grouped[nicheKey]) {
              grouped[nicheKey] = [];
            }
            grouped[nicheKey].push(creator);
          });

          // Sort each niche group by isPro (true first)
          for (const niche in grouped) {
            grouped[niche].sort((a, b) => {
              const aPro = a.isPro ? 1 : 0;
              const bPro = b.isPro ? 1 : 0;
              return bPro - aPro; // Pro creators first
            });
          }

          setGroupedCreators(grouped);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (type) fetchData();
  }, []);

  const handleCreatorClick = (channelId: number) => {
    if (!channelId || !brandId) return;
    router.push(`/main/otherCreatorProfile?creatorId=${channelId}&brandId=${brandId}`);
  };

  const handleBrandClick = (brandChannelId: string) => {
    if (!creatorChannelId || !brandChannelId) return;
    router.push(`/main/otherBrandProfile?creatorId=${creatorChannelId}&brandId=${brandChannelId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <MessageLoading />
      </div>
    );
  }

  if (!userType) {
    return <div className="text-center mt-10 text-red-500">User type not found. Please log in.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-black p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
        {userType === "creator" ? "Explore Brands & Businesses" : "Explore Creators by Niche"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userType === "creator" &&
          businesses.map((b, idx) => (
            <div
              key={idx}
              onClick={() => handleBrandClick(b._id)}
              className="bg-[#1a1a1a] border border-gray-700 p-5 rounded-xl hover:bg-[#2a2a2a] hover:shadow-md transition cursor-pointer text-white"
            >
              <h2 className="text-2xl font-bold mb-2">{b.name}</h2>
              <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 text-sm">
                <p>Email: {b.email}</p>
                <p>
                  Website:{" "}
                  <Link
                    href={b.website.startsWith("http") ? b.website : `https://${b.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline"
                  >
                    {b.website}
                  </Link>
                </p>
                <p>License #: {b.licenseNumber}</p>
                <p>
                  Verified:{" "}
                  <span className={b.verified ? "text-green-400" : "text-red-400"}>
                    {b.verified ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </div>
          ))}

        {userType === "business" &&
          Object.entries(groupedCreators).map(([niche, users]) => (
            <div
              key={niche}
              className="bg-[#1a1a1a] border border-gray-700 p-5 rounded-xl hover:bg-[#2a2a2a] hover:shadow-md transition text-white"
            >
              {/* <h2 className="text-2xl font-bold mb-3">{capitalize(niche)}</h2> */}
              <Link href={`/main/niche/${encodeURIComponent(niche)}`}>
                <h2 className="text-2xl font-bold mb-3 hover:underline text-teal-400 cursor-pointer">
                  {capitalize(niche)}
                </h2>
              </Link>

              <p className="mb-4 text-sm text-zinc-300">
                {users.length} creator{users.length > 1 ? "s" : ""}
              </p>

              <div className="space-y-4">
                {users.map((creator, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCreatorClick(creator.channelId)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#333] transition cursor-pointer"
                  >
                    <Image
                      src={creator.profilePicture}
                      alt={`${creator.channelName} profile`}
                      className={`w-14 h-14 rounded-full object-cover border-2 ${creator.isPro ? "border-yellow-400" : "border-pink-500"}`}
                      width={56}
                      height={56}
                    />
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {creator.channelName}
                          {creator.isPro && <span className="ml-2 text-yellow-400 text-xs">PRO</span>}
                        </h3>
                      </div>
                      <p>Subs: {creator.subscriberCount}</p>
                      <p>Views: {creator.viewCount}</p>
                      <p>Niche: {creator.niche}</p>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
