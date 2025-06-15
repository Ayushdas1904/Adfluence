"use client";
import React from 'react';
import { InfiniteMovingCards } from "@/components//ui/infinite-moving-cards";

const testimonials = [
    {
        quote:
            "Instantly connect with top brands looking for influencers in your niche. Verified businesses can reach out for paid promotions seamlessly.",
        title: "Find & Connect with Brands",
    },

    {
        quote:
            "Verified creators and brands ensure transparency. Business accounts with a blue tick are auto-verified, while others undergo manual verification.",
        title: "Verified & Secure Deals",
    },

    {
        quote:
            "Discuss deals directly through built-in chat, schedule Google Meet calls, or make voice calls—all within the app!",
        title: "Chat & Schedule Calls",
    },

    {
        quote:
            "Get priority exposure to brands, increasing your chances of landing deals faster. Stand out and grow your influence.",
        title: "Pro Version for Creators",
    },
];

export default function Stats() {
    return (
        <div className="flex justify-center">
            <InfiniteMovingCards
            items={testimonials.map(({ quote, title }) => ({
                title, // pass as string
                quote, // pass as string
            }))}
            direction="left"
            speed="fast"
            />
        </div>
    );
}
