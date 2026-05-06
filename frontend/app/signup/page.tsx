"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        alert(text);
        return;
      }

      alert("Signup successful!");
      router.push("/login");

    } catch (err) {
      console.error("SIGNUP ERROR:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border rounded-lg p-6 shadow w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Signup</h2>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded"
        >
          Signup
        </button>
      </div>
    </div>
  );
}