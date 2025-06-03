"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/login"); // redirect to login after signup
    } else {
      setError(data.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white p-4">
      <form onSubmit={handleSignup} className="max-w-md w-full bg-gray-800 p-6 rounded-lg">
        <h1 className="text-2xl mb-4 text-center font-semibold">Signup</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 p-2 rounded text-white font-semibold"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
