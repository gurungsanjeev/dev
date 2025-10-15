"use client";
import React from "react";
import Link from "next/link";
import { FaHome, FaUsers, FaChartBar, } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { MdOutlineQrCode2 } from "react-icons/md";

const Sidebar = () => {
  return (
    <>
      <aside className="bg-gray-900 text-white w-64 min-h-screen p-5">
        <h1 className="flex items-center space-x-1 text-md sm:text-xl md:text-2xl">
          <img
            className="h-15 sm:h-20 md:h-[100px]"
            src="/ghumante.png"
            alt="Ghumante logo"
          />
          <div className="flex flex-col leading-tight">
            {/* <span className="custom-title">Ghumante</span>
            <span className="text-[#784E9A] font-heading">युवा</span> */}
          </div>
        </h1>
        <ul className="space-y-4 mt-5">
          <li className=" p-2 rounded-xl hover:bg-slate-600">
            <Link href="/addQR" className="flex items-center gap-2">
              {/* <FaHome /> Add QR */}
              <MdOutlinePostAdd className="text-2xl"/> Generate QR
            </Link>
          </li>
          <li className=" p-2 rounded-xl hover:bg-slate-600">
            <Link href="/qrData" className="flex items-center gap-2">
              {/* <FaUsers /> Qr Data */}
              <MdOutlineQrCode2 className="text-2xl" /> QR Data
            </Link>
          </li>
          <li className=" p-2 rounded-xl hover:bg-slate-600">
            <Link href="/analytics" className="flex items-center gap-2">
              <FaChartBar className="text-2xl" /> Analytics
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
