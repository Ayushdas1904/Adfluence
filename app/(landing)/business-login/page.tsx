"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BusinessLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/business/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Assuming the response contains the brandId
      const { brandId } = data; // Modify this to match the response structure

      // Store the necessary data in localStorage
      localStorage.setItem("userType", "business");
      localStorage.setItem("businessEmail", email);
      localStorage.setItem("brandId", brandId); // Store the brandId

      // Redirect to the profile page
      router.push("/main/profile");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center bg-gray-300 dark:bg-black">
      <div className="w-full max-w-sm bg-white dark:bg-[#111] rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          WELCOME BACK
        </h2> 
        <p className="text-center">Login to your Business Account</p>
  
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
  
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
  
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
          >
            Sign in
          </button>
        </form>
  
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/business-signup")}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}  