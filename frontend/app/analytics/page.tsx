"use client";

import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
} from "recharts";

interface Subscription {
  id: number;
  serviceName: string;
  amount: number;
}

export default function AnalyticsPage() {
  const [subscriptions, setSubscriptions] = useState<
    Subscription[]
  >([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const userId = sessionStorage.getItem("userId");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();

      console.log("SUBSCRIPTIONS:", data);

      setSubscriptions(data);

    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  if (subscriptions.length === 0) {
    return (
      <div className="min-h-screen bg-[#050816] text-white p-10">
        <h1 className="text-4xl font-bold mb-10">
          Analytics
        </h1>

        <div className="text-gray-400">
          No subscription data found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-10">
      <h1 className="text-4xl font-bold mb-10">
        Analytics
      </h1>

      <div className="grid grid-cols-2 gap-10">
        <div className="bg-[#0B1120] p-6 rounded-2xl">
          <h2 className="text-2xl mb-6">
            Subscription Breakdown
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptions}
                dataKey="amount"
                nameKey="serviceName"
                outerRadius={120}
                label
              >
                {subscriptions.map((_, index) => (
                  <Cell
                    key={index}
                    fill={`hsl(${index * 60},70%,60%)`}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0B1120] p-6 rounded-2xl">
          <h2 className="text-2xl mb-6">
            Monthly Spend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subscriptions}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="serviceName" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="amount"
                fill="#8b5cf6"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}