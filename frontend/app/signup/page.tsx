"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  const handleSignup = async () => {

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (!res.ok) {

        const text =
          await res.text();

        alert(text);

        return;
      }

      alert("Signup successful!");

      router.push("/login");

    } catch (err) {

      console.error(
        "SIGNUP ERROR:",
        err
      );

      alert("Signup failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex justify-center items-center text-white">

      <div className="bg-[#0B1120] border border-white/10 p-8 rounded-2xl w-[380px] shadow-2xl">

        <h1 className="text-3xl font-bold text-center mb-8">
          Create Account
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 outline-none"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-xl font-semibold"
          >
            {loading
              ? "Creating..."
              : "Signup"}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}

            <span
              onClick={() =>
                router.push("/login")
              }
              className="text-purple-400 cursor-pointer hover:text-purple-300"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}