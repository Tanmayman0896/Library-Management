'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/white-logo.svg"
          alt="StudySpace"
          width={80}
          height={80}
          priority
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        <h1 className="text-white text-2xl font-bold text-center mb-2">
          Create New Account
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`h-1.5 w-10 rounded-full ${step >= 1 ? 'bg-white' : 'bg-zinc-700'}`} />
          <div className={`h-1.5 w-10 rounded-full ${step >= 2 ? 'bg-white' : 'bg-zinc-700'}`} />
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold text-sm py-3 rounded-xl mt-2 hover:bg-gray-200 transition-colors"
            >
              Continue
            </button>
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
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
            />
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-zinc-700 text-white font-semibold text-sm py-3 rounded-xl hover:border-white transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-white text-black font-semibold text-sm py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        <p className="text-zinc-500 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
