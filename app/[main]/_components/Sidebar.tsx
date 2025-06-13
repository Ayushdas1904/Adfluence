'use client'

import { Home, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Home", icon: Home, path: "/main" },
    { name: "Search", icon: Search, path: "/main/search" },
    { name: "Profile", icon: User, path: "/main/profile" },
  ];

  return (
    <div className="min-h-full min-w-20 md:min-w-64 border-r bg-white dark:bg-black dark:text-white flex flex-col items-center justify-between md:items-start p-4 transition-colors duration-300">
      <div
        className="text-xl font-bold mb-8 cursor-pointer hover:underline"
        onClick={() => router.push("/")}
      >
        ADfluence
      </div>

      <nav className="flex flex-col gap-4 w-full">
        {menuItems.map((item) => {
          const isActive =
            item.path === "/main"
              ? pathname === "/main" // exact match for Home
              : pathname.startsWith(item.path); // subpath match for others

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all w-full ${
                isActive
                  ? "bg-gray-200 dark:bg-gray-800"
                  : "hover:bg-gray-200 hover:dark:bg-gray-800"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="hidden md:block text-lg">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto w-full flex justify-between items-center">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
