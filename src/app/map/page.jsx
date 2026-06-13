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
  const leftPCs = [
    [A,O,A,O,A,O,A],
    [O,A,O,A,O,A,O],
    [A,O,O,O,O,O,O],
  ]
  const desks1 = [
    [O,O,O,O,O,O,O],
    [O,A,O,O,O,O,O],
  ]
  const desks2 = [
    [O,O,O,O,O,O,O],
    [W,O,O,O,O,O,O],
  ]
  const cubRows = [
    [O,O,W,W,O,O],
    [O,O,O,O,O,O],
    [O,O,O,O,O,O],
  ]
  const cubLabels = ['Cubicle 01','Cubicle 04','Cubicle 08','Cubicle 11','Cubicle 13','Cubicle 16']
  const cubLabels2 = ['Cubicle 09','Cubicle 09','Cubicle 09','Cubicle 09','Cubicle 14','Cubicle 17']
  const cubLabels3 = ['Cubicle 09','Cubicle 09','Cubicle 09','Cubicle 12','Cubicle 15','Cubicle 18']

  return (
    <div className="flex gap-3 items-start mt-4">
      {/* PC columns 1-3 */}
      {leftPCs.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((s, ri) => (
            <DeskCell key={ri} label={`PC ${ci === 0 ? 15+ri : ci === 1 ? 22+ri : ri+1}`} status={s} />
          ))}
        </div>
      ))}

      <DeskDivider label="DESK" />

      {/* Desk columns */}
      {desks1.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((s, ri) => <DeskCell key={ri} label={`${9+ri}`} status={s} />)}
        </div>
      ))}

      <DeskDivider label="DESK" />

      {/* More desk columns */}
      {desks2.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map((s, ri) => <DeskCell key={ri} label={`${22+ri}`} status={s} />)}
        </div>
      ))}

      {/* Cubicle rows stacked */}
      <div className="flex flex-col gap-2 ml-1">
        <div className="flex gap-1">
          {cubLabels.map((l,i) => <CubicleCell key={i} label={l} status={cubRows[0][i]} />)}
        </div>
        <div className="flex gap-1">
          {cubLabels2.map((l,i) => <CubicleCell key={i} label={l} status={cubRows[1][i]} />)}
        </div>
        <div className="flex gap-1">
          {cubLabels3.map((l,i) => <CubicleCell key={i} label={l} status={cubRows[2][i]} />)}
        </div>
      </div>

      {/* Collab rooms */}
      <div className="flex flex-col gap-5 ml-4 flex-shrink-0 w-[130px]">
        {[
          { title: 'COLLAB STUDY ROOM 1', desks: [A,O,A] },
          { title: 'COLLAB STUDY ROOM 2', desks: [A,O,A] },
        ].map(room => (
          <div key={room.title}>
            <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">{room.title}</p>
            <div className="flex flex-col gap-1">
              {room.desks.map((s,i) => <StudyDeskBtn key={i} label={`Study Desk ${i+1}`} status={s} />)}
            </div>
          </div>
        ))}
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
  left:  { name: 'Left Wing',  subtitle: 'PC 1-14 | Desks 15-28 | Cubicle 01-18 | Collab Study Room 1-4', occupancy: 55, availableDesks: 30, avgWaitTime: '2m' },
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

  left: {
    name: 'Left Wing',
    subtitle: 'PC 1-11 | Desks 12-38 | Cubicle 39-50 | Collab Study Rooms 1-4',
    occupancy: 55,
    availableDesks: 30,
    avgWaitTime: '2m',
    rows: [
      { label: 'PC-1', desks: [O,O,O,A,O,W,O,A,O,O] },
      { label: 'PC-2', desks: [O,A,O,A,O,O,W,O,O,A] },
      { label: 'PC-3', desks: [A,O,O,A,O,A,O,O,A,O] },
      { label: 'PC-4', desks: [O,O,A,O,O,A,W,O,A,O] },
      { label: 'PC-5', desks: [O,A,O,O,A,O,O,W,O,A] },
      { label: 'PC-6', desks: [A,O,O,A,O,O,A,O,O,A] },
      { label: 'PC-7', desks: [O,O,A,O,W,O,A,O] },
    ],
    collabRight: [
      { title: 'COLLAB STUDY ROOM 1', desks: [{ label: 'Study Desk 1', status: A }, { label: 'Study Desk 2', status: O }, { label: 'Study Desk 3', status: A }] },
      { title: 'COLLAB STUDY ROOM 2', desks: [{ label: 'Study Desk 1', status: A }, { label: 'Study Desk 2', status: O }, { label: 'Study Desk 3', status: A }] },
    ],
    collabBottom: [
      { title: 'COLLAB STUDY ROOM 3', desks: [{ label: 'Study Desk 1', status: A }, { label: 'Study Desk 2', status: O }, { label: 'Study Desk 3', status: A }] },
      { title: 'COLLAB STUDY ROOM 4', desks: [{ label: 'Study Desk 1', status: A }, { label: 'Study Desk 2', status: A }, { label: 'Study Desk 3', status: O }] },
    ],
  },
  right: {
    name: 'Right Wing',
    subtitle: 'PC 12-56 | Desks 26-58 | Cubicle 59-66 | Collab Study Floors 4-6',
    occupancy: 85,
    availableDesks: 12,
    avgWaitTime: '15m',
    rows: [
      { label: 'PC-1', desks: [O,O,O,O,O,W,O,O,O,A] },
      { label: 'PC-2', desks: [O,O,O,A,O,O,O,O,O,O] },
      { label: 'PC-3', desks: [O,O,O,O,O,O,O,O,A,O] },
      { label: 'PC-4', desks: [O,O,O,O,O,A,O,O,O,O] },
      { label: 'PC-5', desks: [O,O,O,O,A,O,O,W,O,O] },
      { label: 'PC-6', desks: [O,O,O,A,O,O,O,O,O,O] },
      { label: 'PC-7', desks: [O,O,A,O,W,O,O,O] },
    ],
    collabRight: [
      { title: 'COLLAB STUDY ROOM 1', desks: [{ label: 'Study Desk 1', status: O }, { label: 'Study Desk 2', status: O }, { label: 'Study Desk 3', status: A }] },
      { title: 'COLLAB STUDY ROOM 2', desks: [{ label: 'Study Desk 1', status: O }, { label: 'Study Desk 2', status: O }, { label: 'Study Desk 3', status: O }] },
    ],
    collabBottom: [
      { title: 'COLLAB STUDY ROOM 3', desks: [{ label: 'Study Desk 1', status: O }, { label: 'Study Desk 2', status: O }, { label: 'Study Desk 3', status: A }] },
      { title: 'COLLAB STUDY ROOM 4', desks: [{ label: 'Study Desk 1', status: O }, { label: 'Study Desk 2', status: A }, { label: 'Study Desk 3', status: O }] },
    ],
  },
}

// Zone label spans (which row indices each zone covers)
const ZONE_SPANS = [
  { label: 'Study Zone 1', rows: 2 },
  { label: 'Study Zone 2', rows: 2 },
  { label: 'Study Zone 3', rows: 2 },
  { label: 'Study Zone 4', rows: 1 },
]

const DESK_CLS = {
  available: 'bg-green-100 border-green-300 text-green-800',
  occupied:  'bg-red-100   border-red-300   text-red-700',
  away:      'bg-yellow-100 border-yellow-300 text-yellow-700',
}
const STUDY_CLS = {
  available: 'bg-green-100 border-green-200 text-green-800',
  occupied:  'bg-red-100   border-red-200   text-red-700',
  away:      'bg-yellow-100 border-yellow-200 text-yellow-700',
}

export default function MapPage() {
  const router = useRouter()
  const [activeWing, setActiveWing] = useState('left')
  const [activeTab, setActiveTab]   = useState('map')

  // Guard: redirect to login if no session
  useEffect(() => {
    if (!sessionStorage.getItem('deskguard_session')) {
      router.replace('/login')
    }
  }, [router])

  const wing = WING_DATA[activeWing]

  // Assign sequential desk IDs per wing
  let counter = 1
  const rows = wing.rows.map(r => ({
    ...r,
    desks: r.desks.map(status => ({ id: counter++, status })),
  }))

  const pctColor =
    wing.occupancy >= 80 ? 'text-red-500' :
    wing.occupancy >= 60 ? 'text-orange-500' :
    'text-green-600'

  // Zone label heights: each row cell is h-8 (32px) + gap-1 (4px) = 36px
  const ROW_H = 36

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">

      <nav className="flex items-center bg-white border-b border-gray-200 px-5 h-14 gap-4 flex-shrink-0">
        <Image src="/full-logo.svg" alt="DeskGuard" width={34} height={26} priority />

        {/* Tabs */}
        <div className="flex items-center gap-0.5">
          {['map','dashboard'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm mx-auto">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search floors, zones, or desk IDs..."
              className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-1.5 text-xs text-gray-600 placeholder-gray-400 outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => {
              sessionStorage.removeItem('deskguard_session')
              router.push('/login')
            }}
            className="flex items-center gap-1.5 text-xs font-medium border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
          <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 border border-gray-200">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-4 flex flex-col gap-4">

            {/* Library info */}
            <div>
              <p className="text-[11px] font-bold text-gray-800">Main Library</p>
              <div className="flex gap-1 flex-wrap mt-1.5">
                <span className="bg-gray-800 text-white text-[9px] px-2 py-0.5 rounded-full font-medium">Dome Building</span>
                <span className="bg-gray-100 text-gray-500 text-[9px] px-2 py-0.5 rounded-full font-medium">Ground Floor</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Occupancy */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Current Occupancy</p>
              <p className={`text-3xl font-extrabold leading-none ${pctColor}`}>
                {wing.occupancy}%{' '}
                <span className="text-sm font-semibold text-gray-500">Full</span>
              </p>
              <div className="flex gap-2 mt-3">
                <div className="flex-1 bg-gray-50 rounded-lg p-2 border border-gray-100">
                  <p className="text-[9px] text-gray-400 leading-tight">Available Desks</p>
                  <p className="text-lg font-extrabold text-black leading-tight mt-0.5">{wing.availableDesks}</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-2 border border-gray-100">
                  <p className="text-[9px] text-gray-400 leading-tight">Avg. Wait Time</p>
                  <p className="text-lg font-extrabold text-black leading-tight mt-0.5">{wing.avgWaitTime}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Legend */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Legend</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-green-300 flex-shrink-0" />
                  <span className="text-[11px] text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-red-300 flex-shrink-0" />
                  <span className="text-[11px] text-gray-600">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-yellow-300 flex-shrink-0" />
                  <span className="text-[11px] text-gray-600">Away</span>
                  <span className="ml-auto text-[8px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full border border-gray-200">Ding-Ding</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Quick Navigation */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">Quick Navigation</p>
              <div className="flex flex-col gap-1">
                {[{ key: 'right', label: 'Right Wing' }, { key: 'left', label: 'Left Wing' }].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveWing(key)}
                    className={`flex items-center justify-between text-[11px] font-medium px-2.5 py-2 rounded-md transition-colors ${
                      activeWing === key
                        ? 'bg-gray-900 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {label}
                    {activeWing === key ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-gray-50 p-6 flex items-start justify-center">
          <div
            className="bg-white flex flex-col"
            style={{
              width: '1163px',
              minHeight: '866px',
              borderRadius: '7.55px',
              border: '0.94px solid rgba(198,198,205,1)',
              boxShadow: '0 0.94px 1.89px rgba(0,0,0,0.05)',
              padding: '28px',
              flexShrink: 0,
            }}
          >

          {/* Header */}
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">{wing.name} Floorplan</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{wing.subtitle}</p>
          </div>

          {/* Grid area + right collab rooms */}
          <div className="flex gap-5 items-start">

            {/* Grid */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-start">

                {/* Row label + desks */}
                <div className="flex flex-col gap-1">
                  {rows.map(row => (
                    <div key={row.label} className="flex items-center gap-1">
                      {/* Row label */}
                      <span className="w-9 text-[9px] font-semibold text-gray-500 flex-shrink-0 text-right pr-1">
                        {row.label}
                      </span>
                      {/* Desk cells */}
                      {row.desks.map(desk => (
                        <div
                          key={desk.id}
                          title={`Desk ${desk.id} — ${desk.status}`}
                          className={`w-8 h-8 rounded border flex items-center justify-center text-[9px] font-semibold cursor-pointer hover:opacity-75 transition-opacity select-none ${DESK_CLS[desk.status]}`}
                        >
                          {desk.id}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Zone labels (vertical) */}
                <div className="flex flex-col gap-1 ml-1">
                  {ZONE_SPANS.map((zone, i) => (
                    <div
                      key={zone.label}
                      className="bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden"
                      style={{
                        width: 18,
                        height: zone.rows * ROW_H - (zone.rows > 1 ? 0 : 0),
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      <span className="text-[7px] font-semibold text-gray-400 whitespace-nowrap px-0.5">
                        {zone.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom collab rooms */}
              <div className="flex gap-4 mt-2 pl-10">
                {wing.collabBottom.map(room => (
                  <div key={room.title} className="min-w-[100px]">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">{room.title}</p>
                    <div className="flex flex-col gap-1">
                      {room.desks.map(desk => (
                        <div
                          key={desk.label}
                          className={`text-[10px] font-medium px-3 py-1.5 rounded border cursor-pointer hover:opacity-80 transition-opacity ${STUDY_CLS[desk.status]}`}
                        >
                          {desk.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right collab rooms */}
            <div className="flex flex-col gap-5 flex-shrink-0 min-w-[110px]">
              {wing.collabRight.map(room => (
                <div key={room.title}>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">{room.title}</p>
                  <div className="flex flex-col gap-1">
                    {room.desks.map(desk => (
                      <div
                        key={desk.label}
                        className={`text-[10px] font-medium px-3 py-1.5 rounded border cursor-pointer hover:opacity-80 transition-opacity ${STUDY_CLS[desk.status]}`}
                      >
                        {desk.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  )
}
