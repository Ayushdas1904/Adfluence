import React, { ReactNode } from "react";
import LogoutButton from "./_components/LogoutButton";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-300 text-black dark:bg-black dark:text-white">
      <Sidebar />
      {children}
    </div>
  );
}
