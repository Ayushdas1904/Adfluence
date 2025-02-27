import React from 'react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
    return (
        <div>
            <header className="p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-900">
                <h1 className="text-2xl font-bold dark:text-white">ADfluence</h1>
                <ThemeToggle />
            </header>
        </div>
    )
}
