'use client'
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import NavBar from "./_components/navBar";
import SessionGate from "./_components/SessionGate";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-purple-50 to-blue-50 min-h-screen flex flex-col font-sans">
        <SessionProvider>
          <SessionGate>
            <div className="flex-1 flex flex-col w-full max-w-sm mx-auto min-h-screen relative pb-12 overflow-y-auto">
              {children}
              <NavBar/>
            </div>
          </SessionGate>
        </SessionProvider>
      </body>
    </html>
  );
}
