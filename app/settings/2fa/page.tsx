"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";




type JwtPayload = {
  userId: number;
  email: string;
  twoFactorEnabled: boolean;
};

export default function Enable2FAPage() {
  const [secret, setSecret] = useState<string | null>(null);
  const [otpUrl, setOtpUrl] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        console.log("Decoded JWT:", decoded);
        setUserId(decoded.userId);
      } catch {
        setMessage("Invalid token. Please log in again.");
      }
    } else {
      setMessage("You must be logged in to enable 2FA.");
    }
  }, []);

  async function generateSecret() {
    if (!userId) return;
    const res = await fetch("/api/auth/enable-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      const data = await res.json();
      setSecret(data.secret);
      setOtpUrl(data.otpauth_url);
      setMessage("");
    } else {
      setMessage("Failed to generate 2FA secret.");
    }
  }

  async function verifyToken() {
    if (!userId) return;
    const res = await fetch("/api/auth/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token }),
    });

    if (res.ok) {
      setMessage("Two-factor authentication enabled successfully!");
    } else {
      const data = await res.json();
      setMessage(data.message || "Verification failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl mb-4">Enable Two-Factor Authentication</h1>

      {!secret && (
        <button
          onClick={generateSecret}
          className="mb-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Generate 2FA Secret
        </button>
      )}

      {secret && (
        <>
          <p className="mb-2">Scan this QR code with your authenticator app:</p>
          {otpUrl && (
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                otpUrl
              )}&size=200x200`}
              alt="QR code"
              className="mb-4"
            />
          )}
          <p className="mb-2">Or enter this secret manually: {secret}</p>

          <input
            type="text"
            placeholder="Enter 6-digit token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="p-2 rounded text-black mb-4"
          />

          <button
            onClick={verifyToken}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Verify & Enable 2FA
          </button>
        </>
      )}

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
