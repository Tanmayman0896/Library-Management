'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  getActiveSession, getSessionHistory,
  markAway, markBack, confirmPresence, endSession,
  logout, getStoredUser
} from '@/lib/api'

function formatDuration(startISO, endISO) {
  const ms = new Date(endISO || Date.now()) - new Date(startISO)
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 86400000 && d.getDate() === now.getDate()) return 'Today'
  if (diff < 172800000) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function useLiveTimer(startISO) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!startISO) return
    const tick = () => setElapsed(Math.floor((Date.now() - new Date(startISO)) / 1000))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [startISO])
  const h = String(Math.floor(elapsed / 3600)).padStart(2, '0')
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
  const s = String(elapsed % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function usePingCountdown(lastPingISO) {
  const PING_TIMEOUT = 2 * 60 * 60 * 1000
  const [remaining, setRemaining] = useState(PING_TIMEOUT)
  useEffect(() => {
    if (!lastPingISO) return
    const tick = () => {
      const r = PING_TIMEOUT - (Date.now() - new Date(lastPingISO))
      setRemaining(Math.max(0, r))
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [lastPingISO])
  const totalSec = Math.floor(remaining / 1000)
  const m = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const s = String(totalSec % 60).padStart(2, '0')
  return { display: `${m}:${s}`, critical: remaining < 5 * 60 * 1000 }
}

export default function Dashboard() {
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const sessionTime = useLiveTimer(session?.startTime)
  const ping = usePingCountdown(session?.lastPingTime)

  const load = useCallback(async () => {
    const token = typeof window !== 'undefined' && localStorage.getItem('deskguard_token')
    if (!token) { router.replace('/login'); return }
    try {
      const [active, hist] = await Promise.all([getActiveSession(), getSessionHistory()])
      setSession(active)
      setHistory((hist || []).filter(s => s.status !== 'ACTIVE' && s.status !== 'AWAY').slice(0, 3))
    } catch (e) {
      if (e.message?.includes('401') || e.message?.includes('Invalid') || e.message?.includes('expired')) {
        router.replace('/login')
      }
    } finally { setLoading(false) }
  }, [router])

  useEffect(() => { load() }, [load])

  async function handleAway() {
    setActionLoading(true)
    try { setSession(await markAway()) } catch(e) { alert(e.message) }
    setActionLoading(false)
  }
  async function handleBack() {
    setActionLoading(true)
    try { setSession(await markBack()) } catch(e) { alert(e.message) }
    setActionLoading(false)
  }
  async function handleConfirm() {
    setActionLoading(true)
    try { setSession(await confirmPresence()) } catch(e) { alert(e.message) }
    setActionLoading(false)
  }
  async function handleEnd() {
    if (!confirm('End your session?')) return
    setActionLoading(true)
    try { await endSession(); setSession(null); load() } catch(e) { alert(e.message) }
    setActionLoading(false)
  }
  function handleLogout() { logout(); router.push('/login') }

  const isAway = session?.status === 'AWAY'
  const startedAt = session ? new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="flex items-center bg-white border-b border-gray-200 px-8 h-20 gap-6 flex-shrink-0">
        <Image src="/full-logo.svg" alt="DeskGuard" width={48} height={36} priority />
        <div className="flex items-center gap-1">
          <button onClick={() => router.push('/map')} className="px-4 py-1.5 text-base font-medium capitalize transition-colors border-b-2 border-transparent text-gray-400 hover:text-gray-700">Map</button>
          <button className="px-4 py-1.5 text-base font-medium capitalize transition-colors border-b-2 border-black text-black">Dashboard</button>
        </div>
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search floors, zones, or desk IDs..." className="w-full bg-gray-100 rounded-full pl-11 pr-5 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-1 focus:ring-gray-300" />
          </div>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 border border-gray-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          </button>
        </div>
      </nav>

      <main className={`flex flex-col flex-1 px-8 py-8${!session && !loading ? ' items-center justify-center' : ''}`} style={{ gap: 24, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {loading ? (
          <p className="text-gray-400 mt-16 text-center">Loading...</p>
        ) : !session ? (
          <div className="mt-16 text-center">
            <p className="text-2xl font-bold text-gray-800 mb-2">No Active Session</p>
            <p className="text-gray-500 mb-6">Scan a desk QR code or check in from the map to start a session.</p>
            <button onClick={() => router.push('/map')} className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors">Go to Map</button>
          </div>
        ) : (
          <>
            <div className="flex flex-col" style={{ gap: 4 }}>
              <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Active Study Session</p>
              <div className="flex items-center gap-3">
                <button onClick={() => router.push('/map')} className="text-gray-800 hover:text-gray-600 transition-colors">
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M16 6L9 13l7 7" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <h1 className="font-bold text-gray-900" style={{ fontSize: 38, fontWeight: 700 }}>Desk {session.desk?.label}</h1>
                {isAway && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">Away</span>}
              </div>
            </div>

            {ping.critical && (
              <div className="flex items-center justify-between px-5 py-4 rounded-lg" style={{ background: 'rgba(254,242,242,1)', border: '1px solid rgba(254,202,202,1)' }}>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center rounded-md shrink-0" style={{ width: 36, height: 36, background: '#dc2626' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3L2 15h14L9 3z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 8v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="13" r="0.8" fill="white"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: '#991b1b' }}>Still here? Confirm your presence</p>
                    <p className="text-sm text-gray-600 mt-0.5">Your desk reservation will be released to others in <span className="font-semibold" style={{ color: '#dc2626' }}>{ping.display}</span> if not confirmed.</p>
                  </div>
                </div>
                <button onClick={handleConfirm} disabled={actionLoading} className="shrink-0 px-5 py-2.5 rounded-md text-sm font-semibold text-white ml-6 disabled:opacity-50" style={{ background: '#991b1b' }}>I'm Still Here</button>
              </div>
            )}

            <div className="flex gap-5" style={{ alignItems: 'flex-start' }}>
              <div className="flex flex-col rounded-xl border" style={{ flex: '1 1 0', borderColor: 'rgba(226,232,240,1)', padding: '32px 28px 28px' }}>
                <p className="text-sm text-gray-500 text-center mb-3">Total Session Time</p>
                <p className="text-center font-bold tracking-tight mb-2" style={{ fontSize: 52, lineHeight: 1, letterSpacing: '-1px', color: '#0f172a' }}>{sessionTime}</p>
                <p className="text-sm text-gray-500 text-center mb-8">Started at {startedAt}</p>
                <div className="flex gap-3 justify-center">
                  {isAway ? (
                    <button onClick={handleBack} disabled={actionLoading} className="flex items-center gap-2 px-5 py-2.5 rounded-md border text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50" style={{ borderColor: 'rgba(100,116,139,1)', borderWidth: '1.5px' }}>I'm Back</button>
                  ) : (
                    <button onClick={handleAway} disabled={actionLoading} className="flex items-center gap-2 px-5 py-2.5 rounded-md border text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50" style={{ borderColor: 'rgba(100,116,139,1)', borderWidth: '1.5px' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="4" r="1.5" fill="#374151"/><path d="M8 6v4" stroke="#374151" strokeWidth="1.3" strokeLinecap="round"/><path d="M6 9l-2 3M10 9l2 3" stroke="#374151" strokeWidth="1.3" strokeLinecap="round"/></svg>
                      I'm Stepping Away
                    </button>
                  )}
                  <button onClick={handleEnd} disabled={actionLoading} className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50" style={{ background: '#0f172a' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    End Session
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-xl border" style={{ width: 280, flexShrink: 0, borderColor: 'rgba(226,232,240,1)', padding: '20px 20px 16px' }}>
                <h2 className="font-semibold text-gray-900 mb-3" style={{ fontSize: 15 }}>Recent Sessions</h2>
                <div style={{ borderTop: '1px solid rgba(226,232,240,1)' }} />
                <div className="flex flex-col mt-1">
                  {history.length === 0 && <p className="text-xs text-gray-400 py-4 text-center">No past sessions yet</p>}
                  {history.map((s, i) => (
                    <div key={i} className="py-3" style={{ borderBottom: '1px solid rgba(241,245,249,1)' }}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-gray-900">Desk {s.desk?.label}</span>
                        <span className="text-xs text-gray-400">{formatDate(s.startTime)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{formatDuration(s.startTime, s.endTime)}</span>
                        <span className="text-xs text-gray-400">{s.desk?.wing} Wing</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2 rounded-md border text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors" style={{ borderColor: 'rgba(203,213,225,1)' }}>View Full History</button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-4 rounded-xl border px-5 py-4" style={{ flex: '1 1 0', borderColor: 'rgba(226,232,240,1)' }}>
                <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 42, height: 42, background: 'rgba(241,245,249,1)' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="6" y="4" width="10" height="14" rx="2" stroke="#64748b" strokeWidth="1.4"/><path d="M9 8v3M13 8v3" stroke="#64748b" strokeWidth="1.4" strokeLinecap="round"/></svg>
                </div>
                <div><p className="text-xs text-gray-500 mb-0.5">Power Outlets</p><p className="text-sm font-semibold text-gray-900">2 Available</p></div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border px-5 py-4" style={{ flex: '1 1 0', borderColor: 'rgba(226,232,240,1)' }}>
                <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 42, height: 42, background: 'rgba(241,245,249,1)' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 16a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="#64748b"/><path d="M8 13.5a4.2 4.2 0 0 1 6 0" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/><path d="M5 10.5a7.5 7.5 0 0 1 12 0" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/><path d="M2.5 7.5a11 11 0 0 1 17 0" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </div>
                <div><p className="text-xs text-gray-500 mb-0.5">Network</p><p className="text-sm font-semibold text-gray-900">iBUS @ MUJ (Excellent)</p></div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}