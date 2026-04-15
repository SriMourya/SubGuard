"use client";

import { useEffect, useState } from "react";
import {
  getSubscriptions,
  detectSubscriptions,
  getUser,
  deleteSubscription,
} from "../services/api";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      loadSubscriptions();
    }
  }, [userId]);

  const loadUser = async () => {
    const user = await getUser();
    if (user && user.id) {
      setUserId(user.id);
    } else {
      console.error("User not loaded");
    }
  };

  const loadSubscriptions = async () => {
    if (!userId) return;
    const data = await getSubscriptions(userId);
    console.log("SUBSCRIPTIONS:", data);
    setSubscriptions(data);
  };

  const handleUpload = async () => {
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
      await fetch(`http://localhost:8080/transactions/upload/${userId}`, {
        method: "POST",
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
    <div className="p-6">
      <h1 className="text-3xl font-bold">SubGuard Dashboard</h1>

      {/* DETECT BUTTON */}
      <button
        onClick={handleDetect}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        Detect Subscriptions
      </button>

      {/* FILE INPUT */}
      <div className="mt-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
          }}
        />

        <button
          onClick={handleUpload}
          className="bg-green-500 text-white px-4 py-2 ml-2"
        >
          Upload CSV
        </button>
      </div>

      {/* SUBSCRIPTIONS */}
      <div className="mt-6">
        {subscriptions.length === 0 ? (
          <p>No subscriptions found</p>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub.id} className="border p-4 mb-2">
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

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDelete(sub.id)}
                className="bg-red-500 text-white px-3 py-1 mt-2"
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