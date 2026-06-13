'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const A = 'available', O = 'occupied', W = 'away'

const DESK_CLS = {
  available: 'bg-green-100 border border-green-300 text-green-800',
  occupied:  'bg-red-100 border border-red-300 text-red-700',
  away:      'bg-yellow-100 border border-yellow-300 text-yellow-700',
}
const STUDY_CLS = {
  available: 'bg-green-100 border border-green-200 text-green-800',
  occupied:  'bg-red-100 border border-red-200 text-red-700',
  away:      'bg-yellow-100 border border-yellow-200 text-yellow-700',
}

// ── Cell helpers ─────────────────────────────────────────────────────────────
function DeskCell({ label, status = O, tall = false }) {
  return (
    <div className={`flex items-center justify-center rounded text-[9px] font-semibold cursor-pointer select-none hover:opacity-75 transition-opacity ${tall ? 'w-10 h-14' : 'w-10 h-10'} ${DESK_CLS[status]}`}>
      {label}
    </div>
  )
}
function CubicleCell({ label, status = O }) {
  return (
    <div
      className={`flex items-center justify-center rounded text-[8px] font-semibold cursor-pointer select-none hover:opacity-75 transition-opacity ${DESK_CLS[status]}`}
      style={{ width: 36, height: 80, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
    >
      {label}
    </div>
  )
}
function DeskDivider({ label }) {
  return (
    <div
      className="bg-gray-100 border border-gray-200 rounded flex items-center justify-center flex-shrink-0"
      style={{ width: 16, height: 260, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
    >
      <span className="text-[7px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  )
}
function StudyDeskBtn({ label, status }) {
  return (
    <div className={`text-[11px] font-semibold px-4 py-2.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity text-center ${STUDY_CLS[status]}`}>
      {label}
    </div>
  )
}

// ── Left Wing layout ──────────────────────────────────────────────────────────
function LeftWingMap() {
  // PC columns (7 rows each)
  const pc1 = [
    {l:'PC 1',s:A},{l:'PC 2',s:A},{l:'PC 3',s:A},
    {l:'PC 4',s:W},{l:'PC 5',s:A},{l:'PC 6',s:A},{l:'PC 7',s:A},
  ]
  const pc2 = [
    {l:'PC 8',s:A},{l:'PC 9',s:A},{l:'PC 10',s:A},
    {l:'PC 11',s:A},{l:'PC 12',s:A},{l:'PC 13',s:A},{l:'PC 14',s:A},
  ]
  const desk1 = [
    {l:'01',s:A},{l:'02',s:O},{l:'03',s:O},
    {l:'04',s:O},{l:'05',s:O},{l:'06',s:O},{l:'07',s:O},
  ]
  const desk2 = [
    {l:'08',s:O},{l:'09',s:O},{l:'10',s:O},
    {l:'11',s:O},{l:'12',s:O},{l:'13',s:O},{l:'14',s:O},
  ]
  const desk3 = [
    {l:'15',s:W},{l:'16',s:O},{l:'17',s:O},
    {l:'18',s:O},{l:'19',s:O},{l:'20',s:O},{l:'21',s:O},
  ]
  const desk4 = [
    {l:'22',s:O},{l:'23',s:O},{l:'24',s:O},
    {l:'25',s:O},{l:'26',s:O},{l:'27',s:W},{l:'28',s:O},
  ]

  // Cubicle rows: 3 rows × 6 vertical cells
  const cub1 = [{l:'Cubicle 01',s:O},{l:'Cubicle 04',s:O},{l:'Cubicle 07',s:O},{l:'Cubicle 10',s:O},{l:'Cubicle 13',s:A},{l:'Cubicle 16',s:A}]
  const cub2 = [{l:'Cubicle 02',s:O},{l:'Cubicle 05',s:O},{l:'Cubicle 08',s:W},{l:'Cubicle 11',s:W},{l:'Cubicle 14',s:A},{l:'Cubicle 17',s:A}]
  const cub3 = [{l:'Cubicle 03',s:O},{l:'Cubicle 06',s:O},{l:'Cubicle 09',s:O},{l:'Cubicle 12',s:A},{l:'Cubicle 15',s:A},{l:'Cubicle 18',s:A}]

  function Col({ cells }) {
    return (
      <div className="flex flex-col gap-1">
        {cells.map((c,i) => <DeskCell key={i} label={c.l} status={c.s} />)}
      </div>
    )
  }
  function CubRow({ cells }) {
    return (
      <div className="flex gap-1">
        {cells.map((c,i) => <CubicleCell key={i} label={c.l} status={c.s} />)}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── Top section: PC cols + desk cols + cubicles + right collab rooms ── */}
      <div className="flex gap-1.5 items-start">
        {/* PC 1 & 2 */}
        <Col cells={pc1} />
        <Col cells={pc2} />

        {/* Desk group 1 */}
        <Col cells={desk1} />

        <DeskDivider label="DESK" />

        {/* Desk group 2 & 3 */}
        <Col cells={desk2} />
        <Col cells={desk3} />

        <DeskDivider label="DESK" />

        {/* Desk group 4 */}
        <Col cells={desk4} />

        {/* Cubicle rows */}
        <div className="flex flex-col gap-1 ml-1">
          <CubRow cells={cub1} />
          <CubRow cells={cub2} />
          <CubRow cells={cub3} />
        </div>

        {/* Right collab rooms: 4 (top) and 3 (below) */}
        <div className="flex flex-col gap-4 ml-3 flex-shrink-0 w-[140px]">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Collab Study Room 4</p>
            <div className="flex flex-col gap-1.5">
              <StudyDeskBtn label="Study Desk 1" status={O} />
              <StudyDeskBtn label="Study Desk 2" status={O} />
              <StudyDeskBtn label="Study Desk 3" status={A} />
            </div>
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Collab Study Room 3</p>
            <div className="flex flex-col gap-1.5">
              <StudyDeskBtn label="Study Desk 1" status={A} />
              <StudyDeskBtn label="Study Desk 2" status={A} />
              <StudyDeskBtn label="Study Desk 3" status={A} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom section: Reception + Bookshelves + Collab Rooms 1 & 2 ── */}
      <div className="flex gap-3 items-stretch mt-1">
        {/* Reception */}
        <div
          className="border border-dashed border-gray-300 rounded flex items-center justify-center flex-shrink-0"
          style={{ width: 56, height: 140, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Reception</span>
        </div>

        {/* Bookshelves */}
        <div className="flex-1 border border-dashed border-gray-300 rounded flex items-center justify-center" style={{ height: 140 }}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Bookshelves</span>
        </div>

        {/* Collab Study Room 1 */}
        <div className="flex-shrink-0 w-[140px]">
          <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Collab Study Room 1</p>
          <div className="flex flex-col gap-1.5">
            <StudyDeskBtn label="Study Desk 1" status={O} />
            <StudyDeskBtn label="Study Desk 2" status={A} />
            <StudyDeskBtn label="Study Desk 3" status={A} />
          </div>
        </div>

        {/* Collab Study Room 2 */}
        <div className="flex-shrink-0 w-[140px]">
          <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Collab Study Room 2</p>
          <div className="flex flex-col gap-1.5">
            <StudyDeskBtn label="Study Desk 1" status={O} />
            <StudyDeskBtn label="Study Desk 2" status={O} />
            <StudyDeskBtn label="Study Desk 3" status={A} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Right Wing layout — matches screenshot exactly ────────────────────────────
function RightWingMap() {
  // PC columns: 3 groups × 7 rows
  const pcGroup1 = [
    { label: 'PC 15', s: A },{ label: 'PC 16', s: A },{ label: 'PC 17', s: A },
    { label: 'PC 18', s: A },{ label: 'PC 19', s: A },{ label: 'PC 20', s: A },{ label: 'PC 21', s: A },
  ]
  const pcGroup2 = [
    { label: 'PC 22', s: A },{ label: 'PC 23', s: O },{ label: 'PC 24', s: A },
    { label: 'PC 25', s: O },{ label: 'PC 26', s: A },{ label: 'PC 27', s: A },{ label: 'PC 28', s: O },
  ]
  const deskCol1 = [
    { label: 'PC 3', s: O },{ label: '02', s: O },{ label: '03', s: O },
    { label: '04', s: O },{ label: 'PC 3', s: O },{ label: '06', s: O },{ label: '07', s: O },
  ]
  const deskCol2 = [
    { label: '09', s: O },{ label: '09', s: O },{ label: 'PC 10', s: A },
    { label: '11', s: O },{ label: '12', s: O },{ label: '13', s: O },{ label: '14', s: O },
  ]
  const deskCol3 = [
    { label: '16', s: O },{ label: '16', s: O },{ label: '03', s: O },
    { label: '18', s: O },{ label: '19', s: O },{ label: '20', s: O },{ label: '21', s: O },
  ]
  const deskCol4 = [
    { label: '22', s: O },{ label: '23', s: O },{ label: '24', s: O },
    { label: '23', s: O },{ label: '24', s: O },{ label: '24', s: O },{ label: '28', s: O },
  ]

  // Cubicle rows — each column is one vertical cell
  const cubRow1 = [
    { label: 'Cubicle 01', s: O },{ label: 'Cubicle 04', s: O },
    { label: 'Cubicle 08', s: W },{ label: 'Cubicle 11', s: W },
    { label: 'Cubicle 13', s: O },{ label: 'Cubicle 16', s: O },
  ]
  const cubRow2 = [
    { label: 'Cubicle 09', s: O },{ label: 'Cubicle 09', s: O },
    { label: 'Cubicle 09', s: O },{ label: 'Cubicle 09', s: O },
    { label: 'Cubicle 14', s: O },{ label: 'Cubicle 17', s: O },
  ]
  const cubRow3 = [
    { label: 'Cubicle 09', s: O },{ label: 'Cubicle 09', s: O },
    { label: 'Cubicle 09', s: O },{ label: 'Cubicle 12', s: O },
    { label: 'Cubicle 15', s: O },{ label: 'Cubicle 18', s: O },
  ]

  function PcCol({ cells }) {
    return (
      <div className="flex flex-col gap-1">
        {cells.map((c, i) => <DeskCell key={i} label={c.label} status={c.s} />)}
      </div>
    )
  }
  function CubRow({ cells }) {
    return (
      <div className="flex gap-1">
        {cells.map((c, i) => <CubicleCell key={i} label={c.label} status={c.s} />)}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 mt-2">
      {/* Reception + Bookshelves */}
      <div className="flex gap-2 mb-2">
        <div
          className="border border-dashed border-gray-300 rounded flex items-center justify-center flex-shrink-0"
          style={{ width: 64, height: 90, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Reception</span>
        </div>
        <div className="border border-dashed border-gray-300 rounded flex items-center justify-center flex-1" style={{ height: 90 }}>
          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Bookshelves</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="flex gap-2 items-start">
        {/* PC groups */}
        <PcCol cells={pcGroup1} />
        <PcCol cells={pcGroup2} />
        <PcCol cells={deskCol1} />

        <DeskDivider label="DESK" />

        <PcCol cells={deskCol2} />
        <PcCol cells={deskCol3} />

        <DeskDivider label="DESK" />

        <PcCol cells={deskCol4} />

        {/* Cubicles */}
        <div className="flex flex-col gap-1 ml-1">
          <CubRow cells={cubRow1} />
          <CubRow cells={cubRow2} />
          <CubRow cells={cubRow3} />
        </div>

        {/* Collab Study Rooms 5 & 6 */}
        <div className="flex flex-col gap-5 ml-4 flex-shrink-0 w-[140px]">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-2">Collab Study Room 5</p>
            <div className="flex flex-col gap-1.5">
              <StudyDeskBtn label="Study Desk 1" status={O} />
              <StudyDeskBtn label="Study Desk 2" status={O} />
              <StudyDeskBtn label="Study Desk 3" status={O} />
            </div>
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-2">Collab Study Room 6</p>
            <div className="flex flex-col gap-1.5">
              <StudyDeskBtn label="Study Desk 1" status={O} />
              <StudyDeskBtn label="Study Desk 2" status={A} />
              <StudyDeskBtn label="Study Desk 3" status={A} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const WING_META = {
  left:  { name: 'Left Wing',  subtitle: 'PC 1-14 | Desks 01-28 | Cubicle 01-18 | Collab Study Room 1-4', occupancy: 55, availableDesks: 30, avgWaitTime: '2m' },
  right: { name: 'Right Wing', subtitle: 'PC 15-28 | Desks 29-56 | Cubicle 19-36 | Collab Study Room 5-6', occupancy: 85, availableDesks: 12, avgWaitTime: '15m' },
}

export default function MapPage() {
  const router = useRouter()
  const [activeWing, setActiveWing] = useState('left')
  const [activeTab, setActiveTab]   = useState('map')

  useEffect(() => {
    if (!sessionStorage.getItem('deskguard_session')) {
      router.replace('/login')
    }
  }, [router])

  const meta = WING_META[activeWing]
  const pctColor = meta.occupancy >= 80 ? 'text-red-500' : meta.occupancy >= 60 ? 'text-orange-500' : 'text-green-600'

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">

      {/* Nav */}
      <nav className="flex items-center bg-white border-b border-gray-200 px-5 h-14 gap-4 flex-shrink-0">
        <Image src="/full-logo.svg" alt="DeskGuard" width={34} height={26} priority />
        <div className="flex items-center gap-0.5">
          {['map','dashboard'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-sm mx-auto">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search floors, zones, or desk IDs..."
              className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-1.5 text-xs text-gray-600 placeholder-gray-400 outline-none focus:ring-1 focus:ring-gray-300" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => { sessionStorage.removeItem('deskguard_session'); router.push('/login') }}
            className="flex items-center gap-1.5 text-xs font-medium border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
          <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 border border-gray-200">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-4 flex flex-col gap-4">
            <div>
              <p className="text-[11px] font-bold text-gray-800">Main Library</p>
              <div className="flex gap-1 flex-wrap mt-1.5">
                <span className="bg-gray-800 text-white text-[9px] px-2 py-0.5 rounded-full font-medium">Dome Building</span>
                <span className="bg-gray-100 text-gray-500 text-[9px] px-2 py-0.5 rounded-full font-medium">Ground Floor</span>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Current Occupancy</p>
              <p className={`text-3xl font-extrabold leading-none ${pctColor}`}>
                {meta.occupancy}% <span className="text-sm font-semibold text-gray-500">Full</span>
              </p>
              <div className="flex gap-2 mt-3">
                <div className="flex-1 bg-gray-50 rounded-lg p-2 border border-gray-100">
                  <p className="text-[9px] text-gray-400 leading-tight">Available Desks</p>
                  <p className="text-lg font-extrabold text-black leading-tight mt-0.5">{meta.availableDesks}</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-2 border border-gray-100">
                  <p className="text-[9px] text-gray-400 leading-tight">Avg. Wait Time</p>
                  <p className="text-lg font-extrabold text-black leading-tight mt-0.5">{meta.avgWaitTime}</p>
                </div>
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Legend</p>
              <div className="flex flex-col gap-2">
                {[['bg-green-300','Available'],['bg-red-300','Occupied'],['bg-yellow-300','Away']].map(([cls,lbl])=>(
                  <div key={lbl} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm ${cls} flex-shrink-0`} />
                    <span className="text-[11px] text-gray-600">{lbl}</span>
                    {lbl === 'Away' && <span className="ml-auto text-[8px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full border border-gray-200">Ding-Ding</span>}
                  </div>
                ))}
              </div>
            </div>
            <hr className="border-gray-100" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Quick Navigation</p>
              <div className="flex flex-col gap-1">
                {[{key:'right',label:'Right Wing'},{key:'left',label:'Left Wing'}].map(({key,label})=>(
                  <button key={key} onClick={() => setActiveWing(key)}
                    className={`flex items-center justify-between text-[11px] font-medium px-2.5 py-2 rounded-md transition-colors ${activeWing===key?'bg-gray-900 text-white':'hover:bg-gray-100 text-gray-700'}`}>
                    {label}
                    {activeWing===key
                      ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6 flex items-start justify-center">
          <div className="bg-white flex flex-col" style={{ width:1163, minHeight:866, borderRadius:'7.55px', border:'0.94px solid rgba(198,198,205,1)', boxShadow:'0 0.94px 1.89px rgba(0,0,0,0.05)', padding:28, flexShrink:0 }}>
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{meta.name} Floorplan</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">{meta.subtitle}</p>
            </div>
            {activeWing === 'right' ? <RightWingMap /> : <LeftWingMap />}
          </div>
        </main>
      </div>
    </div>
  )
}

