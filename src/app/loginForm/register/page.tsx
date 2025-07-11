'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md space-y-6">
        
        <div className="flex items-center gap-2">
          <div className="bg-violet-500 text-white rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5l6 15M9 19.5L12 12 15 19.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-black">HRMS</h1>
        </div>

     
        <div>
          <h2 className="text-xl font-semibold text-black flex items-center gap-1">
            Create Account <span>👋</span>
          </h2>
          <p className="text-sm text-gray-400">Please signup below</p>
        </div>

     
        <form className="space-y-4">
          <div>
            <label className="block text-xs text-violet-600 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-violet-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs text-violet-600 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-2 border border-violet-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="relative">
            <label className="block text-xs text-violet-600 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-violet-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <label className="block text-xs text-violet-600 mb-1">Confirm Password</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-violet-700 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-700"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

        
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition"
          >
            signup
          </button>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
