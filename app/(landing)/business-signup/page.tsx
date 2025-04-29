"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BusinessSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    website: "",
    licenseNumber: "",
    document: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "document" && files) {
      setForm({ ...form, document: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.document) {
      setMsg("Please upload a document.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as string | Blob);
    });

    try {
      setLoading(true);
      const res = await fetch("/api/business/signup", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        localStorage.setItem("userType", "business");
        router.push("/");
      } else {
        const text = await res.text();
        setMsg(text);
      }
    } catch (err) {
      setMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" max-w-md mx-auto mt-10 px-8 py-10 bg-white dark:bg-black shadow-xl rounded-2xl border dark:border-neutral-800">
      <h2 className="text-3xl font-semibold text-center text-neutral-900 dark:text-white">
        HEY👋
      </h2>
      <h3 className="text-2xl font-semibold text-center mb-8 text-neutral-900 dark:text-white">
        Create your business account
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          { name: "name", placeholder: "Business Name" },
          { name: "email", placeholder: "Email" },
          { name: "password", placeholder: "Password", type: "password" },
          { name: "website", placeholder: "Website URL" },
          { name: "licenseNumber", placeholder: "License Number" },
        ].map(({ name, placeholder, type }) => (
          <input
            key={name}
            name={name}
            type={type || "text"}
            placeholder={placeholder}
            value={(form as any)[name]}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-neutral-900 dark:text-white dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          />
        ))}

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Verification Document
          </label>
          <input
            type="file"
            name="document"
            accept="application/pdf,image/*"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-neutral-900 dark:text-white dark:border-neutral-700 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {msg && <p className="text-center text-sm text-red-500 mt-2">{msg}</p>}
      </form>

      <p className="text-center text-sm mt-6 text-neutral-700 dark:text-neutral-400">
        Already have an account?{" "}
        <button
          className="text-blue-500 hover:underline font-medium"
          onClick={() => router.push("/business-login")}
        >
          Log in here
        </button>
      </p>
    </div>
  );
}
