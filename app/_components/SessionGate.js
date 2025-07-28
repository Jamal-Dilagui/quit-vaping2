'use client'
import { useSession } from "next-auth/react";

export default function SessionGate({ children }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-purple-200 dark:from-[#1a1333] dark:via-[#1e2746] dark:to-[#2d1a3a]">
        {/* Animated Glowing Spinner */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse bg-gradient-to-tr from-purple-400 via-blue-400 to-purple-600 w-32 h-32"></div>
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-500 border-opacity-80 border-solid shadow-lg"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-purple-700 dark:text-purple-300 drop-shadow-lg">QV</span>
          </div>
        </div>
        {/* Motivational Message */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-200 mb-2 tracking-tight animate-fade-in">Preparing your journey...</h2>
          <p className="text-slate-600 dark:text-slate-300 animate-fade-in-slow">Stay motivated. Every moment counts!</p>
        </div>
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1) both;
          }
          .animate-fade-in-slow {
            animation: fadeIn 1.5s cubic-bezier(0.4,0,0.2,1) both;
          }
        `}</style>
      </div>
    );
  }

  return children;
} 