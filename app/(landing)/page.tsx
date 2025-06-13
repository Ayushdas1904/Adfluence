"use client";

import { useRouter, useSearchParams } from "next/navigation"; // ⬅️ Add useSearchParams
import { useEffect, useRef, useState } from "react";
import { Intro } from "./_components/Intro";
import Stats from "./_components/Stats";
import LogoCarousel from "./_components/LogoCarousel";
import { Inter, Roboto_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import DemoScroll from "./_components/DemoScroll";
import YoutubeLoginButton from "./_components/YoutubeLoginButton";
import BusinessSignupButton from "./_components/BusinessSignupButton";

const inter = Inter({ subsets: ["latin"], weight: ["600"] });
const robotoMonoBold = Roboto_Mono({ subsets: ["latin"], weight: ["700"] });

export default function LandingPage() {
    const router = useRouter();
    const searchParams = useSearchParams(); // ⬅️ Get URL query params
    const textRef = useRef(null);
    const isInView = useInView(textRef, { once: true, margin: "-100px" });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState<"creator" | "business" | null>(null);

    useEffect(() => {
        // ✅ Step 1: Store URL query params to localStorage
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const channelId = searchParams.get("channelId");
        const userTypeParam = searchParams.get("userType");

        if (accessToken && channelId && userTypeParam === "creator") {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("channelId", channelId);
            localStorage.setItem("userType", "creator");
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // ✅ Remove tokens from URL
            router.replace("/", { scroll: false });
        }
    }, [searchParams]);

    useEffect(() => {
        const checkStatus = async () => {
            const storedType = localStorage.getItem("userType") as "creator" | "business" | null;
            setUserType(storedType);
            console.log("Stored userType:", storedType);

            if (storedType === "creator") {
                const channelId = localStorage.getItem("channelId");
                if (!channelId) return;

                const res = await fetch(`/api/user-status`, {
                    headers: { "x-channel-id": channelId },
                });

                const data = await res.json();
                setIsLoggedIn(data.isLoggedIn);
            } else if (storedType === "business") {
                const businessEmail = localStorage.getItem("businessEmail");
                if (!businessEmail) return;

                const res = await fetch(`/api/business-status`, {
                    headers: { "x-business-email": businessEmail },
                });

                const data = await res.json();
                if (data.isLoggedIn) {
                    setIsLoggedIn(true);
                } else {
                    localStorage.removeItem("businessEmail");
                    localStorage.removeItem("userType");
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        // Run once initially
        checkStatus();

        // ✅ Listen to localStorage changes like logout
        const handleStorageChange = () => {
            checkStatus(); // re-run status check if any relevant storage changes
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);


    return (
        <section className="min-h-screen flex flex-col items-center text-center gap-32 transition-colors duration-300">
            <div className="flex flex-col items-center">
                <Intro />
                <div className="flex gap-4 mt-8">
                    {isLoggedIn && userType === "creator" ? (
                        <Button
                            className="bg-red-600 text-white p-7 font-bold text-lg hover:bg-red-500 hover:text-black"
                            onClick={() => router.push("/main")}
                        >
                            Enter Adfluence →
                        </Button>
                    ) : isLoggedIn && userType === "business" ? (
                        <Button
                            className="bg-blue-600 text-white p-7 font-bold text-lg hover:bg-blue-500 hover:text-black"
                            onClick={() => router.push("/main/profile")}
                        >
                            Enter Business Dashboard →
                        </Button>
                    ) : !isLoggedIn && userType === "business" ? (
                        <>
                            <YoutubeLoginButton />
                            <Button
                                className="bg-gray-800 text-white p-7 font-bold text-lg hover:bg-gray-700 hover:text-white"
                                onClick={() => router.push("/business-login")}
                            >
                                Business Login →
                            </Button>
                        </>
                    ) : (
                        <>
                            <YoutubeLoginButton />
                            <BusinessSignupButton />
                        </>
                    )}
                </div>
            </div>

            <Stats />
            <LogoCarousel />

            <LampContainer>
                <motion.h1
                    initial={{ opacity: 0.5, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                    className="w-full mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
                >
                    Creator Discovery <br /> Powered by AI
                </motion.h1>
            </LampContainer>

            <DemoScroll />
        </section>
    );
}
