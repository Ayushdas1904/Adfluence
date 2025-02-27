"use client";

import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Intro } from "./_components/Intro";
import Stats from "./_components/Stats";
import LogoCarousel from "./_components/LogoCarousel";
import { Inter, Roboto_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LampContainer } from "@/components/ui/lamp";
import MacbookScroll from "@/components/ui/MacbookScroll";
import DemoScroll from "./_components/DemoScroll";

const inter = Inter({ subsets: ["latin"], weight: ["600"] });
const robotoMonoBold = Roboto_Mono({ subsets: ["latin"], weight: ["700"] });

export default function LandingPage() {
    const router = useRouter();
    const textRef = useRef(null);
    const isInView = useInView(textRef, { once: true, margin: "-100px" });

    return (
        <section className="min-h-screen flex flex-col items-center text-center gap-32 ">
            <div className="flex flex-col items-center">
                <Intro />

                <SignedOut>
                    <SignUpButton>
                        <Button
                            className={`bg-white text-black px-5 py-7 font-medium text-xl flex items-center gap-2 transition-all hover:!bg-indigo-600 hover:text-white ${inter.className}`}
                        >
                            Get Started →
                        </Button>
                    </SignUpButton>
                </SignedOut>

                <SignedIn>
                    <Button
                        onClick={() => router.push("/main")}
                        className={` rounded-3xl bg-white text-black px-5 py-7 font-medium text-xl flex items-center gap-2 transition-all hover:!bg-indigo-600 hover:text-white ${inter.className}`}
                    >
                        Enter ADfluence →
                    </Button>
                </SignedIn>
            </div>

            <Stats />

            <LogoCarousel />


            <LampContainer>
                <motion.h1
                    initial={{ opacity: 0.5, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className=" w-full mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
                >
                    Creator Discovery <br/> Powered by AI
                </motion.h1>
            </LampContainer>

            <DemoScroll/>

            
        </section>
    );
}
