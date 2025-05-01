"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageLoading } from "@/components/ui/message-loading";


type Creator = {
  _id: string;
  channelId: number;
  channelName: string;
  niche: string;
  subscriberCount: number;
  viewCount: number;  
  profilePicture: string;
};

type Business = {
  _id: string;
  name: string;
  email: string;
  website: string;
  licenseNumber: string;
};

export default function MainPage() {
  const [userType, setUserType] = useState<"creator" | "business" | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
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
          setCreators(data);

          const grouped: Record<string, Creator[]> = {};
          data.forEach((creator) => {
            const nicheKey = creator.niche || "Other";
            if (!grouped[nicheKey]) {
              grouped[nicheKey] = [];
            }
            grouped[nicheKey].push(creator);
          });
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
              className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-5 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition cursor-pointer text-white"
            >
              <h2 className="text-2xl font-bold">{b.name}</h2>
              <p className="text-sm mt-2">Email: {b.email}</p>
              <p className="text-sm">Website: {b.website}</p>
              <p className="text-sm">License #: {b.licenseNumber}</p>
            </div>
          ))}

        {userType === "business" &&
          Object.entries(groupedCreators).map(([niche, users]) => (
            <div
              key={niche}
              className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-5 rounded-2xl hover:shadow-xl transition text-white"
            >
              
              <h2 className="text-2xl font-bold mb-3">{capitalize(niche)}</h2>
              <p className="mb-4 text-sm text-zinc-400">{users.length} creator{users.length > 1 ? "s" : ""}</p>

              <div className="space-y-4">
                {users.map((creator, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCreatorClick(creator.channelId)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-700 transition cursor-pointer"
                  >

                    <img
                      src={creator.profilePicture}
                      alt={`${creator.channelName} profile`}
                      className="w-14 h-14 rounded-full object-cover border-2 border-pink-500"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{creator.channelName}</h3>
                      <p className="text-sm text-zinc-400">Subs: {creator.subscriberCount}</p>
                      <p className="text-sm text-zinc-400">Views: {creator.viewCount}</p>
                      <p className="text-sm text-zinc-400">Niche: {creator.niche}</p>
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
