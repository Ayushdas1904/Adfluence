"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import React from "react";

export default function LogoutButton() {
  const { signOut, loaded } = useClerk();

  const handleLogout = () => {
    if (loaded) {
      signOut({ redirectUrl: "/" });
    }
  };

  return loaded ? (
    <div>
      <Button onClick={handleLogout} variant="destructive">
        Logout
      </Button>
    </div>
  ) : null;
}
