"use client";

import * as motion from "motion/react-client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check local storage for theme preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark";
        setIsDark(!isDark);
        
        // Apply the theme to the <html> tag
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        // Save preference in localStorage
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button
            className="toggle-container"
            style={{
                ...container,
                justifyContent: isDark ? "flex-end" : "flex-start",
                backgroundColor: isDark ? "#222" : "#ddd",
            }}
            onClick={toggleTheme}
        >
            <motion.div
                className="toggle-handle"
                style={{
                    ...handle,
                    backgroundColor: isDark ? "#ffbb33" : "#9911ff",
                }}
                layout
                transition={{
                    type: "spring",
                    duration: 0.2,
                    bounce: 0.2,
                }}
            />
        </button>
    );
}

/**
 * ==============   Styles   ================
 */

const container = {
    width: 50,
    height: 30,
    borderRadius: 50,
    cursor: "pointer",
    display: "flex",
    padding: 5,
    border: "2px solid #555",
};

const handle = {
    width: 18,
    height: 18,
    borderRadius: "50%",
};
