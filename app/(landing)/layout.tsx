"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    useAuth
} from "@clerk/nextjs";
import Navbar from "./_components/Navbar";


export default function LandingLayout({ children }: { children: ReactNode }) {
    // const router = useRouter();
    // const { isSignedIn } = useAuth(); // Get Clerk auth state

    // useEffect(() => {
    //     if (isSignedIn) {
    //         router.push("/main"); // Redirect to main page
    //     }
    // }, [isSignedIn, router]);

    return (
        <div className="min-h-full flex flex-col bg-gray-300 text-black dark:bg-black dark:text-white ">
            <Navbar />

            <main className="flex-1 container mx-auto p-6">
                {children}
            </main>

            <footer className="bg-gray-900 text-white text-center p-4">
                <p>© {new Date().getFullYear()} ADfluence. All rights reserved.</p>
            </footer>
        </div>
    );
}
