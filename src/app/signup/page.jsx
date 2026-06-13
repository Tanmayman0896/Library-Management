'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
  })

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleNext(e) {
    e.preventDefault()
    setStep(2)
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Registration logic goes here
  }

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left — black panel with white logo */}
      <div
        className="bg-black flex items-center justify-center flex-shrink-0"
        style={{
          width: '801px',
          minHeight: '982px',
          borderTopRightRadius: '68px',
          borderBottomRightRadius: '68px',
        }}
      >
        <Image
          src="/white-logo.svg"
          alt="DeskGuard"
          width={480}
          height={360}
          priority
          style={{ filter: 'invert(1)' }}
        />
      </div>

      {/* Right — off-white form panel */}
      <div className="flex-1 bg-[#F5F5F0] flex items-center justify-center px-16">
        <div className="w-full max-w-[400px]">
          <h1 className="text-[42px] font-extrabold text-black mb-3 tracking-tight">
            Create New Account
          </h1>
          <p className="text-[15px] text-gray-500 mb-10">
            Please provide your information to sign up.
          </p>

          {step === 1 && (
            <form onSubmit={handleNext} className="flex flex-col gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full bg-[#F0EFEA] border border-gray-200 text-black placeholder-gray-400 text-[15px] rounded-2xl px-5 py-4 outline-none focus:border-gray-400 transition-colors"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full bg-[#F0EFEA] border border-gray-200 text-black placeholder-gray-400 text-[15px] rounded-2xl px-5 py-4 outline-none focus:border-gray-400 transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-[#F0EFEA] border border-gray-200 text-black placeholder-gray-400 text-[15px] rounded-2xl px-5 py-4 outline-none focus:border-gray-400 transition-colors"
              />

              {/* Arrow submit button */}
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="border border-black rounded-lg px-12 py-4 hover:bg-black hover:text-white transition-colors"
                >
                  <svg width="24" height="14" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="0" y1="7" x2="22" y2="7"/>
                    <polyline points="16 1 22 7 16 13"/>
                  </svg>
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                value={form.studentId}
                onChange={handleChange}
                required
                className="w-full bg-[#F0EFEA] border border-gray-200 text-black placeholder-gray-400 text-[15px] rounded-2xl px-5 py-4 outline-none focus:border-gray-400 transition-colors"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-[#F0EFEA] border border-gray-200 text-black placeholder-gray-400 text-[15px] rounded-2xl px-5 py-4 outline-none focus:border-gray-400 transition-colors"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-[#F0EFEA] border border-gray-200 text-black placeholder-gray-400 text-[15px] rounded-2xl px-5 py-4 outline-none focus:border-gray-400 transition-colors"
              />

              {/* Arrow submit button */}
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="border border-black rounded-lg px-12 py-4 hover:bg-black hover:text-white transition-colors"
                >
                  <svg width="24" height="14" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="0" y1="7" x2="22" y2="7"/>
                    <polyline points="16 1 22 7 16 13"/>
                  </svg>
                </button>
              </div>
            </form>
          )}

          <p className="text-[15px] text-gray-500 text-center mt-10">
            Already have an Account?{' '}
            <Link href="/login" className="text-black font-bold hover:underline">
              Sign In now.
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
