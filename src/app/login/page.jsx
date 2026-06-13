'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // Auth logic goes here
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
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm rounded-xl px-4 py-3 outline-none focus:border-white transition-colors"
          />

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold text-sm py-3 rounded-xl mt-2 hover:bg-gray-200 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-zinc-500 text-sm text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-white font-semibold hover:underline">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  )
}
