
'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quitDate: ''
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        quitDate: session.user.quitDate ? new Date(session.user.quitDate).toISOString().split('T')[0] : ''
      });
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsEditing(false);
        // Refresh the page to update session data
        window.location.reload();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (status === "loading") {
    return (
      <main className="w-full max-w-sm mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/2 mb-6"></div>
          <div className="h-32 bg-slate-200 rounded-lg mb-4"></div>
          <div className="h-12 bg-slate-200 rounded-lg"></div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="w-full max-w-sm mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-slate-500">Please log in to view your profile.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-sm mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center mb-2 shadow-lg">
          <span className="text-white text-3xl font-bold">QV</span>
        </div>
        <h1 className="text-2xl font-bold text-purple-700 tracking-tight">My Profile</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quit Date</label>
              <input
                type="date"
                name="quitDate"
                value={formData.quitDate}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Name</span>
              <span className="font-semibold text-slate-700">{session && session.user.name || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Email</span>
              <span className="font-semibold text-slate-700">{session && session.user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Quit Date</span>
              <span className="font-semibold text-blue-600">
                {session && session.user.quitDate ? 
                  new Date(session.user.quitDate).toLocaleDateString() : 
                  'Not set'
                }
              </span>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-md hover:from-purple-600 hover:to-blue-600 transition"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={() => signOut()} 
        className="w-full py-3 rounded-lg bg-gradient-to-r from-slate-300 to-slate-400 text-red-600 font-semibold shadow-md hover:from-slate-400 hover:to-slate-500 transition mb-2"
      >
        Logout
      </button>
      
      <button 
        onClick={async () => {
          if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
              const res = await fetch('/api/auth/delete', { method: 'DELETE' });
              if (res.ok) {
                alert('Account deleted successfully!');
                await signOut({ callbackUrl: '/login' });
              } else {
                const error = await res.json();
                alert(error.error || 'Failed to delete account');
              }
            } catch (error) {
              alert('An error occurred while deleting your account');
            }
          }
        }}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition"
      >
        Delete Account
      </button>
    </main>
  )
}
