"use client";
import React, { useState } from "react";

const Dashboard = () => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="p-8  px-20 bg-gradient-to-l from-blue-200 to-blue-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin QR Code Manager</h1>

      <div className="flex gap-8">
        {/* Form Section */}
        <div className="w-1/2 bg-white p-6 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-semibold">QR Name</label>
              <input
                type="text"
                name="name"
                placeholder="QR Code Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="font-semibold">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add QR Code
            </button>
          </form>
        </div>

        {/* QR List Section */}
        <div className="w-1/2 bg-gradient-to-l from-blue-200 to-blue-100">
          <h2 className="text-xl font-semibold mb-4">QR Codes List</h2>
          <div className="space-y-3">
            {qrList.map((qr, i) => (
              <div key={i} className="p-4 border rounded bg-white shadow">
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

    // <div>
    //   <h2 className="text-2xl font-bold mb-4">Dashboard Home</h2>
    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //     <div className="bg-white p-4 rounded shadow">Card 1</div>
    //     <div className="bg-white p-4 rounded shadow">Card 2</div>
    //     <div className="bg-white p-4 rounded shadow">Card 3</div>
    //   </div>
    // </div>
  );
};

export default Dashboard;
