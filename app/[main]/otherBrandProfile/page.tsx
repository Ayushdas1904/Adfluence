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
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black">
        <MessageLoading />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4 py-10">
      <div className="w-full max-w-xl p-6 rounded-2xl bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl relative overflow-hidden">

        {/* Gradient Border Overlay */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 opacity-20 pointer-events-none z-0" />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
            {brand.name}
          </h1>

          <p className="text-gray-700 dark:text-gray-300 mb-2 text-center">
            <span className="font-medium">Email:</span> {brand.email}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-2 text-center">
            <span className="font-medium">Website:</span>{" "}
            <a
              href={brand.website}
              target="_blank"
              className="text-blue-500 underline hover:text-blue-400"
            >
              {brand.website}
            </a>
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
            <span className="font-medium">License:</span> {brand.licenseNumber}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() =>
                router.push(`/main/chat?creatorId=${creatorId}&brandId=${brandId}`)
              }
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-5 rounded-full shadow-md hover:opacity-90 transition"
            >
              Chat With Brand
            </button>

            <button
              onClick={() =>
                router.push(`/main/collaborate?creatorId=${creatorId}&brandId=${brandId}`)
              }
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-2 px-5 rounded-full shadow-md hover:opacity-90 transition"
            >
              Propose Collaboration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
