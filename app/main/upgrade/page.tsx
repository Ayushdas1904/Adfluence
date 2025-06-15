"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function UpgradeToProPage() {
    const [channelId, setChannelId] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem("channelId");
        setChannelId(id);
    }, []);

    const handlePayment = async () => {
        if (!channelId) {
            alert("Channel ID missing");
            return;
        }

        const res = await fetch("/api/stripe/create-checkout-session-pro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ channelId }),
        });

        const data = await res.json();
        if (data?.url) {
            window.location.href = data.url;
        } else {
            alert("Stripe checkout session failed");
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Upgrade to Pro</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-xl text-center">
                Unlock priority search, Pro badge, early brand access, premium analytics, and more!
            </p>
            <Button
                className="bg-yellow-500 text-black font-bold hover:bg-yellow-600 px-6 py-3 rounded-lg"
                onClick={handlePayment}
                disabled={!channelId}
            >
                Pay ₹499/month with Stripe
            </Button>
        </div>
    );
}
