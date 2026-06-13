import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-[110px] py-6">
        <Image
          src="/full-logo.svg"
          alt="DeskGuard"
          width={83}
          height={61}
          priority
          style={{ transform: 'rotate(-0.65deg)' }}
        />
        <Link
          href="/login"
          className="flex items-center gap-[10px] text-sm font-medium border-2 border-black px-[48px] rounded-[5px] hover:bg-black hover:text-white transition-colors"
          style={{ height: '57px' }}
        >
          {/* Person icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          Login
        </Link>
      </nav>

      {/* Hero — matches Figma: 898px content, left 110px, top 220px from page top */}
      <main className="flex flex-1 items-center px-[110px] pt-[80px] pb-[80px]">
        {/* Left — copy, max ~560px */}
        <div className="flex-1 max-w-[560px]">
          {/* DeskGuard badge */}
          <div className="inline-flex items-center gap-2 border border-gray-300 rounded-sm px-3 py-1.5 mb-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              <path d="M14 14h3v3M17 14h3M14 17v3"/>
            </svg>
            <span className="text-sm font-medium text-black">DeskGuard</span>
          </div>

          <h1 className="text-[72px] font-extrabold leading-[1.05] tracking-tight text-black mb-6">
            Fair Study Spaces for<br />Everyone.
          </h1>

          <p className="text-[17px] text-gray-500 leading-relaxed mb-12 max-w-[500px]">
            The real-time desk management system that ends desk-hogging. Find a spot, scan in, and focus on what matters.
          </p>

          {/* CTA buttons */}
          <div className="flex gap-4 mb-14">
            <Link
              href="/scan"
              className="flex items-center gap-2.5 bg-black text-white text-base font-semibold px-8 py-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                <path d="M14 14h3v3M17 14h3M14 17v3"/>
              </svg>
              Scan QR Code
            </Link>
            <Link
              href="/map"
              className="flex items-center gap-2.5 border border-black text-black text-base font-semibold px-8 py-4 rounded-md hover:bg-black hover:text-white transition-colors"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              View Live Map
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-16 pt-7 border-t border-gray-200">
            <div>
              <p className="text-lg font-bold text-black">Live</p>
              <p className="text-sm text-gray-400 mt-1">Real-time availability</p>
            </div>
            <div>
              <p className="text-lg font-bold text-black">Fair</p>
              <p className="text-sm text-gray-400 mt-1">Anti-hogging policies</p>
            </div>
          </div>
        </div>

        {/* Right — illustration, pushed to right edge */}
        <div className="flex-shrink-0 ml-auto">
          <Image
            src="/human.svg"
            alt="Student studying illustration"
            width={460}
            height={560}
            priority
          />
        </div>
      </main>
    </div>
  )
}
