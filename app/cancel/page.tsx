import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-[#0b0b0b] px-6">
      <XCircle className="text-red-600 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-red-700 dark:text-red-400">Payment Cancelled</h1>
      <p className="text-gray-700 dark:text-gray-300 mt-2 mb-6">
        Your payment was cancelled. Please try again if needed.
      </p>
      <Link href="/main" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
        Go to Home
      </Link>
    </div>
  );
}
