'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { logout, getDesks, checkin } from '@/lib/api'

const DESK_STYLE = {
  available: { background: 'rgba(240,253,244,1)', border: '0.74px solid rgba(134,239,172,1)', color: '#166534' },
  occupied:  { background: 'rgba(254,242,242,1)', border: '0.74px solid rgba(254,202,202,1)', color: '#991b1b' },
  away:      { background: 'rgba(254,252,232,1)', border: '0.74px solid rgba(253,224,71,1)',  color: '#854d0e' },
}

function apiStatusToLocal(s) {
  if (s === 'FREE') return 'available'
  if (s === 'AWAY') return 'away'
  return 'occupied'
}

function DeskModal({ desk, onClose, onCheckin, checkinLoading }) {
  const isFree = desk.status === 'available'
  const isAway = desk.status === 'away'
  const bg = isFree ? '#fafaf8' : '#1a1a1a'
  const qr = isFree ? '/black qr.svg' : isAway ? '/yellow qr.svg' : '/red qr.svg'
  const qrBg = isFree ? 'rgba(245,243,235,1)' : isAway ? 'rgba(255,248,230,1)' : 'rgba(255,235,235,1)'
  const tagColor = isFree ? '#2563eb' : isAway ? '#d97706' : '#dc2626'
  const labelColor = isFree ? '#111827' : isAway ? '#f59e0b' : '#ef4444'
  const borderColor = isFree ? '#e5e7eb' : 'rgba(255,255,255,0.12)'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="relative rounded-2xl shadow-2xl flex flex-col items-center" style={{ width: 280, background: bg, padding: '28px 24px 24px', border: `1px solid ${borderColor}` }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full" style={{ background: isFree ? '#f3f4f6' : 'rgba(255,255,255,0.1)', color: isFree ? '#6b7280' : 'rgba(255,255,255,0.5)' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <div className="rounded-xl flex items-center justify-center mb-4" style={{ width: 72, height: 72, background: qrBg }}>
          <Image src={qr} alt="QR" width={40} height={40} />
        </div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: tagColor }}>
          {isFree ? 'Ready for Check-In' : isAway ? 'Already Occupied · Away' : 'Already Occupied'}
        </p>
        <h2 className="text-[24px] font-bold mb-4 text-center" style={{ color: labelColor, letterSpacing: '-0.5px' }}>
          {desk.displayLabel || `Desk ${desk.label}`}
        </h2>
        {isFree && (
          <div className="w-full rounded-xl px-4 py-3 mb-5" style={{ background: 'rgba(249,250,251,1)', border: '1px solid #e5e7eb' }}>
            <div className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0"><circle cx="8" cy="8" r="7" stroke="#9ca3af" strokeWidth="1.2"/><path d="M8 7v4" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="5" r="0.7" fill="#9ca3af"/></svg>
              <p className="text-[11px] leading-relaxed" style={{ color: '#6b7280' }}>By checking in, you agree to the 2-hour activity prompts. Please ensure you clear your belongings if leaving for more than 30 minutes.</p>
            </div>
          </div>
        )}
        {isFree ? (
          <button onClick={() => onCheckin(desk.label)} disabled={checkinLoading} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60" style={{ background: '#111827' }}>
            {checkinLoading ? 'Checking in...' : 'Check-in Now →'}
          </button>
        ) : (
          <button className="w-full rounded-xl py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2" style={{ background: '#111827' }}>
            Notify When Vacated →
          </button>
        )}
        <button onClick={onClose} className="w-full rounded-xl py-3.5 text-sm font-semibold mt-2.5 flex items-center justify-center gap-2" style={{ background: isFree ? 'white' : 'rgba(255,255,255,0.08)', color: isFree ? '#374151' : 'rgba(255,255,255,0.7)', border: `1px solid ${isFree ? '#e5e7eb' : 'rgba(255,255,255,0.1)'}` }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Go to Map
        </button>
      </div>
    </div>
  )
}

function DeskCell({ label, displayLabel, status = 'occupied', onClick }) {
  const s = DESK_STYLE[status] || DESK_STYLE.occupied
  return (
    <div onClick={onClick} className="flex items-center justify-center cursor-pointer select-none hover:opacity-75 transition-opacity text-[9px] font-semibold" style={{ width: 59.71, height: 59.71, borderRadius: '2.94px', border: s.border, background: s.background, color: s.color, flexShrink: 0 }}>
      {displayLabel || label}
    </div>
  )
}
function CubicleCell({ label, displayLabel, status = 'occupied', onClick }) {
  const s = DESK_STYLE[status] || DESK_STYLE.occupied
  return (
    <div onClick={onClick} className="flex items-center justify-center cursor-pointer select-none hover:opacity-75 transition-opacity text-[8px] font-semibold" style={{ width: 62, height: 145, borderRadius: '2.94px', border: s.border, background: s.background, color: s.color, writingMode: 'vertical-rl', transform: 'rotate(180deg)', flexShrink: 0 }}>
      {displayLabel || label}
    </div>
  )
}
function DeskDivider({ label }) {
  return (
    <div className="flex items-center justify-center flex-shrink-0" style={{ width: 50, height: 442, borderRadius: '7.55px', border: '0.94px dashed rgba(198,198,205,1)', background: 'rgba(248,250,252,1)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', flexShrink: 5 }}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  )
}
const STUDY_STYLE = {
  available: { background: 'rgba(240,253,244,1)', border: '0.94px solid rgba(134,239,172,1)', color: '#166534' },
  occupied:  { background: 'rgba(254,242,242,1)', border: '0.94px solid rgba(254,202,202,1)', color: '#991b1b' },
  away:      { background: 'rgba(254,252,232,1)', border: '0.94px solid rgba(253,224,71,1)',  color: '#854d0e' },
}
function StudyDeskBtn({ label, displayLabel, status, onClick }) {
  const s = STUDY_STYLE[status] || STUDY_STYLE.occupied
  return (
    <div onClick={onClick} className="flex items-center justify-center cursor-pointer select-none hover:opacity-80 transition-opacity text-[11px] font-semibold" style={{ width: 162, height: 42, borderRadius: '3.78px', border: s.border, background: s.background, color: s.color, flexShrink: 0 }}>
      {displayLabel || label}
    </div>
  )
}

function LeftWingMap({ deskMap, onDeskClick }) {
  function ds(label) { return deskMap[label] || 'available' }
  function cell(label, display) {
    return { label, displayLabel: display || label, status: ds(label), onClick: () => onDeskClick(label, ds(label), display || label) }
  }

  const pc1 = [1,2,3,4,5,6,7].map(i => cell(`PC ${i}`))
  const pc2 = [8,9,10,11,12,13,14].map(i => cell(`PC ${i}`))
  const desk1 = [1,2,3,4,5,6,7].map(i => cell(String(i).padStart(2,'0')))
  const desk2 = [8,9,10,11,12,13,14].map(i => cell(String(i).padStart(2,'0')))
  const desk3 = [15,16,17,18,19,20,21].map(i => cell(String(i).padStart(2,'0')))
  const desk4 = [22,23,24,25,26,27,28].map(i => cell(String(i).padStart(2,'0')))

  const cubCols = [
    [1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15],[16,17,18]
  ].map(nums => nums.map(i => cell(`Cubicle ${String(i).padStart(2,'0')}`)))

  const sr = (room, n) => cell(`L-SR${room}-SD${n}`, `Study Desk ${n}`)

  function Col({ cells }) { return <div className="flex flex-col gap-1">{cells.map((c,i) => <DeskCell key={i} {...c} />)}</div> }
  function CubCol({ cells }) { return <div className="flex flex-col gap-1">{cells.map((c,i) => <CubicleCell key={i} {...c} />)}</div> }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5 items-start">
        <Col cells={pc1} />
        <Col cells={pc2} />
        <Col cells={desk1} />
        <DeskDivider label="DESK" />
        <Col cells={desk2} />
        <Col cells={desk3} />
        <DeskDivider label="DESK" />
        <Col cells={desk4} />
        <div className="flex gap-1 ml-1">
          {cubCols.map((col, i) => <CubCol key={i} cells={col} />)}
        </div>
        <div className="flex flex-col gap-3 ml-3">
          {[
            { title: 'COLLAB STUDY ROOM 4', desks: [sr(4,1),sr(4,2),sr(4,3)] },
            { title: 'COLLAB STUDY ROOM 3', desks: [sr(3,1),sr(3,2),sr(3,3)] },
          ].map((room, ri) => (
            <div key={ri} className="flex flex-col flex-shrink-0" style={{ width: 200, height: 210, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', padding: '16px 16px 20px', gap: 10, boxSizing: 'border-box' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{room.title}</p>
              <div className="flex flex-col" style={{ gap: 10 }}>
                {room.desks.map((d, i) => <StudyDeskBtn key={i} {...d} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3 items-stretch mt-1">
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 70, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', background: 'rgba(248,250,252,1)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', boxSizing: 'border-box' }}>
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Reception</span>
        </div>
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 440, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', background: 'rgba(248,250,252,1)', boxSizing: 'border-box' }}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Bookshelves</span>
        </div>
        {[
          { title: 'COLLAB STUDY ROOM 1', desks: [sr(1,1),sr(1,2),sr(1,3)] },
          { title: 'COLLAB STUDY ROOM 2', desks: [sr(2,1),sr(2,2),sr(2,3)] },
        ].map((room, ri) => (
          <div key={ri} className="flex flex-col flex-shrink-0" style={{ width: 200, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', padding: '16px 16px 20px', gap: 10, boxSizing: 'border-box' }}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{room.title}</p>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {room.desks.map((d, i) => <StudyDeskBtn key={i} {...d} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RightWingMap({ deskMap, onDeskClick }) {
  function ds(label) { return deskMap[label] || 'available' }
  function cell(label, display) {
    return { label, displayLabel: display || label, status: ds(label), onClick: () => onDeskClick(label, ds(label), display || label) }
  }

  const pc1 = [15,16,17,18,19,20,21].map(i => cell(`PC ${i}`))
  const pc2 = [22,23,24,25,26,27,28].map(i => cell(`PC ${i}`))
  const desk1 = [29,30,31,32,33,34,35].map(i => cell(String(i).padStart(2,'0')))
  const desk2 = [36,37,38,39,40,41,42].map(i => cell(String(i).padStart(2,'0')))
  const desk3 = [43,44,45,46,47,48,49].map(i => cell(String(i).padStart(2,'0')))
  const desk4 = [50,51,52,53,54,55,56].map(i => cell(String(i).padStart(2,'0')))

  const cubCols = [
    [19,20,21],[22,23,24],[25,26,27],[28,29,30],[31,32,33],[34,35,36]
  ].map(nums => nums.map(i => cell(`Cubicle ${String(i).padStart(2,'0')}`)))

  const sr = (room, n) => cell(`R-SR${room}-SD${n}`, `Study Desk ${n}`)

  function Col({ cells }) { return <div className="flex flex-col gap-1">{cells.map((c,i) => <DeskCell key={i} {...c} />)}</div> }
  function CubCol({ cells }) { return <div className="flex flex-col gap-1">{cells.map((c,i) => <CubicleCell key={i} {...c} />)}</div> }

  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="flex gap-2 mb-2">
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 70, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', background: 'rgba(248,250,252,1)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', boxSizing: 'border-box' }}>
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Reception</span>
        </div>
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 900, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', background: 'rgba(248,250,252,1)', boxSizing: 'border-box' }}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Bookshelves</span>
        </div>
      </div>
      <div className="flex gap-2 items-start">
        <Col cells={pc1} />
        <Col cells={pc2} />
        <Col cells={desk1} />
        <DeskDivider label="DESK" />
        <Col cells={desk2} />
        <Col cells={desk3} />
        <DeskDivider label="DESK" />
        <Col cells={desk4} />
        <div className="flex gap-1 ml-1">
          {cubCols.map((col, i) => <CubCol key={i} cells={col} />)}
        </div>
        <div className="flex flex-col gap-3 ml-4 flex-shrink-0">
          {[
            { title: 'COLLAB STUDY ROOM 5', desks: [sr(5,1),sr(5,2),sr(5,3)] },
            { title: 'COLLAB STUDY ROOM 6', desks: [sr(6,1),sr(6,2),sr(6,3)] },
          ].map((room, ri) => (
            <div key={ri} className="flex flex-col flex-shrink-0" style={{ width: 200, height: 215, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', padding: '16px 16px 20px', gap: 10, boxSizing: 'border-box' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{room.title}</p>
              <div className="flex flex-col" style={{ gap: 10 }}>
                {room.desks.map((d, i) => <StudyDeskBtn key={i} {...d} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  const router = useRouter()
  const [activeWing, setActiveWing] = useState('left')
  const [deskMap, setDeskMap] = useState({})
  const [stats, setStats] = useState({ total: 0, free: 0, occupied: 0, away: 0 })
  const [modalDesk, setModalDesk] = useState(null)
  const [checkinLoading, setCheckinLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('deskguard_token')) router.replace('/login')
  }, [router])

  const loadDesks = useCallback(async () => {
    try {
      const desks = await getDesks()
      const map = {}
      let free = 0, occupied = 0, away = 0
      desks.forEach(d => {
        map[d.label] = apiStatusToLocal(d.status)
        if (d.status === 'FREE') free++
        else if (d.status === 'AWAY') away++
        else occupied++
      })
      setDeskMap(map)
      setStats({ total: desks.length, free, occupied, away })
    } catch (e) { console.error(e) }
  }, [])

  useEffect(() => { loadDesks() }, [loadDesks])

  function handleDeskClick(label, status, displayLabel) {
    setModalDesk({ label, status, displayLabel })
  }

  async function handleCheckin(label) {
    setCheckinLoading(true)
    try {
      await checkin(label)
      setModalDesk(null)
      await loadDesks()
      router.push('/dashboard')
    } catch (e) {
      alert(e.message)
    } finally {
      setCheckinLoading(false)
    }
  }

  const occupancyPct = stats.total > 0 ? Math.round(((stats.occupied + stats.away) / stats.total) * 100) : 0
  const pctColor = occupancyPct >= 80 ? 'text-red-500' : occupancyPct >= 60 ? 'text-orange-500' : 'text-green-600'

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <nav className="flex items-center bg-white border-b border-gray-200 px-8 h-20 gap-6 flex-shrink-0">
        <Image src="/full-logo.svg" alt="DeskGuard" width={48} height={36} priority />
        <div className="flex items-center gap-1">
          <button className="px-4 py-1.5 text-base font-medium capitalize transition-colors border-b-2 border-black text-black">Map</button>
          <button onClick={() => router.push('/dashboard')} className="px-4 py-1.5 text-base font-medium capitalize transition-colors border-b-2 border-transparent text-gray-400 hover:text-gray-700">Dashboard</button>
        </div>
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search floors, zones, or desk IDs..." className="w-full bg-gray-100 rounded-full pl-11 pr-5 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none focus:ring-1 focus:ring-gray-300" />
          </div>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button onClick={() => { logout(); router.push('/login') }} className="flex items-center gap-2 text-sm font-medium border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 border border-gray-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex flex-col flex-shrink-0 overflow-y-auto" style={{ width: 260, background: 'rgba(252,248,250,1)', borderRight: '1px solid rgba(198,198,205,1)' }}>
          <div className="p-6 flex flex-col gap-5">
            <div>
              <p className="text-[13px] font-bold text-gray-800">Main Library</p>
              <div className="flex gap-1.5 flex-wrap mt-2">
                <span className="bg-gray-800 text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">Dome Building</span>
                <span className="bg-gray-100 text-gray-500 text-[10px] px-2.5 py-0.5 rounded-full font-medium">Ground Floor</span>
              </div>
            </div>
            <hr className="border-gray-200" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Current Occupancy</p>
              <p className={`text-4xl font-extrabold leading-none ${pctColor}`}>{occupancyPct}% <span className="text-base font-semibold text-gray-500">Full</span></p>
              <div className="flex gap-2.5 mt-4">
                <div className="flex-1 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <p className="text-[10px] text-gray-400 leading-tight">Available</p>
                  <p className="text-2xl font-extrabold text-black leading-tight mt-1">{stats.free}</p>
                </div>
                <div className="flex-1 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                  <p className="text-[10px] text-gray-400 leading-tight">Occupied</p>
                  <p className="text-2xl font-extrabold text-black leading-tight mt-1">{stats.occupied + stats.away}</p>
                </div>
              </div>
            </div>
            <hr className="border-gray-200" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Legend</p>
              <div className="flex flex-col gap-2.5">
                {[['bg-green-300','Available'],['bg-red-300','Occupied'],['bg-yellow-300','Away']].map(([cls,lbl])=>(
                  <div key={lbl} className="flex items-center gap-2.5">
                    <span className={`w-3.5 h-3.5 rounded-sm ${cls} flex-shrink-0`} />
                    <span className="text-[12px] text-gray-600">{lbl}</span>
                    {lbl === 'Away' && <span className="ml-auto text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full border border-gray-200">20m limit</span>}
                  </div>
                ))}
              </div>
            </div>
            <hr className="border-gray-200" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Navigation</p>
              <div className="flex flex-col gap-1.5">
                {[{key:'left',label:'Left Wing'},{key:'right',label:'Right Wing'}].map(({key,label})=>(
                  <button key={key} onClick={() => setActiveWing(key)}
                    className={`flex items-center justify-between text-[12px] font-medium px-3 py-2.5 rounded-lg transition-colors ${activeWing===key?'bg-gray-900 text-white':'hover:bg-gray-100 text-gray-700'}`}>
                    {label}
                    {activeWing===key
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-gray-50 p-6 flex items-start justify-center">
          <div className="bg-white flex flex-col" style={{ width:1163, minHeight:866, borderRadius:'7.55px', border:'0.94px solid rgba(198,198,205,1)', boxShadow:'0 0.94px 1.89px rgba(0,0,0,0.05)', padding:28, flexShrink:0 }}>
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{activeWing === 'left' ? 'Left' : 'Right'} Wing Floorplan</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {activeWing === 'left' ? 'PC 1-14 | Desks 01-28 | Cubicle 01-18 | Collab Study Room 1-4' : 'PC 15-28 | Desks 29-56 | Cubicle 19-36 | Collab Study Room 5-6'}
              </p>
            </div>
            {activeWing === 'right'
              ? <RightWingMap deskMap={deskMap} onDeskClick={handleDeskClick} />
              : <LeftWingMap deskMap={deskMap} onDeskClick={handleDeskClick} />
            }
          </div>
        </main>
      </div>

      {modalDesk && (
        <DeskModal desk={modalDesk} onClose={() => setModalDesk(null)} onCheckin={handleCheckin} checkinLoading={checkinLoading} />
      )}
    </div>
  )
}