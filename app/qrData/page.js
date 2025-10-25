"use client"; // Required for Next.js (ensures this component runs on the client side)

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { db } from "../firebase"; // Firebase database instance
import {
  ref,
  onValue,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

export default function TestPage() {
  // -------------------- State Management --------------------
  const [qrList, setQrList] = useState([]); // Stores all QR data fetched from Firebase
  const [selectedQR, setSelectedQR] = useState(null); // Stores the QR currently selected for editing
  const [categories, setCategories] = useState([]); // Stores category data (for dropdown filtering)
  const [selectedLocation, setSelectedLocation] = useState(""); // Tracks the currently selected location filter
  const [message, setMessage] = useState(""); // Displays user feedback messages (success/error)

  // Form data for editing QR
  const [form, setForm] = useState({
    name: "",
    latitude: "",
    longitude: "",
    type: "",
    points: "",
    location: "",
    picture: "",
    description: "",
    status: "Active",
  });

  // -------------------- Fetch Categories --------------------
  // Fetch all categories once the component mounts
  useEffect(() => {
    const categoriesRef = ref(db, "Categories");
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert category object into an array with IDs
        const catArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCategories(catArray);
      } else {
        setCategories([]); // If no data, clear categories
      }
    });

    // Cleanup Firebase subscription on component unmount
    return () => unsubscribe();
  }, []);

  // -------------------- Fetch QR List --------------------
  // Fetch all QR codes or filter by selected location
  useEffect(() => {
    let qrQuery;

    if (selectedLocation) {
      // Query QR data filtered by the selected location
      qrQuery = query(
        ref(db, "QR-Data"),
        orderByChild("location"),
        equalTo(selectedLocation)
      );
    } else {
      // Fetch all QR data if no location filter is applied
      qrQuery = ref(db, "QR-Data");
    }

    const unsubscribe = onValue(qrQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert fetched data into an array, sorted by timestamp --> (newest first)
        const qrArray = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setQrList(qrArray);
      } else {
        setQrList([]);
      }
    });

    // Cleanup on unmount or location change
    return () => unsubscribe();
  }, [selectedLocation]);

  // -------------------- Handle Form Input Changes --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    // Auto-update the location field whenever latitude or longitude changes
    if (name === "latitude" || name === "longitude") {
      updatedForm.location = `${updatedForm.latitude}, ${updatedForm.longitude}`;
    }

    setForm(updatedForm);
  };

  // -------------------- Handle Edit Click --------------------
  const handleEditClick = (qr) => {
    setSelectedQR(qr); // Set current QR as selected
    setForm(qr); // Pre-fill the form with QR data
  };

  // -------------------- Update QR Data --------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedQR) return;

    try {
      const qrRef = ref(db, `QR-Data/${selectedQR.id}`);
      await update(qrRef, form); // Update data in Firebase

      setMessage("QR updated successfully!");
      setTimeout(() => setMessage(""), 3000);
      setSelectedQR(null); // Close edit modal
    } catch (error) {
      console.error(error);
      setMessage("Error updating QR.");
    }
  };

  // -------------------- Delete QR --------------------
  const handleDelete = async (qrId) => {
    if (!window.confirm("Are you sure you want to delete this QR?")) return;
    try {
      await remove(ref(db, `QR-Data/${qrId}`)); // Delete QR data from Firebase
      setQrList((prev) => prev.filter((qr) => qr.id !== qrId)); // Update UI
      setMessage("QR deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Error deleting QR.");
    }
  };

  // -------------------- Render UI --------------------
  return (
    <div className="p-8 relative">
      <h1 className="text-center text-3xl font-bold mb-6">QR-Code List</h1>
      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      {/* -------------------- Location Filter Dropdown -------------------- */}
      <div className="mb-6 flex justify-center">
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="p-2 rounded bg-slate-100 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">-- All Locations --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* -------------------- QR List -------------------- */}
      {qrList.length === 0 ? (
        <p className="text-center text-gray-600">No QR data found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrList.map((qr) => (
            <div
              key={qr.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* QR Details */}
              <h3 className="text-xl font-bold mb-2">{qr.name}</h3>
              <p className="text-gray-600 mb-1">
                <strong>Lat, Long:</strong> {qr.latitude}, {qr.longitude}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Type:</strong> {qr.type}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Points:</strong> {qr.points}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Location:</strong> {qr.location}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Image:</strong>{" "}
                <a
                  href={qr.picture}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View
                </a>
              </p>
              <p className="text-gray-600">
                <strong>Description:</strong> {qr.description}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    qr.status === "Active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {qr.status}
                </span>
              </p>

              {/* Edit and Delete Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(qr)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(qr.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------- Edit Popup Modal -------------------- */}
      {selectedQR && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-center">Update QR</h2>

            {/* Update Form */}
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* QR Name */}
              <div>
                <label className="font-semibold">QR Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded bg-slate-100 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
              </div>

              {/* Latitude and Longitude Inputs */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="font-semibold">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-slate-200 focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="font-semibold">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-slate-200 focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              {/* Location Dropdown */}
              <div>
                <label className="font-semibold">Location Area</label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded bg-slate-100 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                >
                  <option value="">-- Select Location --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type and Points Inputs */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="font-semibold">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-slate-200 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="w-1/2">
                  <label className="font-semibold">Points</label>
                  <input
                    type="number"
                    name="points"
                    value={form.points}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-slate-200 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Picture URL */}
              <label className="font-semibold">Picture URL</label>
              <input
                type="url"
                name="picture"
                value={form.picture}
                onChange={handleChange}
                className="w-full p-2 rounded bg-slate-200 focus:ring-2 focus:ring-blue-400"
              />

              {/* Description */}
              <label className="font-semibold">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-slate-200 focus:ring-2 focus:ring-blue-400"
                rows="3"
              />

              {/* Status Radio Buttons */}
              <div className="flex gap-4 items-center">
                <label className="font-semibold">Status:</label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={form.status === "Active"}
                    onChange={handleChange}
                  />
                  Active
                </label>
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Disable"
                    checked={form.status === "Disable"}
                    onChange={handleChange}
                  />
                  Disable
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQR(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
