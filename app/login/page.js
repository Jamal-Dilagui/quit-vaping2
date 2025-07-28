'use client'
import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
       redirect: false,
        // callbackUrl: '/'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Login successful
      setSuccessMessage('Login successful! Redirecting...');
      router.replace('/');
    } catch (error) {
      setErrors({ server: error.message });
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <main className="w-full max-w-sm mx-auto px-4 py-8">
      {/* App Logo/Name */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center mb-2 shadow-lg">
          <span className="text-white text-2xl font-bold">QV</span>
        </div>
        <h1 className="text-2xl font-bold text-purple-700 tracking-tight">Quit Vipe</h1>
      </div>

      <h2 className="text-xl font-semibold text-slate-700 mb-6 text-center">Welcome Back</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errors.server && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {errors.server}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <div className="relative">
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-lg pl-10 pr-4 py-3 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-blue-50'} focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm`} 
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16v16H4z" fill="none"/>
              <path d="M22 6l-10 7L2 6"/>
            </svg>
          </span>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="relative">
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            className={`w-full rounded-lg pl-10 pr-4 py-3 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-blue-50'} focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm`} 
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </span>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-xs text-blue-500 hover:underline">Forgot password?</a>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-md hover:from-purple-600 hover:to-blue-600 transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : 'Login'}
        </button>
      </form>

      {/* <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="mx-3 text-xs text-slate-400">or continue with</span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="flex gap-3 justify-center mb-6">
        <button 
          onClick={() => handleSocialLogin('google')}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow hover:bg-slate-200 transition"
        >
          <span className="text-slate-400">G</span>
        </button>
        <button 
          onClick={() => handleSocialLogin('facebook')}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow hover:bg-slate-200 transition"
        >
          <span className="text-slate-400">F</span>
        </button>
        <button 
          onClick={() => handleSocialLogin('apple')}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow hover:bg-slate-200 transition"
        >
          <span className="text-slate-400">A</span>
        </button>
      </div> */}

      <div className="text-center text-sm text-slate-500 my-6">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-500 font-semibold hover:underline">Sign up</Link>
      </div>
    </main>
  )
}