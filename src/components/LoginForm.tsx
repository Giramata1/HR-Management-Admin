'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

function DashboardPreview() {
  return (
    <div className="w-full h-full flex items-end justify-end bg-[#f8f6ff] p-9">
      <div className="bg-white p-4 rounded-2xl border border-gray-200 max-w-[80%]">
        <Image
          src="/image.png"
          alt="Dashboard Screenshot"
          width={900}
          height={500}
          className="w-full h-auto rounded-xl object-cover"
        />
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onBack, onNext }: { onBack: (e: React.MouseEvent) => void; onNext: (e: React.MouseEvent) => void }) {
  const [email, setEmail] = useState('rebeccabyamungu6@gmail.com');

  const handleEmailSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (email) onNext(e);
  };

  return (
    <div className="w-full max-w-md mx-auto px-8 py-12 space-y-8 bg-white">
      <div className="text-left">
        <button
          onClick={onBack}
          className="flex items-center text-gray-500 text-sm font-medium hover:text-gray-700 mb-8"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <span className="text-lg font-bold">∞</span>
          </div>
          <h1 className="text-2xl font-bold text-black">HRMS</h1>
        </div>
        <h2 className="text-2xl font-bold text-black mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-500 mb-8">
          Enter your registered email address, we&apos;ll send you a code to reset your password
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 pt-6 pb-2 text-black border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="robertallen@example.com"
          />
          <label className="absolute left-4 top-2 text-sm text-purple-600">Email Address</label>
        </div>

        <button
          type="submit"
          onClick={handleEmailSubmit}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}

function VerifyOTPForm({ onBack, onVerify }: { onBack: (e: React.MouseEvent) => void; onVerify: (e: React.MouseEvent) => void }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const correctOtp = '1234'; 

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifySubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp === correctOtp) onVerify(e);
  };

  return (
    <div className="w-full max-w-md mx-auto px-8 py-12 space-y-8 bg-white">
      <div className="text-left">
        <button
          onClick={onBack}
          className="flex items-center text-gray-500 text-sm font-medium hover:text-gray-700 mb-8"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <span className="text-lg font-bold">∞</span>
          </div>
          <h1 className="text-2xl font-bold text-black">HRMS</h1>
        </div>
        <h2 className="text-2xl font-bold text-black mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-500 mb-8">
          We have sent a code to your registered email address rebeccabyamungu6@gmail.com
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-12 text-center text-xl font-semibold border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          onClick={handleVerifySubmit}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          Verify
        </button>
      </div>
    </div>
  );
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setError] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(true);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setError(false);
    setForgotPassword(true);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPassword(false);
    setVerifyOtp(false);
    setPasswordUpdated(false);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPassword(false);
    setVerifyOtp(true);
  };

  const handleVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    setVerifyOtp(false);
    setPasswordUpdated(true);
  };

  return passwordUpdated ? (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 w-full">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center space-y-4 max-w-sm">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">
              🎉
            </div>
          </div>
          <h2 className="text-2xl font-bold text-black">Password Update</h2>
          <p className="text-sm text-gray-500">Your password has been updated successfully</p>
          <button
            onClick={handleBack}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  ) : verifyOtp ? (
    <VerifyOTPForm onBack={handleBack} onVerify={handleVerify} />
  ) : forgotPassword ? (
    <ForgotPasswordForm onBack={handleBack} onNext={handleNext} />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 w-full">
      <div className="w-full max-w-sm space-y-10">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              ∞
            </div>
            <h1 className="text-2xl font-bold text-black">HRMS</h1>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-black flex items-center gap-1">
              Welcome <span className="text-xl">👋</span>
            </h2>
            <p className="text-gray-400 text-sm">Please login here</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="email"
              required
              className="w-full px-4 pt-6 pb-2 text-black border border-purple-500 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue="rebeccabyamungu6@gmail.com"
            />
            <label className="absolute left-4 top-2 text-sm text-purple-600">Email Address</label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full px-4 pt-6 pb-2 text-black border border-purple-500 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue="password"
            />
            <label className="absolute left-4 top-2 text-sm text-purple-600">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-black">
              <input
                type="checkbox"
                className="w-4 h-4 accent-purple-600"
                defaultChecked
              />
              <span>Remember Me</span>
            </label>
            <a
              href="#"
              onClick={handleForgotPassword}
              className="text-purple-600 hover:underline font-medium"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white py-3 rounded-xl text-sm font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex">
      <div className="w-3/5 hidden md:flex">
        <DashboardPreview />
      </div>
      <div className="w-full md:w-2/5 flex items-center justify-center bg-white">
        <LoginForm />
      </div>
    </div>
  );
}