import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";


export default function LandingPage() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <h1 className="text-4xl font-bold text-green-600">Welcome to Adfluence</h1>
            <p className="mt-4 text-lg text-gray-700">
                Grow your brand with the best content creators and marketing strategies.
            </p>
            <div className="mt-6 space-x-4">
                <a href="/about" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                    Learn More
                </a>
                <a href="/contact" className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg shadow-md hover:bg-gray-300 transition">
                    Get in Touch
                </a>
            </div>
            
        </section>
    );
}
