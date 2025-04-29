import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 dark:bg-[#0b0b0b] px-6">
      <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400">Payment Successful</h1>
      <p className="text-gray-700 dark:text-gray-300 mt-2 mb-6">
        Thank you! Your payment was processed successfully.
      </p>
      <Link href="/main" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Go to Home
      </Link>
    </div>
  );
}
