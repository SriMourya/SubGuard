"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Bell,
  CreditCard,
  IndianRupee,
  Calendar,
  TrendingUp,
  Upload,
  Plus,
  PieChart,
  Trash2,
  LogOut,
} from "lucide-react";

import {
  getSubscriptions,
  detectSubscriptions,
  deleteSubscription,
} from "../services/api";

interface Subscription {
  id: number;
  serviceName: string;
  amount: number;
  status: string;
  nextBillingDate: string;
  billingCycle: string;
}



export default function Page() {
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [initials, setInitials] = useState("");

  const userId =
    typeof window !== "undefined"
      ? Number(sessionStorage.getItem("userId"))
      : null;

  useEffect(() => {

    const token =
      sessionStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const name =
      sessionStorage.getItem("name");

    if (name) {

      const shortName = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

      setInitials(shortName);
    }

    fetchSubscriptions();

  }, []);

  const fetchSubscriptions = async () => {
    try {
      if (!userId) return;

      const data = await getSubscriptions(userId);
      console.log("SUBSCRIPTIONS:", data);
      setSubscriptions(data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSubscription(id);

      setSubscriptions((prev) =>
        prev.filter((sub) => sub.id !== id)
      );
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const handleDetect = async () => {
    try {
      if (!userId) return;

      await detectSubscriptions(userId);

      alert("Subscriptions detected!");

      fetchSubscriptions();
    } catch (err) {
      console.error("DETECT ERROR:", err);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();

    router.push("/login");
  };

  const totalSpend = subscriptions.reduce(
    (acc, sub) => acc + sub.amount,
    0
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#070B1A] border-r border-white/10 p-6">
        <h1 className="text-3xl font-bold text-purple-500 mb-10">
          SubGuard
        </h1>

        <nav className="space-y-4">
          <div className="bg-purple-600/20 text-purple-400 p-3 rounded-xl">
            Dashboard
          </div>

          <div
            onClick={() => router.push("/add-subscription")}
            className="text-gray-400 p-3 hover:bg-white/5 rounded-xl cursor-pointer"
          >
            Add Subscription
          </div>

          <div
            onClick={() => router.push("/transactions")}
            className="text-gray-400 p-3 hover:bg-white/5 rounded-xl cursor-pointer"
          >
            Transactions
          </div>

         <div
           onClick={() => router.push("/upload")}
           className="text-gray-400 p-3 hover:bg-white/5 rounded-xl cursor-pointer"
         >
           Upload CSV
         </div>

          <div onClick={() => router.push("/analytics")} className="text-gray-400 p-3 hover:bg-white/5 rounded-xl cursor-pointer">
            Analytics
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>

            <p className="text-gray-400 mt-2">
              Welcome back
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Bell className="text-gray-400" />

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>

           <div className="w-11 h-11 rounded-full bg-purple-600 flex items-center justify-center font-bold">
             {initials}
           </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0B1120] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4">
              <div className="bg-purple-600/20 p-3 rounded-xl">
                <CreditCard className="text-purple-400" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Total Subscriptions
                </p>

                <h2 className="text-3xl font-bold">
                  {subscriptions.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1120] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600/20 p-3 rounded-xl">
                <IndianRupee className="text-blue-400" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Monthly Spend
                </p>

                <h2 className="text-3xl font-bold">
                  ₹{totalSpend}
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1120] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-600/20 p-3 rounded-xl">
                <Calendar className="text-yellow-400" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Active Plans
                </p>

                <h2 className="text-3xl font-bold">
                  {
                    subscriptions.filter(
                      (sub) => sub.status === "ACTIVE"
                    ).length
                  }
                </h2>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1120] p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4">
              <div className="bg-green-600/20 p-3 rounded-xl">
                <TrendingUp className="text-green-400" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Projected Yearly Cost
                </p>

                <h2 className="text-3xl font-bold">
                  ₹{
                    subscriptions.reduce((total, sub) => {

                      if (sub.billingCycle === "YEARLY") {
                        return total + sub.amount;
                      }

                      return total + sub.amount * 12;

                    }, 0)
                  }
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="bg-[#0B1120] rounded-2xl border border-white/10 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Your Subscriptions
            </h2>

            <button
              onClick={handleDetect}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl"
            >
              Detect
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : subscriptions.length === 0 ? (
            <p className="text-gray-400">
              No subscriptions found
            </p>
          ) : (
            <div className="space-y-5">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between border-b border-white/5 pb-4"
                >
                  <div>
                    <h3 className="font-semibold">
                      {sub.serviceName}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      ₹{sub.amount} / {
                        sub.billingCycle === "YEARLY"
                          ? "year"
                          : "month"
                      }
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        sub.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {sub.status}
                    </span>

                    <p className="text-gray-400 text-xs mt-2">
                      {sub.nextBillingDate}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0B1120] rounded-2xl border border-white/10 p-6">
          <h2 className="text-2xl font-semibold mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-4 gap-5">
            <div onClick={() => router.push("/upload")} className="bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition cursor-pointer">
              <Upload className="text-purple-400 mb-4" size={30} />

              <h3 className="font-semibold mb-2">
                Upload CSV
              </h3>
            </div>

            <div
              onClick={handleDetect}
              className="bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition cursor-pointer"
            >
              <Bell className="text-blue-400 mb-4" size={30} />

              <h3 className="font-semibold mb-2">
                Detect Subscriptions
              </h3>
            </div>

            <div
              onClick={() =>
                router.push("/add-subscription")
              }
              className="bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition cursor-pointer"
            >
              <Plus className="text-green-400 mb-4" size={30} />

              <h3 className="font-semibold mb-2">
                Add Subscription
              </h3>
            </div>

            <div onClick={() => router.push("/analytics")}className="bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition cursor-pointer">
              <PieChart className="text-yellow-400 mb-4" size={30} />

              <h3 className="font-semibold mb-2">
                View Analytics
              </h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}