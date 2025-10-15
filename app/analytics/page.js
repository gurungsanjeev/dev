"use client";

import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function AnalyticsPage() {
  const [qrList, setQrList] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const qrRef = ref(db, "QR-Data");
    const unsubscribe = onValue(qrRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const qrArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setQrList(qrArray);

        // Calculate total points
        const pointsSum = qrArray.reduce((sum, qr) => sum + Number(qr.points || 0), 0);
        setTotalPoints(pointsSum);
      } else {
        setQrList([]);
        setTotalPoints(0);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Total QR Codes</h2>
          <p className="text-3xl font-bold mt-2">{qrList.length}</p>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Total Points</h2>
          <p className="text-3xl font-bold mt-2">{totalPoints}</p>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Other Stats</h2>
          <p className="text-2xl mt-2">Coming Soon...</p>
        </div>
      </div>

      {/* Optional: Show all QR codes in cards */}
      <h2 className="text-2xl font-bold mb-4">QR Codes Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrList.map((qr) => (
          <div
            key={qr.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition-shadow"
          >
            <h3 className="text-xl font-bold mb-2">{qr.name}</h3>
            <p className="text-gray-600 mb-1">
              <strong>Location:</strong> {qr.latitude}, {qr.longitude}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Type:</strong> {qr.type}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Points:</strong> {qr.points}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
