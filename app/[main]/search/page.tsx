"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageLoading } from "@/components/ui/message-loading";
import Image from "next/image";

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

export default function SearchPage() {
    const [userType, setUserType] = useState<"creator" | "business" | null>(null);
    const [creators, setCreators] = useState<Creator[]>([]);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [brandId, setBrandId] = useState<string | null>(null);
    const [creatorChannelId, setCreatorChannelId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const query = searchParams.get("query")?.toLowerCase() || "";
    const router = useRouter();

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
                }
            } catch (err) {
                console.error("Fetch error:", err);
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

    const handleBrandClick = (brandIdParam: string) => {
        if (!creatorChannelId || !brandIdParam) return;
        router.push(`/main/otherBrandProfile?creatorId=${creatorChannelId}&brandId=${brandIdParam}`);
    };

    const filteredCreators = creators.filter((c) =>
        c.channelName.toLowerCase().includes(query) ||
        c.niche.toLowerCase().includes(query)
    );

    const filteredBusinesses = businesses.filter((b) =>
        b.name.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.website.toLowerCase().includes(query)
    );

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <MessageLoading />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-black flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
                Search
            </h1>

            {/* Search Bar */}
            <div className="w-full sticky top-0 z-10 bg-gray-100 dark:bg-black py-4 px-6 flex justify-center">
                <div className="w-full max-w-md">
                    <input
                        type="text"
                        placeholder={`Search for ${userType === "creator" ? "businesses" : "creators"}...`}
                        value={query}
                        onChange={(e) => router.push(`/main/search?query=${e.target.value}`)}
                        className="px-4 py-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 text-white focus:outline-none"
                    />
                </div>
            </div>


            {/* Display Results */}
            {query && (
                <>
                    {userType === "creator" && (
                        <div className="w-full max-w-md max-h-[500px] overflow-y-auto space-y-4">
                            {filteredBusinesses.length > 0 ? (
                                filteredBusinesses.map((b, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleBrandClick(b._id)}
                                        className=" bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-5 rounded-2xl hover:shadow-xl hover:scale-[1.02] transition cursor-pointer text-white"
                                    >
                                        <h2 className="text-2xl font-bold">{b.name}</h2>
                                        
                                        <p className="text-sm mt-2">Email: {b.email}</p>
                                        <p className="text-sm">Website: {b.website}</p>
                                        <p className="text-sm">License #: {b.licenseNumber}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-zinc-400 mt-10">No matching businesses found.</div>
                            )}
                        </div>
                    )}

                    {userType === "business" && (
                        <div className="w-full max-w-md max-h-[500px] overflow-y-auto space-y-4">
                            {filteredCreators.length > 0 ? (
                                filteredCreators.map((creator, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleCreatorClick(creator.channelId)}
                                        className="flex flex-col bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 p-5 rounded-2xl hover:shadow-xl transition cursor-pointer text-white"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Image
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
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-zinc-400 mt-10">No matching creators found.</div>
                            )}
                        </div>
                    )}
                </>
            )}

            {!query && (
                <div className="text-center text-zinc-400 mt-10">Please enter a search term.</div>
            )}
        </div>
    );
}
