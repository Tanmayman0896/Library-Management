'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const A = 'available', O = 'occupied', W = 'away'

const WING_DATA = {
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

        <main className="flex-1 overflow-hidden bg-gray-50 flex flex-col">
          <div
            className="bg-white flex flex-col flex-1 overflow-hidden"
            style={{
              border: '0.94px solid rgba(198,198,205,1)',
              borderRadius: '7.55px',
              margin: '16px',
              padding: '24px',
              boxShadow: '0 0.94px 1.89px rgba(0,0,0,0.05)',
            }}
          >

          {/* Header */}
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">{wing.name} Floorplan</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{wing.subtitle}</p>
          </div>

          {/* Grid area + right collab rooms */}
          <div className="flex gap-5 items-start flex-1 overflow-hidden">

            {/* Grid + bottom collab */}
            <div className="flex flex-col gap-3 flex-1 min-w-0 overflow-hidden">
              <div className="flex gap-2 items-start">

                {/* Row label + desks */}
                <div className="flex flex-col gap-1">
                  {rows.map(row => (
                    <div key={row.label} className="flex items-center gap-1">
                      <span className="w-10 text-[10px] font-semibold text-gray-500 flex-shrink-0 text-right pr-1">
                        {row.label}
                      </span>
                      {/* Desk cells — fixed small size */}
                      {row.desks.map(desk => (
                        <div
                          key={desk.id}
                          title={`Desk ${desk.id} — ${desk.status}`}
                          className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-[10px] font-bold cursor-pointer hover:opacity-75 transition-opacity select-none flex-shrink-0 ${DESK_CLS[desk.status]}`}
                        >
                          {desk.id}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Zone labels (vertical) */}
                <div className="flex flex-col gap-1">
                  {ZONE_SPANS.map((zone) => (
                    <div
                      key={zone.label}
                      className="bg-gray-100 border border-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{
                        width: 18,
                        height: zone.rows * 44,
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
              <div className="flex gap-4 mt-3 pl-11">
                {wing.collabBottom.map(room => (
                  <div key={room.title} className="min-w-[110px]">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">{room.title}</p>
                    <div className="flex flex-col gap-1">
                      {room.desks.map(desk => (
                        <div
                          key={desk.label}
                          className={`text-[10px] font-semibold px-3 py-2 rounded-lg border-2 cursor-pointer hover:opacity-80 transition-opacity text-center ${STUDY_CLS[desk.status]}`}
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
            <div className="flex flex-col gap-4 flex-shrink-0 w-36">
              {wing.collabRight.map(room => (
                <div key={room.title}>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">{room.title}</p>
                  <div className="flex flex-col gap-1">
                    {room.desks.map(desk => (
                      <div
                        key={desk.label}
                        className={`text-[10px] font-semibold px-3 py-2 rounded-lg border-2 cursor-pointer hover:opacity-80 transition-opacity text-center ${STUDY_CLS[desk.status]}`}
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
