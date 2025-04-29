"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BusinessSignupButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/business-signup")}
      className="bg-blue-600 text-white p-7 font-bold text-lg hover:bg-blue-500 hover:text-black"
    >
      Sign Up as Business
    </Button>
  );
}
