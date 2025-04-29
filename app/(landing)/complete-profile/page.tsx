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
    } catch (err) {
      setError("Error saving profile.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-800 shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Complete Your Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-gray-700 dark:text-gray-300 font-medium">
          Select Your Niche
        </label>
        <select
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select your niche</option>
          <option value="fitness">Fitness</option>
          <option value="tech">Tech</option>
          <option value="fashion">Fashion</option>
          <option value="travel">Travel</option>
          <option value="education">Education</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
