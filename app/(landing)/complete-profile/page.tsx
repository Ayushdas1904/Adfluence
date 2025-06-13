"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfile() {
  const [niche, setNiche] = useState("");
  const [channelId, setChannelId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
  
    const channelId = urlParams.get("channelId");
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    const userType = urlParams.get("userType");
  
    if (channelId && userType) {
      localStorage.setItem("channelId", channelId);
      localStorage.setItem("userType", userType);
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      setChannelId(channelId); // ✅ allow form to work
    } else {
      router.push("/"); // ❌ if missing from URL too
    }
  }, [router]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche) return setError("Please select your niche");
    if (!channelId) return setError("Channel ID missing");

    try {
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, channelId }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      router.push("/main/profile");
    } catch {
      setError("Error saving profile.");
    }
  };

  return (
    <div className="min-h-[73vh] border max-w-md mx-auto mt-16 p-8 bg-gray-900 dark:bg-black shadow-xl rounded-lg">
      <h2 className="text-3xl font-semibold mb-8 text-center text-gray-100 dark:text-white">
        Complete Your Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-200 dark:text-gray-300 font-medium">Select Your Niche</label>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full p-3 mt-2 bg-gray-800 dark:bg-gray-900 border border-gray-600 dark:border-gray-400 rounded-lg text-gray-100 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your niche</option>
            <option value="fitness">Fitness</option>
            <option value="tech">Tech</option>
            <option value="fashion">Fashion</option>
            <option value="travel">Travel</option>
            <option value="education">Education</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
