"use client";
import React, { useState } from "react";
import { db } from "../firebase";
import { ref, push } from "firebase/database";

export default function TestPage() {
  const [data, setData] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await push(ref(db, "testdata"), { text: data, timestamp: Date.now() });
      setMessage("Data pushed successfully!");
      setData("");
    } catch (err) {
      console.error(err);
      setMessage("Error pushing data, check console.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Test Page</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter some test text"
          className="border p-2 rounded flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Push
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
