"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const body: any = { email, password };
    if (requires2FA) {
      body.twoFactorToken = twoFactorToken;
      body.userId = userId; // needed if your API expects it
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      // Login successful, save JWT token
      localStorage.setItem("token", data.token);
      setError("");
      router.push("/"); // redirect to home page or dashboard
    } else if (data.message === "Two-factor token required") {
  setRequires2FA(true);
  setError("Two-factor authentication token required.");
  setUserId(data.userId);  // <-- uncomment this
}
 else if (data.message === "Invalid two-factor token") {
      setError("Invalid two-factor authentication token.");
    } else {
      setError(data.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white p-4">
      <form onSubmit={handleLogin} className="max-w-md w-full bg-gray-800 p-6 rounded-lg">
        <h1 className="text-2xl mb-4 text-center font-semibold">Login</h1>

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

        {requires2FA && (
          <input
            type="text"
            placeholder="2FA Token"
            value={twoFactorToken}
            onChange={(e) => setTwoFactorToken(e.target.value)}
            required
            className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600"
          />
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded text-white font-semibold"
        >
          {requires2FA ? "Verify 2FA & Login" : "Login"}
        </button>
      </form>
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white p-4">
      <form onSubmit={handleLogin} className="max-w-md w-full bg-gray-800 p-6 rounded-lg">
        <h1 className="text-2xl mb-4 text-center font-semibold">Login</h1>

        {/* Your input fields */}

        {/* Your submit button */}

        <p className="mt-4 text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </div>
    </div>
  );
}
