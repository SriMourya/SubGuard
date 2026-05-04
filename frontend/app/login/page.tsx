"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("RESPONSE:", text);

      if (!res.ok) {
        alert(text);
        return;
      }

      localStorage.setItem("token", text);
      router.push("/"); // redirect

    } catch (err) {
      console.error("LOGIN ERROR:", err);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border rounded-lg p-6 shadow w-80 space-y-4">
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}