"use client";

import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userId");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        Transactions
      </h1>

      <div className="bg-[#0B1120] rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-t border-white/10"
              >
                <td className="p-4">{tx.description}</td>

                <td className="p-4">₹{tx.amount}</td>

                <td className="p-4">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}