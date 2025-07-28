'use client'

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const register = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccessMessage('Registration successful! Redirecting to login...');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Optional: Redirect after success
      setTimeout(() => {
        router.replace('/login');
      }, 1000);
      
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full max-w-sm mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center mb-2 shadow-lg">
          <span className="text-white text-2xl font-bold">QV</span>
        </div>
        <h1 className="text-2xl font-bold text-purple-700 tracking-tight">Quit Vipe</h1>
      </div>
      
      <h2 className="text-xl font-semibold text-slate-700 mb-6 text-center">Create Account</h2>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={register} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-3 border ${errors.name ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-blue-50'} focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-3 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-blue-50'} focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-3 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-blue-50'} focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-3 border ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-blue-100 bg-blue-50'} focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-md hover:from-purple-600 hover:to-blue-600 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Processing...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="text-xs text-slate-400 mt-2 mb-4 text-center">
        By signing up, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
      </div>
      
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="mx-3 text-xs text-slate-400">or sign up with</span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>
      
      <div className="flex gap-3 justify-center mb-6">
        <button className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow hover:bg-slate-200 transition">
          <span className="text-slate-400">G</span>
        </button>
        <button className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow hover:bg-slate-200 transition">
          <span className="text-slate-400">F</span>
        </button>
        <button className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shadow hover:bg-slate-200 transition">
          <span className="text-slate-400">A</span>
        </button>
      </div>
      
      <div className="text-center text-sm text-slate-500">
        Already have an account?
        <Link href="/login" className="text-blue-500 font-semibold hover:underline ml-1">Log in</Link>
      </div>
    </main>
  );
}