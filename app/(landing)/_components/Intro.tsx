'use client'

import { Roboto_Mono } from "next/font/google";
import { Typewriter } from "@/components/ui/Typewriter";
import { Hero } from "@/components/ui/animated-hero";

const robotoMonoBold = Roboto_Mono({ subsets: ["latin"], weight: ["700"] });
const robotoMonoThin = Roboto_Mono({ subsets: ["latin"], weight: ["400"] });

export function Intro() {
    return (
        <div className="intro flex flex-col gap-16 items-center p-20 ">
            <Hero/>
            <h3 className={`text-2xl flex justify-left ${robotoMonoThin.className}`}>
                <Typewriter text="THE WORLD'S BEST BRANDS TRUST ADFLUENCE FOR CREATOR MARKETING" speed={40} />
            </h3>
        </div >
    );
}
