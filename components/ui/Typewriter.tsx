"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
    text: string;
    className?: string;
    speed?: number; // Optional prop to control typing speed
}

export function Typewriter({ text, className = "", speed = 100 }: TypewriterProps) {
    const [displayText, setDisplayText] = useState("");
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        if (charIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[charIndex]);
                setCharIndex(charIndex + 1);
            }, speed);

            return () => clearTimeout(timeout);
        }
    }, [charIndex, text, speed]);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {displayText}
            <span className="animate-pulse">|</span>
        </motion.span>
    );
}
