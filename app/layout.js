"use client"

import { Geist, Geist_Mono } from "next/font/google";
import { Amita } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/ui/toast";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {/* <Navbar /> */}
          <div className="flex">
          <Sidebar/>
          <div className="flex-1">

          {children}
          {/* <Footer/> */}
          </div>
            </div>
        </ToastProvider>
      </body>
    </html>
  );
}
