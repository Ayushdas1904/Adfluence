"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    useAuth
} from "@clerk/nextjs";
import Navbar from "./_components/navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LandingLayout({ children }: { children: ReactNode }) {

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
    
        if (error) {
            toast.error(error);
            window.history.replaceState({}, document.title, "/"); // Remove error from URL
        }
      }, []);

    return (
        <div className="min-h-full flex flex-col bg-gray-300 text-black dark:bg-black dark:text-white ">
            <Navbar />

            <main className="flex-1 container mx-auto p-6">
                {children}
            </main>
            <ToastContainer position="bottom-right" autoClose={3000} /> {/* Toast container */}
        </div>
    );
}
