"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddSubscription() {
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [userId, setUserId] = useState<number | null>(null);

  const router = useRouter();



useEffect(() => {
   const token = localStorage.getItem("token");

   if (!token) {
     router.push("/login");
     return;
   }

   setUserId(1);
 }, []);
  const handleAdd = async () => {
    if (!serviceName || !amount || !nextDate) {
      alert("Fill all fields");
      return;
    }

    try {
        const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/manual/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceName,
            amount: Number(amount),
            nextBillingDate: nextDate,
            status: "ACTIVE",
            frequency,
          }),
        }
      );

      alert("Subscription added!");
      router.push("/"); // go back to dashboard
    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="border rounded-lg p-6 shadow w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">
          Add Subscription
        </h2>

        <select
          className="border p-2 w-full text-black bg-white"
          onChange={(e) => setServiceName(e.target.value)}
        >
          <option value="">Select Service</option>
          <option value="Netflix">Netflix</option>
          <option value="Spotify">Spotify</option>
          <option value="Amazon Prime">Amazon Prime</option>
        </select>

        <input
          type="text"
          placeholder="Or enter custom service"
          className="border p-2 w-full"
          onChange={(e) => setServiceName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 w-full"
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 w-full bg-black text-white"
          onChange={(e) => setNextDate(e.target.value)}
        />

        <select
          className="border p-2 w-full text-black bg-white"
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>

        <button
          onClick={handleAdd}
          className="bg-purple-500 hover:bg-purple-600 text-white w-full py-2"
        >
          Add Subscription
        </button>
      </div>
    </div>
  );
}