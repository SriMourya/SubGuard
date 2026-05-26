"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      console.log("STATUS:", res.status);

      if (!res.ok) {
        alert("Invalid credentials");
        return;
      }

      const data = await res.json();

      console.log("LOGIN DATA:", data);
//
//       localStorage.setItem("token", data.token);
//       localStorage.setItem(
//         "userId",
//         data.userId
//       );
    sessionStorage.setItem("token", data.token);

    sessionStorage.setItem("userId", data.userId);

    sessionStorage.setItem("name", data.name);

      alert("Login successful!");

      router.push("/");

    } catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );

      alert("Login failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex justify-center items-center text-white">

      <div className="bg-[#0B1120] border border-white/10 p-8 rounded-2xl w-[380px] shadow-2xl">

        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome Back
        </h1>

        <div className="space-y-5">

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
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition py-3 rounded-xl font-semibold"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Don’t have an account?{" "}

            <span
              onClick={() =>
                router.push("/signup")
              }
              className="text-purple-400 cursor-pointer hover:text-purple-300"
            >
              Signup
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}