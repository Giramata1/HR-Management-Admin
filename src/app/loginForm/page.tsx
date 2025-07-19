'use client';

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Dark mode hook shared with Sidebar
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return isDarkMode;
};

interface FormProps {
  onBack: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onNext?: (e: React.MouseEvent<HTMLButtonElement>, email?: string) => void;
  onVerify?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  email?: string;
}

const axiosInstance = axios.create({
  baseURL: 'https://hr-management-system-pmfp.onrender.com/api/auth',
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

function DashboardPreview() {
  return (
    <div className="w-full h-full flex items-end justify-end bg-[#f8f6ff] dark:bg-gray-900 p-9">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-[80%]">
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

function ForgotPasswordForm({ onBack, onNext }: FormProps) {
  const [email, setEmail] = useState('amugenigiramata@gmail.com');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/password-reset/request-otp', { email });
      setError('');
      onNext?.(e, email);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'Failed to send OTP. Please try again.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-8 py-12 space-y-8 bg-white dark:bg-gray-900">
      <div className="text-left">
        <button
          onClick={onBack}
          className="flex items-center text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-200 mb-8"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <span className="text-lg font-bold">∞</span>
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white">HRMS</h1>
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Enter your registered email address, we&apos;ll send you a code to reset your password
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 pt-6 pb-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="robertallen@example.com"
          />
          <label className="absolute left-4 top-2 text-sm text-purple-600">Email Address</label>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <button
          type="button"
          onClick={handleEmailSubmit}
          disabled={isLoading}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-colors disabled:bg-purple-400"
        >
          {isLoading ? 'Sending...' : 'Send OTP'}
        </button>
      </div>
    </div>
  );
}

function VerifyOTPForm({ onBack, onVerify, email }: FormProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifySubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/password-reset/verify-otp-and-set-password', {
        email,
        otp: otpValue,
        newPassword,
      });
      setError('');
      onVerify?.(e);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || 'OTP verification failed. Please try again.');
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-8 py-12 space-y-8 bg-white dark:bg-gray-900">
      <div className="text-left">
        <button
          onClick={onBack}
          className="flex items-center text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-200 mb-8"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <span className="text-lg font-bold">∞</span>
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white">HRMS</h1>
        </div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          We have sent a code to your registered email address
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-10 h-10 text-center text-xl font-semibold text-black dark:text-white bg-white dark:bg-gray-800 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>
        <div className="relative">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 pt-6 pb-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="New password"
          />
          <label className="absolute left-4 top-2 text-sm text-purple-600">New Password</label>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="button"
          onClick={handleVerifySubmit}
          disabled={isLoading}
          className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-colors disabled:bg-purple-400"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
}

function RegisterForm({ onBack }: { onBack: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/register', {
        fullName: form.fullName.trim(),
        role: 'HR',
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', form.fullName.trim());
      setError('');
      router.push('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
        if (errorMessage === 'Email already in use') {
          setError('Email already in use. Try logging in or resetting your password.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-6 w-full">
      <div className="w-full max-w-sm space-y-10">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              ∞
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white">HRMS</h1>
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Register</h2>
          <p className="text-gray-400 dark:text-gray-300 text-sm">Create a new account</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              required
              placeholder="Full Name"
              className="w-full px-4 pt-6 pb-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-purple-500 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              value={form.fullName}
              onChange={handleChange}
            />
            <label className="absolute left-4 top-2 text-sm text-purple-600">Full Name</label>
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full px-4 pt-6 pb-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-purple-500 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              value={form.email}
              onChange={handleChange}
            />
            <label className="absolute left-4 top-2 text-sm text-purple-600">Email Address</label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="Password"
              className="w-full px-4 pt-6 pb-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-purple-500 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              value={form.password}
              onChange={handleChange}
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

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              placeholder="Confirm Password"
              className="w-full px-4 pt-6 pb-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-purple-500 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <label className="absolute left-4 top-2 text-sm text-purple-600">Confirm Password</label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
              {error.includes('Email already in use') && (
                <>
                  {' '}
                  <button
                    onClick={onBack}
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Log in
                  </button>
                  {' or '}
                  <button
                    onClick={(e) => {
                      onBack(e);
                      setTimeout(() => document.querySelector<HTMLButtonElement>('button[aria-label="Forgot Password"]')?.click(), 0);
                    }}
                    className="text-purple-600 hover:underline font-medium"
                  >
                    reset password
                  </button>
                  .
                </>
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white py-3 rounded-xl text-sm font-semibold disabled:bg-purple-400"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <button onClick={onBack} className="text-purple-600 hover:underline font-medium">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  useDarkMode();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axiosInstance.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.fullName || email);
      setError('');
      router.push('/dashboard'); // Changed from '/app/page' to '/dashboard'
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
        if (errorMessage === 'Invalid email or password') {
          setError('Invalid email or password. Try again or reset your password.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setForgotPassword(true);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForgotPassword(false);
    setVerifyOtp(false);
    setPasswordUpdated(false);
    setIsRegister(false);
    setError('');
    setEmail('');
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>, submittedEmail?: string) => {
    e.preventDefault();
    if (submittedEmail) {
      setEmail(submittedEmail);
      setForgotPassword(false);
      setVerifyOtp(true);
    }
  };

  const handleVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setVerifyOtp(false);
    setPasswordUpdated(true);
  };

  const handleRegisterToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsRegister(true);
  };

  if (passwordUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-6 w-full">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center space-y-4 max-w-sm">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">🎉</div>
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white">Password Update</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Your password has been updated successfully</p>
            <button
              onClick={handleBack}
              className="w-full py-3 rounded-lg text-white text-sm font-semibold bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (verifyOtp) {
    return <VerifyOTPForm onBack={handleBack} onVerify={handleVerify} email={email} />;
  }

  if (forgotPassword) {
    return <ForgotPasswordForm onBack={handleBack} onNext={handleNext} />;
  }

  if (isRegister) {
    return <RegisterForm onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-6 w-full">
      <div className="w-full max-w-sm space-y-10">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              ∞
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white">HRMS</h1>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-black dark:text-white flex items-center gap-1">
              Welcome <span className="text-xl">👋</span>
            </h2>
            <p className="text-gray-400 dark:text-gray-300 text-sm">Please login here</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 pt-6 pb-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-purple-500 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue="amugenigiramata@gmail.com"
            />
            <label className="absolute left-4 top-2 text-sm text-purple-600">Email Address</label>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              className="w-full px-4 pt-6 pb-2 text-black dark:text-white bg-white dark:bg-gray-800 border border-purple-500 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
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

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
              {error.includes('Invalid email or password') && (
                <>
                  {' '}
                  <button
                    onClick={handleForgotPassword}
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Reset password
                  </button>
                  .
                </>
              )}
            </p>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-black dark:text-white">
              <input type="checkbox" className="w-4 h-4 accent-purple-600" defaultChecked />
              <span>Remember Me</span>
            </label>
            <button
              onClick={handleForgotPassword}
              className="text-purple-600 hover:underline font-medium"
              aria-label="Forgot Password"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white py-3 rounded-xl text-sm font-semibold"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don’t have an account?{' '}
          <button onClick={handleRegisterToggle} className="text-purple-600 hover:underline font-medium">
            Register
          </button>
        </p>
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
      <div className="w-full md:w-2/5 flex items-center justify-center bg-white dark:bg-gray-900">
        <LoginForm />
      </div>
    </div>
  );
}