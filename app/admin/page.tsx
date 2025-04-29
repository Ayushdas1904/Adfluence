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
    <div className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Admin Panel - Business Verification
      </h1>

      {businesses.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No businesses to show.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {businesses.map((b) => (
            <div
              key={b._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow hover:shadow-md transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{b.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-1"><strong>Email:</strong> {b.email}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-1"><strong>Website:</strong> {b.website}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-1"><strong>License No:</strong> {b.licenseNumber}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                <strong>Document:</strong>{" "}
                <a href={b.document} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">
                  View
                </a>
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <strong>Status:</strong>{" "}
                {b.verified ? (
                  <span className="text-green-600 font-semibold">✅ Verified</span>
                ) : (
                  <span className="text-red-600 font-semibold">❌ Not Verified</span>
                )}
              </p>
              {!b.verified && (
                <button
                  onClick={() => handleVerify(b._id)}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded w-full"
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
