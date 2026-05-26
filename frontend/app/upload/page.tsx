"use client";

import { useRef } from "react";

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    try {
      const file = fileRef.current?.files?.[0];

      if (!file) {
        alert("Please select a CSV file");
        return;
      }

      const token = sessionStorage.getItem("token");
      const userId = sessionStorage.getItem("userId");

      if (!token || !userId) {
        alert("Please login again");
        return;
      }

      const formData = new FormData();

      formData.append("file", file);

      console.log("FILE:", file.name);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/upload/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log("STATUS:", res.status);

      const text = await res.text();

      console.log("RESPONSE:", text);

      if (!res.ok) {
        throw new Error(text);
      }

      alert("CSV uploaded successfully!");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex justify-center items-center">
      <div className="bg-[#0B1120] border border-white/10 p-8 rounded-2xl w-[420px] shadow-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Upload CSV
        </h1>

        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full bg-white/10 hover:bg-white/20 transition p-4 rounded-xl mb-6 border border-white/10"
        >
          Choose CSV File
        </button>

        <button
          type="button"
          onClick={handleUpload}
          className="w-full bg-purple-600 hover:bg-purple-700 transition py-3 rounded-xl font-semibold"
        >
          Upload CSV
        </button>
      </div>
    </div>
  );
}