'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/lib/api'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin(email, password)
      router.push('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div
        className="bg-black flex flex-col items-center justify-center flex-shrink-0 gap-6"
        style={{
          width: '801px',
          minHeight: '982px',
          borderTopRightRadius: '68px',
          borderBottomRightRadius: '68px',
        }}
      >
        <Image
          src="/full-logo.svg"
          alt="DeskGuard"
          width={480}
          height={360}
          priority
          style={{ filter: 'invert(1)' }}
        />
        <span className="text-white/50 tracking-[0.3em] text-sm uppercase font-medium">Admin Portal</span>
      </div>

      <div className="flex-1 bg-[#F5F5F0] flex items-center justify-center px-16">
        <div className="w-full max-w-[400px]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold mb-6 tracking-wide uppercase">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Librarian Access
          </div>
          <h1 className="text-[42px] font-extrabold text-black mb-3 tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-[15px] text-gray-500 mb-10">
            This portal is restricted to authorized library staff only.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F0EFEA] border border-gray-200 text-black placeholder-gray-400 text-[15px] rounded-2xl px-5 py-4 outline-none focus:border-gray-400 transition-colors"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F0EFEA] border border-gray-200 text-black placeholder-gray-400 text-[15px] rounded-2xl px-5 py-4 outline-none focus:border-gray-400 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={loading}
                className="border border-black rounded-lg px-12 py-4 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
              >
                <svg width="24" height="14" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="0" y1="7" x2="22" y2="7"/>
                  <polyline points="16 1 22 7 16 13"/>
                </svg>
              </button>
            </div>
          </form>

          <p className="text-[13px] text-gray-400 text-center mt-10">
            Not an admin?{' '}
            <a href="/login" className="text-black font-semibold hover:underline">
              Student login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
