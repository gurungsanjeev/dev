"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, onValue } from "firebase/database";

export default function TestPage() {
  const [form, setForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
    type: "",
    points: "",
    picture: "",
    description: "",
  });
  const [qrList, setQrList] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const timestamp = Date.now();
      await push(ref(db, "QR-Data"), { ...form, timestamp });
      setQrList([...qrList, form]);
      setForm({
        name: "",
        latitude: "",
        longitude: "",
        type: "",
        points: "",
        picture: "",
        description: "",
      });
      setMessage("Data pushed successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Error pushing data, check console.");
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const qrRef = ref(db, "QR-Data");
    // Listen for changes
    onValue(qrRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array
        const qrArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setQrList(qrArray);
      } else {
        setQrList([]);
      }
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-center text-3xl font-bold"> Qr-Code List</h1>
      <hr className="my-6" />
      {message && (
        <p className="mb-4 text-green-600 font-semibold">{message}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrList.map((qr) => (
          <div
            key={qr.id}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-bold mb-2">{qr.name}</h3>
            <p className="text-gray-600 mb-1">
              <strong>Latt,Long:</strong> {qr.latitude}, {qr.longitude}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Type:</strong> {qr.type}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Points:</strong> {qr.points}
            </p>
            {/* {qr.picture && (
          <img
            src={qr.picture}
            alt={qr.name}
            className="w-full h-40 object-cover rounded mb-2"
          />
        )} */}
            <p className="text-gray-600 mb-1">
              <strong>Image view</strong>{" "}
              <a
                href={qr.picture}
                target="_blank"
                className="text-blue-500 underline"
              >
                View
              </a>
            </p>

            <p className="text-gray-600">
              <strong>Description:</strong> {qr.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
