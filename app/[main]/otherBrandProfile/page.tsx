"use client";

import { MessageLoading } from "@/components/ui/message-loading";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Brand = {
  _id: string;
  name: string;
  email: string;
  website: string;
  licenseNumber: string;
  verified: boolean;
};

export default function OtherBrandProfile() {
  const searchParams = useSearchParams();
  const brandId = searchParams.get("brandId");
  const creatorId = searchParams.get("creatorId");
  const router = useRouter();

  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch(`/api/business/profile?brandId=${brandId}`);
        const data = await res.json();
        setBrand(data);
      } catch (err) {
        console.error("Error fetching brand details:", err);
      }
    };

    if (brandId) fetchBrand();
  }, [brandId]);

  if (!brand)
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0e0e0e]">
        <MessageLoading />
      </div>
    );

  // Ensure website URL starts with https://
  const websiteUrl = brand.website.startsWith("https://")
    ? brand.website
    : `https://${brand.website}`;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0e0e0e] px-4 py-10">
      <div className="w-full max-w-xl p-8 rounded-xl bg-[#1a1a1a] border border-gray-700 shadow-md">

        <h1 className="text-3xl font-extrabold text-yellow-400 text-center mb-6">
          {brand.name}
        </h1>

        <div className="space-y-4 text-center">
          <div className="flex justify-between items-center">
            <p className="text-base text-gray-200">
              <span className="font-medium text-gray-400">Email:</span> {brand.email}
            </p>
            <p className="text-base text-gray-200">
              <span className="font-medium text-gray-400">Website:</span>{" "}
              <a
                href={websiteUrl} // Ensure it uses HTTPS
                target="_blank"
                className="text-yellow-400 underline hover:text-yellow-300 transition"
              >
                {brand.website}
              </a>
            </p>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-base text-gray-200">
              <span className="font-medium text-gray-400">License:</span> {brand.licenseNumber}
            </p>
            <p className="text-base text-gray-200">
              <span className="font-medium text-gray-400">Verified:</span>{" "}
              <span
                className={`font-semibold ${
                  brand.verified ? "text-green-400" : "text-red-600"
                }`}
              >
                {brand.verified ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center flex-wrap gap-4">
          <button
            onClick={() =>
              router.push(`/main/chat?creatorId=${creatorId}&brandId=${brandId}`)
            }
            className="bg-red-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-red-500 transition"
          >
            Chat With Brand
          </button>

          <button
            onClick={() =>
              router.push(`/main/collaborate?creatorId=${creatorId}&brandId=${brandId}`)
            }
            className="bg-yellow-500 text-black font-semibold py-2 px-5 rounded-md hover:bg-yellow-400 transition"
          >
            Propose Collaboration
          </button>
        </div>
      </div>
    </div>
  );
}
