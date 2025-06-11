import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageLoading } from "@/components/ui/message-loading";
import PayCreatorButton from "./PayCreatorButton";

export default function BusinessProfilePage() {
  const [business, setBusiness] = useState<any>(null);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessEmail = localStorage.getItem("businessEmail");
        if (!businessEmail) {
          console.error("Business email missing. Redirecting...");
          router.push("/");
          return;
        }

        const businessRes = await fetch("/api/business/profile", {
          headers: {
            "x-business-email": businessEmail,
          },
        });

        const businessData = await businessRes.json();
        setBusiness(businessData);

        if (!businessData?._id) {
          console.error("Business _id missing. Cannot fetch collaborations.");
          return;
        }

        localStorage.setItem("brandId", businessData._id);

        const collaborationsRes = await fetch(
          `/api/collaborations/brand?brandId=${businessData._id}`
        );
        const collaborationsData = await collaborationsRes.json();

        if (Array.isArray(collaborationsData)) {
          setCollaborations(collaborationsData);
        } else {
          console.error("Collaborations response is not an array", collaborationsData);
          setCollaborations([]);
        }
      } catch (err) {
        console.error("Error fetching business or collaborations", err);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem("businessEmail");

      if (!email) {
        console.error("No email found in localStorage");
        return;
      }

      const res = await fetch("/api/business/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        localStorage.removeItem("businessEmail");
        localStorage.removeItem("userType");
        localStorage.removeItem("brandId");
        window.dispatchEvent(new Event("storage"));
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <MessageLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#121212] px-6 py-10 transition-colors">
      {/* Business Profile Content */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-full mb-8 text-center ">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Business Dashboard</h1>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            View your business information and verification status.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      <div className="w-full bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Name</label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{business.name}</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
          <p className="text-gray-800 dark:text-gray-300 break-words">{business.email}</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Website </label>
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-600 dark:text-yellow-400 hover:underline break-words"
          >
            {business.website}
          </a>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">License Number </label>
          <p className="text-gray-800 dark:text-gray-300">{business.licenseNumber}</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Verification Status </label>
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${business.verified
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
              : "bg-yellow-200 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-300"
              }`}
          >
            {business.verified ? "Verified ✅" : "Pending ⏳"}
          </span>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Uploaded Document </label>
          <a
            href={business.document}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            View Document 📄
          </a>
        </div>
      </div>

      {/* Collaborations Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Your Collaborations
        </h2>
        {collaborations.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 mt-4">No collaborations found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {collaborations.map((collab, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={collab.creatorId?.profilePicture || "/default-avatar.png"}
                      className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {collab.creatorId?.channelName || "Unknown Creator"}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${collab.status === "Completed"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                      : collab.status === "In Progress"
                        ? "bg-yellow-200 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                  >
                    {collab.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    <span className="font-medium text-gray-800 dark:text-gray-200">Payment:</span>{" "}
                    {collab.paymentStatus}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800 dark:text-gray-200">Date:</span>{" "}
                    {new Date(collab.createdAt).toLocaleDateString()}
                  </p>
                  {collab.agreementDetails && (
                    <div className="mt-2">
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Agreement</p>
                      <p className="text-gray-800 dark:text-gray-300 text-sm line-clamp-3">
                        {collab.agreementDetails}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  {collab.status !== "Completed" && collab.paymentStatus === "Unpaid" ? (
                    <select
                      className="w-full mt-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-900 dark:text-white focus:outline-none"
                      value={collab.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          const res = await fetch(`/api/collaborations/update-status`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              collaborationId: collab._id,
                              status: newStatus,
                            }),
                          });

                          if (res.ok) {
                            setCollaborations((prev) =>
                              prev.map((c) =>
                                c._id === collab._id ? { ...c, status: newStatus } : c
                              )
                            );
                          } else {
                            console.error("Failed to update status");
                          }
                        } catch (error) {
                          console.error("Error updating status", error);
                        }
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : collab.paymentStatus === "Paid" ? (
                    <div className="text-green-600 font-semibold text-center">✔ Collaboration Completed</div>
                  ) : (
                    <PayCreatorButton
                      amount={500}
                      creatorEmail={collab.creatorId?.email || "unknown@example.com"}
                      creatorName={collab.creatorId?.channelName || "Unknown Creator"}
                      collaborationId={collab._id}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
