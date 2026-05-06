"use client";

import { useEffect, useState } from "react";
import {
  getSubscriptions,
  detectSubscriptions,
  deleteSubscription,
} from "../services/api";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);

     useEffect(() => {
       const token = localStorage.getItem("token");

       if (!token) {
         window.location.href = "/login";
       }

       if (userId === null) {
         setUserId(1);
       }
     }, []);
  useEffect(() => {
    if (userId !== null) {
      loadSubscriptions();
    }
  }, [userId]);

  const loadSubscriptions = async () => {
    if (!userId) return;
    const data = await getSubscriptions(userId);
    setSubscriptions(data);
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");

    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    if (!userId) {
      alert("User not loaded yet");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/upload/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      await detectSubscriptions(userId);
      await loadSubscriptions();

      alert("Upload + Detection successful!");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
    }
  };

  const handleDetect = async () => {
    if (!userId) return;

    try {
      await detectSubscriptions(userId);
      await loadSubscriptions();
    } catch (err) {
      console.error("DETECT ERROR:", err);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteSubscription(id);
    await loadSubscriptions();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SubGuard Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
        >
          Logout
        </button>
      </div>

    <div className="flex gap-3 mt-3">
      <button
        onClick={handleDetect}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
      >
        Detect Subscriptions
      </button>

      <button
        onClick={() => (window.location.href = "/add-subscription")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
      >
        Add Subscription
      </button>
    </div>
      {/* FILE INPUT */}
      <div className="mt-4">
        <input
          type="file"
          accept=".csv"
//           className="hidden"
          className="text-white file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-gray-700 file:text-white"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
          }}
        />
        <button
          onClick={handleUpload}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 ml-2"
        >
          Upload CSV
        </button>
      </div>

      {/* SUBSCRIPTIONS */}
      <div className="mt-6">
        {subscriptions.length === 0 ? (
          <p className="text-gray-500">No subscriptions found</p>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub.id} className="border rounded-lg shadow p-4">
              <p className="font-bold">{sub.serviceName}</p>
              <p>Amount: ₹{sub.amount}</p>

              <p
                className={
                  sub.status === "ACTIVE"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                Status: {sub.status}
              </p>

              <p>Next Billing: {sub.nextBillingDate}</p>

              <button
                onClick={() => handleDelete(sub.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 mt-2"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}