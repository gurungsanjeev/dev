"use client";
import React, { useState } from "react";
import { db } from "../firebase";
import { BsQrCode } from "react-icons/bs";
import { ref, push } from "firebase/database";

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
  const [message, setMessage] = useState("");
  const [qrList, setQrList] = useState([]);
  const [timestamp, setTimeStamp] = useState(Date.now());

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      setTimeout(() => setMessage(""), 3000); // hide after 3s
    } catch (err) {
      console.error(err);
      setMessage("Error pushing data, check console.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Generate QR Code </h1>
      

      <div className="flex flex-col md:flex-row gap-8">
        {/* Form Section */}
        <div className="md:w-1/2 bg-white p-6 rounded-xl shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-semibold">QR Name</label>
              <input
                type="text"
                name="name"
                placeholder="QR Code Name"
                value={form.name}
                onChange={handleChange}
                className="p-2 mt-1 rounded border-none bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400  focus:border-none w-full"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="font-semibold">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  placeholder="Latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  className="p-2 mt-1 rounded border-none bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400  focus:border-none w-full"
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="font-semibold">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  placeholder="Longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  className="p-2 mt-1 rounded border-none bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400  focus:border-none w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold">Type of QR</label>
              <input
                type="text"
                name="type"
                placeholder="Type of QR Code"
                value={form.type}
                onChange={handleChange}
                className="p-2 mt-1 rounded border-none bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400  focus:border-none w-full"
              />
            </div>

            <div>
              <label className="font-semibold">Points Allocated</label>
              <input
                type="number"
                name="points"
                placeholder="Points Allocated"
                value={form.points}
                onChange={handleChange}
                className="p-2 mt-1 rounded border-none bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400  focus:border-none w-full"
              />
            </div>

            <div>
              <label className="font-semibold">Picture URL</label>
              <input
                type="url"
                name="picture"
                placeholder="Picture URL"
                value={form.picture}
                onChange={handleChange}
                className="p-2 mt-1 rounded border-none bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400  focus:border-none w-full"
              />
            </div>

            <div>
              <label className="font-semibold">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="p-2 mt-1 rounded border-none bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400  focus:border-none w-full"
                rows="3"
              />
            </div>
            <div className="my-4 flex gap-2">
              <label className="font-semibold">Status</label>
              <div className="flex gap-2">
                <input
                  type="radio"
                  value="Active"
                  name="radio-button"
                  defaultChecked
                />
                Active
                <input type="radio" value="Disable" name="radio-button" />
                Disable
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add QR Code
            </button>
          </form>
          {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>

        {/* QR List Section */}
        <div className="md:w-1/2 bg-white p-6 rounded-xl shadow overflow-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-4">
            {" "}
            Recently added QR Codes
          </h2>
          <div className="space-y-3">
            {qrList.length === 0 && <p>No QR codes added yet.</p>}
            {qrList.map((qr, i) => (
              <div key={i} className="p-4 border rounded bg-gray-50 shadow">
                <p>
                  <strong>Name:</strong> {qr.name}
                </p>
                <p>
                  <strong>Location:</strong> {qr.latitude}, {qr.longitude}
                </p>
                <p>
                  <strong>Type:</strong> {qr.type}
                </p>
                <p>
                  <strong>Points:</strong> {qr.points}
                </p>
                <p>
                  <strong>Picture URL:</strong>{" "}
                  <a
                    href={qr.picture}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    View
                  </a>
                </p>
                <p>
                  <strong>Description:</strong> {qr.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
