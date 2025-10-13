"use client";
import React from "react";
import Link from "next/link";
import { FaHome, FaUsers, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-5">
      <ul className="space-y-4">
        <li>
          <Link href="/dashboard" className="flex items-center gap-2">
            <FaHome /> Home
          </Link>
        </li>
        <li>
          <Link href="/users" className="flex items-center gap-2">
            <FaUsers /> Users
          </Link>
        </li>
        <li>
          <Link href="/analytics" className="flex items-center gap-2">
            <FaChartBar /> Analytics
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
