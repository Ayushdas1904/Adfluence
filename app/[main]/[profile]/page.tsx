"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatorProfilePage from "@/app/[main]/_components/CreatorProfilePage";
import BusinessProfilePage from "@/app/[main]/_components/BusinessProfilePage";

export default function ProfilePage() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const type = localStorage.getItem("userType");
    if (!type) {
      router.push("/"); // Not logged in
    } else {
      setUserType(type);
    }
  }, [router]);

  if (!userType) return null;

  return userType === "creator" ? <CreatorProfilePage /> : <BusinessProfilePage />;
}
