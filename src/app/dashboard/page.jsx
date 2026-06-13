'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getActiveSession, getSessionHistory, markAway, markBack, confirmPresence, endSession, logout, getStoredUser } from '@/lib/api'

function useCountdown(totalSeconds) {
  const [seconds, setSeconds] = useState(totalSeconds)
  useEffect(() => {
    if (seconds <= 0) return
    const t = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [seconds])
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

function useSessionTimer(startSeconds) {
  const [elapsed, setElapsed] = useState(startSeconds)
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(t)
  }, [])
  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0')
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
  const s = String(elapsed % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function Dashboard() {
  const router = useRouter()
  const countdown = useCountdown(4 * 60 + 29)
  const sessionTime = useSessionTimer(2 * 3600 + 15 * 60 + 43)

  const recentSessions = [
    { desk: 'Desk B-205', date: 'Yesterday', duration: '3h 45m', zone: 'Level 3 Quiet Zone' },
    { desk: 'Desk A-012', date: 'Oct 24', duration: '1h 15m', zone: 'Level 1 Collab Space' },
    { desk: 'Study Room 4', date: 'Oct 22', duration: '2h 00m', zone: 'Level 4 Graduate Space' },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center bg-white border-b border-gray-200 px-8 h-20 gap-6 flex-shrink-0">
        <Image src="/full-logo.svg" alt="DeskGuard" width={48} height={36} priority />
        <div className="flex items-center gap-1">
          <button onClick={() => router.push('/map')}
            className="px-4 py-1.5 text-base font-medium capitalize transition-colors border-b-2 border-transparent text-gray-400 hover:text-gray-700">
            Map
          </button>
          <button
            className="px-4 py-1.5 text-base font-medium capitalize transition-colors border-b-2 border-black text-black">
            Dashboard
          </button>
        </div>
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search floors, zones, or desk IDs..."
              className="w-full bg-gray-100 rounded-full pl-11 pr-5 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-1 focus:ring-gray-300" />
          </div>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button onClick={() => { sessionStorage.removeItem('deskguard_session'); router.push('/login') }}
            className="flex items-center gap-2 text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 border border-gray-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main
        className="flex flex-col"
        style={{
          width: 1479,
          height: 877,
          maxWidth: 1663.87,
          paddingLeft: 27.73,
          paddingRight: 27.73,
          gap: 46.22,
          marginTop: 98,
          marginLeft: 17,
        }}
      >

        {/* Header group */}
        <div className="flex flex-col" style={{ gap: 6 }}>
        <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
          Active Study Session
        </p>

        {/* Back + Desk heading */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/map')}
            className="text-gray-800 hover:text-gray-600 transition-colors"
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M16 6L9 13l7 7" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontSize: 38, fontWeight: 700 }}>
            Desk LW-22
          </h1>
        </div>
        </div>

        {/* Presence confirmation alert */}
        <div
          className="flex items-center justify-between px-5 py-4 rounded-lg"
          style={{
            background: 'rgba(254,242,242,1)',
            border: '1px solid rgba(254,202,202,1)',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center rounded-md shrink-0"
              style={{ width: 36, height: 36, background: '#dc2626' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3L2 15h14L9 3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 8v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="13" r="0.8" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-red-800 text-sm" style={{ color: '#991b1b' }}>
                Still here? Confirm your presence
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                Your desk reservation will be released to others in{' '}
                <span className="font-semibold" style={{ color: '#dc2626' }}>{countdown}</span>{' '}
                if not confirmed.
              </p>
            </div>
          </div>
          <button
            className="shrink-0 px-5 py-2.5 rounded-md text-sm font-semibold text-white ml-6"
            style={{ background: '#991b1b' }}
          >
            I'm Still Here
          </button>
        </div>

        {/* Two-column section */}
        <div className="flex gap-5" style={{ alignItems: 'flex-start' }}>

          {/* Left: Session timer card */}
          <div
            className="flex flex-col rounded-xl border"
            style={{
              flex: '1 1 0',
              borderColor: 'rgba(226,232,240,1)',
              background: 'white',
              padding: '32px 28px 28px',
            }}
          >
            <p className="text-sm text-gray-500 text-center mb-3" style={{ fontSize: 13 }}>
              Total Session Time
            </p>
            <p
              className="text-center font-bold tracking-tight mb-2"
              style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-1px', color: '#0f172a' }}
            >
              {sessionTime}
            </p>
            <p className="text-sm text-gray-500 text-center mb-8" style={{ fontSize: 13 }}>
              Started at 09:30 AM
            </p>

            {/* Action buttons */}
            <div className="flex gap-3 justify-center">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-md border text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'rgba(100,116,139,1)', borderWidth: '1.5px' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="4" r="1.5" fill="#374151"/>
                  <path d="M8 6v4" stroke="#374151" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M6 9l-2 3M10 9l2 3" stroke="#374151" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M6 12h4" stroke="#374151" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                I'm Stepping Away
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: '#0f172a' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1.3"/>
                  <path d="M8 5v3l2 2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                End Session
              </button>
            </div>
          </div>

          {/* Right: Recent Sessions card */}
          <div
            className="flex flex-col rounded-xl border"
            style={{
              width: 280,
              flexShrink: 0,
              borderColor: 'rgba(226,232,240,1)',
              background: 'white',
              padding: '20px 20px 16px',
            }}
          >
            <h2 className="font-semibold text-gray-900 mb-3" style={{ fontSize: 15 }}>
              Recent Sessions
            </h2>
            <div style={{ borderTop: '1px solid rgba(226,232,240,1)' }} />

            <div className="flex flex-col mt-1">
              {recentSessions.map((s, i) => (
                <div
                  key={i}
                  className="py-3"
                  style={{ borderBottom: '1px solid rgba(241,245,249,1)' }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">{s.desk}</span>
                    <span className="text-xs text-gray-400">{s.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{s.duration}</span>
                    <span className="text-xs text-gray-400">{s.zone}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-4 w-full py-2 rounded-md border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'rgba(203,213,225,1)' }}
            >
              View Full History
            </button>
          </div>
        </div>

        {/* Bottom info cards */}
        <div className="flex gap-4">
          {/* Power outlets */}
          <div
            className="flex items-center gap-4 rounded-xl border px-5 py-4"
            style={{
              flex: '1 1 0',
              borderColor: 'rgba(226,232,240,1)',
              background: 'white',
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{ width: 42, height: 42, background: 'rgba(241,245,249,1)' }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="6" y="4" width="10" height="14" rx="2" stroke="#64748b" strokeWidth="1.4"/>
                <path d="M9 8v3M13 8v3" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M9 11h4v1.5a2 2 0 0 1-4 0V11z" stroke="#64748b" strokeWidth="1.1"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Power Outlets</p>
              <p className="text-sm font-semibold text-gray-900">2 Available</p>
            </div>
          </div>

          {/* Network */}
          <div
            className="flex items-center gap-4 rounded-xl border px-5 py-4"
            style={{
              flex: '1 1 0',
              borderColor: 'rgba(226,232,240,1)',
              background: 'white',
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{ width: 42, height: 42, background: 'rgba(241,245,249,1)' }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 16a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#64748b"/>
                <path d="M8 13.5a4.2 4.2 0 0 1 6 0" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M5 10.5a7.5 7.5 0 0 1 12 0" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M2.5 7.5a11 11 0 0 1 17 0" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Network</p>
              <p className="text-sm font-semibold text-gray-900">iBUS @ MUJ (Excellent)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
