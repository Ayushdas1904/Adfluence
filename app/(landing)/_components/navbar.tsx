import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useAuth
} from "@clerk/nextjs";

export default function Navbar() {
    return (
        <header className="bg-gray-300 text-black dark:bg-black dark:text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">ADfluence</h1>
                <nav>
                    <ul className="flex space-x-4 gap-4">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/about" className="hover:underline">About</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>
                </nav>
                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <SignedOut>
                        <SignInButton>
                            <Button variant="outline">Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton/>
                    </SignedIn>
                </div>
            </div>
        </header>
    )
}
