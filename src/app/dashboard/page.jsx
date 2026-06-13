'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
      <nav
        className="flex items-center px-6 border-b shrink-0"
        style={{
          height: 56,
          borderColor: 'rgba(226,232,240,1)',
          background: 'white',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#1e293b"/>
            <path d="M16 6L8 10v7c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11v-7L16 6z" fill="#3b82f6"/>
            <path d="M13 16l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mr-8">
          <button
            onClick={() => router.push('/map')}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 pb-1"
          >
            Map
          </button>
          <button
            className="text-sm font-semibold text-gray-900 border-b-2 border-gray-900 pb-1"
          >
            Dashboard
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 flex justify-center">
          <div
            className="flex items-center gap-2 px-4 bg-white border rounded-full"
            style={{
              width: 340,
              height: 36,
              borderColor: 'rgba(203,213,225,1)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="#94a3b8" strokeWidth="1.2"/>
              <path d="M10.5 10.5L13 13" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-sm text-gray-400">Search floors, zones, or desk IDs...</span>
          </div>
        </div>

        {/* Right: Logout + Bell */}
        <div className="flex items-center gap-3 ml-6">
          <button
            onClick={() => {
              sessionStorage.removeItem('deskguard_session')
              router.push('/login')
            }}
            className="flex items-center gap-2 px-4 py-1.5 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'rgba(203,213,225,1)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5" r="2.5" stroke="#64748b" strokeWidth="1.2"/>
              <path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Logout
          </button>
          <button className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'rgba(203,213,225,1)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a5 5 0 0 1 5 5v2.5l1.5 2.5H2.5L4 9.5V7a5 5 0 0 1 5-5z" stroke="#64748b" strokeWidth="1.2"/>
              <path d="M7 14.5a2 2 0 0 0 4 0" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round"/>
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
