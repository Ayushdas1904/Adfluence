"use client";

import { useEffect, useState } from "react";

interface Business {
  _id: string;
  name: string;
  email: string;
  website: string;
  licenseNumber: string;
  document: string;
  verified: boolean;
}

export default function AdminPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const res = await fetch("/admin/businesses");
      if (!res.ok) {
        console.error("Failed to fetch businesses");
        return;
      }
      const data = await res.json();
      setBusinesses(data);
    };

    fetchBusinesses();
  }, []);

  const handleVerify = async (id: string) => {
    const res = await fetch(`/admin/verify/${id}`, {
      method: "PATCH", // 🔥 Must match backend
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (res.ok) {
      setBusinesses((prev) =>
        prev.map((b) => (b._id === id ? { ...b, verified: true } : b))
      );
    } else {
      console.error("Verification failed");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-black text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-600">
        Admin Panel - Business Verification
      </h1>

      {businesses.length === 0 ? (
        <p className="text-center text-gray-400">
          No businesses to show.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((b) => (
            <div
              key={b._id}
              className="bg-gradient-to-br from-black via-gray-800 to-black rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
            >
              <h2 className="text-2xl font-semibold text-white mb-2">{b.name}</h2>
              <p className="text-gray-300 mb-2"><strong>Email:</strong> {b.email}</p>
              <p className="text-gray-300 mb-2"><strong>Website:</strong> {b.website}</p>
              <p className="text-gray-300 mb-2"><strong>License No:</strong> {b.licenseNumber}</p>
              <p className="text-gray-300 mb-4">
                <strong>Document:</strong>{" "}
                <a href={b.document} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-400">
                  View
                </a>
              </p>
              <p className="text-gray-300 mb-4">
                <strong>Status:</strong>{" "}
                {b.verified ? (
                  <span className="text-green-500 font-semibold">✅ Verified</span>
                ) : (
                  <span className="text-red-500 font-semibold">❌ Not Verified</span>
                )}
              </p>
              {!b.verified && (
                <button
                  onClick={() => handleVerify(b._id)}
                  className="bg-gradient-to-r from-teal-500 to-indigo-500 hover:bg-gradient-to-l text-white font-semibold px-6 py-3 rounded-2xl w-full transition duration-200 ease-in-out"
                >
                  Verify
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
