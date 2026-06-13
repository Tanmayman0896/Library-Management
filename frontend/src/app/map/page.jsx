'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { logout, getDesks, checkin } from '@/lib/api'

const A = 'available', O = 'occupied', W = 'away'

const DESK_STYLE = {
  available: { background: 'rgba(240,253,244,1)', border: '0.74px solid rgba(134,239,172,1)', color: '#166534' },
  occupied:  { background: 'rgba(254,242,242,1)', border: '0.74px solid rgba(254,202,202,1)', color: '#991b1b' },
  away:      { background: 'rgba(254,252,232,1)', border: '0.74px solid rgba(253,224,71,1)',  color: '#854d0e' },
}

function DeskModal({ desk, onClose, onCheckin, checkinLoading }) {
  const isAway = desk.status === 'away'
  const isOccupied = desk.status === 'occupied'
  const isFree = desk.status === 'available'

  const bg = isFree ? '#fafaf8' : isAway ? '#1a1a1a' : '#1a1a1a'
  const qr = isFree ? '/black qr.svg' : isAway ? '/yellow qr.svg' : '/red qr.svg'
  const qrBg = isFree ? 'rgba(245,243,235,1)' : isAway ? 'rgba(255,248,230,1)' : 'rgba(255,235,235,1)'
  const tagColor = isFree ? '#2563eb' : isAway ? '#d97706' : '#dc2626'
  const labelColor = isFree ? '#111827' : isAway ? '#f59e0b' : '#ef4444'
  const textColor = isFree ? '#111827' : '#ffffff'
  const subTextColor = isFree ? '#6b7280' : 'rgba(255,255,255,0.6)'
  const borderColor = isFree ? '#e5e7eb' : 'rgba(255,255,255,0.12)'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative rounded-2xl shadow-2xl flex flex-col items-center"
        style={{ width: 280, background: bg, padding: '28px 24px 24px', border: `1px solid ${borderColor}` }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full"
          style={{ background: isFree ? '#f3f4f6' : 'rgba(255,255,255,0.1)', color: isFree ? '#6b7280' : 'rgba(255,255,255,0.5)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>

        <div className="rounded-xl flex items-center justify-center mb-4" style={{ width: 72, height: 72, background: qrBg }}>
          <Image src={qr} alt="QR" width={40} height={40} />
        </div>

        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: tagColor }}>
          {isFree ? 'Ready for Check-In' : isAway ? 'Already Occupied · Away' : 'Already Occupied'}
        </p>

        <h2 className="text-[26px] font-bold mb-4" style={{ color: labelColor, letterSpacing: '-0.5px' }}>
          Desk {desk.label}
        </h2>

        {isFree && (
          <div className="w-full rounded-xl px-4 py-3 mb-5" style={{ background: 'rgba(249,250,251,1)', border: '1px solid #e5e7eb' }}>
            <div className="flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0"><circle cx="8" cy="8" r="7" stroke="#9ca3af" strokeWidth="1.2"/><path d="M8 7v4" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="5" r="0.7" fill="#9ca3af"/></svg>
              <p className="text-[11px] leading-relaxed" style={{ color: '#6b7280' }}>
                By checking in, you agree to the 2-hour activity prompts. Please ensure you clear your belongings if leaving for more than 30 minutes.
              </p>
            </div>
          </div>
        )}

        {isFree ? (
          <button
            onClick={() => onCheckin(desk.label)}
            disabled={checkinLoading}
            className="w-full rounded-xl py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: '#111827' }}
          >
            Check-in Now →
          </button>
        ) : (
          <button
            className="w-full rounded-xl py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: '#111827' }}
          >
            Notify When Vacated →
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full rounded-xl py-3.5 text-sm font-semibold mt-2.5 flex items-center justify-center gap-2"
          style={{ background: isFree ? 'white' : 'rgba(255,255,255,0.08)', color: isFree ? '#374151' : 'rgba(255,255,255,0.7)', border: `1px solid ${isFree ? '#e5e7eb' : 'rgba(255,255,255,0.1)'}` }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Go to Map
        </button>
      </div>
    </div>
  )
}

function DeskCell({ label, status = 'occupied', onClick }) {
  const s = DESK_STYLE[status] || DESK_STYLE.occupied
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center cursor-pointer select-none hover:opacity-75 transition-opacity text-[9px] font-semibold"
      style={{ width: 59.71, height: 59.71, borderRadius: '2.94px', border: s.border, background: s.background, color: s.color, flexShrink: 0 }}
    >
      {label}
    </div>
  )
}
function CubicleCell({ label, status = 'occupied', onClick }) {
  const s = DESK_STYLE[status] || DESK_STYLE.occupied
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center cursor-pointer select-none hover:opacity-75 transition-opacity text-[8px] font-semibold"
      style={{ width: 62, height: 145, borderRadius: '2.94px', border: s.border, background: s.background, color: s.color, writingMode: 'vertical-rl', transform: 'rotate(180deg)', flexShrink: 0 }}
    >
      {label}
    </div>
  )
}
function DeskDivider({ label }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{ width: 50, height: 442, borderRadius: '7.55px', border: '0.94px dashed rgba(198,198,205,1)', background: 'rgba(248,250,252,1)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', overflow: 'hidden', flexShrink: 5 }}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  )
}
const STUDY_STYLE = {
  available: { background: 'rgba(240,253,244,1)', border: '0.94px solid rgba(134,239,172,1)', color: '#166534' },
  occupied:  { background: 'rgba(254,242,242,1)', border: '0.94px solid rgba(254,202,202,1)', color: '#991b1b' },
  away:      { background: 'rgba(254,252,232,1)', border: '0.94px solid rgba(253,224,71,1)',  color: '#854d0e' },
}
function StudyDeskBtn({ label, status, onClick }) {
  const s = STUDY_STYLE[status] || STUDY_STYLE.occupied
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center cursor-pointer select-none hover:opacity-80 transition-opacity text-[11px] font-semibold"
      style={{ width: 162, height: 42, borderRadius: '3.78px', border: s.border, background: s.background, color: s.color, flexShrink: 0 }}
    >
      {label}
    </div>
  )
}

function apiStatusToLocal(apiStatus) {
  if (apiStatus === 'FREE') return 'available'
  if (apiStatus === 'AWAY') return 'away'
  return 'occupied'
}

function LeftWingMap({ deskMap, onDeskClick }) {
  function ds(label) { return deskMap[label] || 'occupied' }
  function cell(label) { return { label, status: ds(label), onClick: () => onDeskClick(label, ds(label)) } }

  const pc1 = ['LW-01','LW-02','LW-03','LW-04','LW-05','LW-06'].map(cell)
  const pc2 = ['LW-07','LW-08','LW-09','LW-10','LW-11','LW-12'].map(cell)
  const desk1 = ['LW-13','LW-14','LW-15','LW-16','LW-17','LW-18','LW-19'].map(cell)
  const desk2 = ['LW-20','LW-21','LW-22','LW-23','LW-24','LW-25','LW-26'].map(cell)
  const desk3 = ['LW-27','LW-28','LW-29','LW-30'].map(cell)

  const cub1 = ['LC-01','LC-02','LC-03','LC-04'].map(label => ({ label, status: ds(label), onClick: () => onDeskClick(label, ds(label)) }))
  const cub2 = ['LC-05','LC-06','LC-07','LC-08'].map(label => ({ label, status: ds(label), onClick: () => onDeskClick(label, ds(label)) }))

  const study = ['LS-01','LS-02','LS-03','LS-04','LS-05','LS-06','LS-07','LS-08','LS-09','LS-10','LS-11','LS-12']

  function Col({ cells }) {
    return <div className="flex flex-col gap-1">{cells.map((c,i) => <DeskCell key={i} {...c} />)}</div>
  }
  function CubRow({ cells }) {
    return <div className="flex gap-1">{cells.map((c,i) => <CubicleCell key={i} {...c} />)}</div>
  }

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
        <div className="flex flex-col gap-1 ml-1">
          <CubRow cells={cub1} />
          <CubRow cells={cub2} />
        </div>
        <div className="flex flex-col gap-3 ml-3">
          {[
            { title: 'Collab Study Room 4', labels: study.slice(9, 12) },
            { title: 'Collab Study Room 3', labels: study.slice(6, 9) },
          ].map((room, ri) => (
            <div key={ri} className="flex flex-col items-center flex-shrink-0" style={{ width: 200, height: 210, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', paddingTop: '20px', paddingBottom: '24px', paddingLeft: '19px', paddingRight: '19px', gap: 12, boxSizing: 'border-box' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 w-full">{room.title}</p>
              <div className="flex flex-col" style={{ gap: 12 }}>
                {room.labels.map((l, i) => <StudyDeskBtn key={i} label={l} status={ds(l)} onClick={() => onDeskClick(l, ds(l))} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3 items-stretch mt-1">
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 70, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', background: 'rgba(248,250,252,1)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', boxSizing: 'border-box' }}>
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Reception</span>
        </div>
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 580, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', background: 'rgba(248,250,252,1)', boxSizing: 'border-box' }}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Bookshelves</span>
        </div>
        {[
          { title: 'Collab Study Room 1', labels: study.slice(0, 3) },
          { title: 'Collab Study Room 2', labels: study.slice(3, 6) },
        ].map((room, ri) => (
          <div key={ri} className="flex flex-col items-center flex-shrink-0" style={{ width: 200, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', paddingTop: '20px', paddingBottom: '21px', paddingLeft: '19px', paddingRight: '19px', gap: 12, boxSizing: 'border-box' }}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 w-full">{room.title}</p>
            <div className="flex flex-col" style={{ gap: 12 }}>
              {room.labels.map((l, i) => <StudyDeskBtn key={i} label={l} status={ds(l)} onClick={() => onDeskClick(l, ds(l))} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RightWingMap({ deskMap, onDeskClick }) {
  function ds(label) { return deskMap[label] || 'occupied' }
  function cell(label) { return { label, status: ds(label), onClick: () => onDeskClick(label, ds(label)) } }

  const pcGroup1 = ['RW-01','RW-02','RW-03','RW-04','RW-05','RW-06'].map(cell)
  const pcGroup2 = ['RW-07','RW-08','RW-09','RW-10','RW-11','RW-12'].map(cell)
  const deskCol1 = ['RW-13','RW-14','RW-15','RW-16','RW-17','RW-18','RW-19'].map(cell)
  const deskCol2 = ['RW-20','RW-21','RW-22','RW-23','RW-24','RW-25','RW-26'].map(cell)
  const deskCol3 = ['RW-27','RW-28','RW-29','RW-30'].map(cell)

  const cubRow1 = ['RC-01','RC-02','RC-03','RC-04'].map(label => ({ label, status: ds(label), onClick: () => onDeskClick(label, ds(label)) }))
  const cubRow2 = ['RC-05','RC-06','RC-07','RC-08'].map(label => ({ label, status: ds(label), onClick: () => onDeskClick(label, ds(label)) }))

  const study = ['RS-01','RS-02','RS-03','RS-04','RS-05','RS-06','RS-07','RS-08','RS-09','RS-10','RS-11','RS-12']

  function PcCol({ cells }) {
    return <div className="flex flex-col gap-1">{cells.map((c, i) => <DeskCell key={i} {...c} />)}</div>
  }
  function CubRow({ cells }) {
    return <div className="flex gap-1">{cells.map((c, i) => <CubicleCell key={i} {...c} />)}</div>
  }

  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="flex gap-2 mb-2">
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 70, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', background: 'rgba(248,250,252,1)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', boxSizing: 'border-box' }}>
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Reception</span>
        </div>
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 1002, height: 230, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', background: 'rgba(248,250,252,1)', boxSizing: 'border-box' }}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Bookshelves</span>
        </div>
      </div>
      <div className="flex gap-2 items-start">
        <PcCol cells={pcGroup1} />
        <PcCol cells={pcGroup2} />
        <PcCol cells={deskCol1} />
        <DeskDivider label="DESK" />
        <PcCol cells={deskCol2} />
        <PcCol cells={deskCol3} />
        <DeskDivider label="DESK" />
        <div className="flex flex-col gap-1 ml-1">
          <CubRow cells={cubRow1} />
          <CubRow cells={cubRow2} />
        </div>
        <div className="flex flex-col gap-3 ml-4 flex-shrink-0">
          {[
            { title: 'Collab Study Room 5', labels: study.slice(0, 3) },
            { title: 'Collab Study Room 6', labels: study.slice(3, 6) },
          ].map((room, ri) => (
            <div key={ri} className="flex flex-col items-center flex-shrink-0" style={{ width: 200, height: 215, borderRadius: '7.55px', border: '0.94px dashed rgba(203,213,225,1)', paddingTop: '20px', paddingBottom: '21px', paddingLeft: '19px', paddingRight: '19px', gap: 12, boxSizing: 'border-box' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 w-full">{room.title}</p>
              <div className="flex flex-col" style={{ gap: 12 }}>
                {room.labels.map((l, i) => <StudyDeskBtn key={i} label={l} status={ds(l)} onClick={() => onDeskClick(l, ds(l))} />)}
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

  function handleDeskClick(label, status) {
    setModalDesk({ label, status })
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
              <p className="text-[11px] text-gray-400 mt-0.5">Click any desk to check in or view status</p>
            </div>
            {activeWing === 'right'
              ? <RightWingMap deskMap={deskMap} onDeskClick={handleDeskClick} />
              : <LeftWingMap deskMap={deskMap} onDeskClick={handleDeskClick} />
            }
          </div>
        </main>
      </div>

      {modalDesk && (
        <DeskModal
          desk={modalDesk}
          onClose={() => setModalDesk(null)}
          onCheckin={handleCheckin}
          checkinLoading={checkinLoading}
        />
      )}
    </div>
  )
}