"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import React, { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {

    const { signOut } = useClerk();

    const handleLogout = () => {
        signOut({ redirectUrl: "/" }); // Redirects to landing page after logout
    };


  return (
    <div>MainLayout
        <div>
        <Button onClick={handleLogout} variant="destructive">Logout</Button>
        </div>
        {children}
    </div>
  )
}
