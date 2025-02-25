import { ReactNode } from "react";

import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

export default function LandingLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <header className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">ADfluence</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li><a href="/" className="hover:underline">Home</a></li>
                            <li><a href="/about" className="hover:underline">About</a></li>
                            <li><a href="/contact" className="hover:underline">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 container mx-auto p-6">
                <div>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white text-center p-4">
                <p>© {new Date().getFullYear()} Marketing Hub. All rights reserved.</p>
            </footer>
        </div>
    );
}
