import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5">
        <Image
          src="/logo.svg"
          alt="StudySpace"
          width={120}
          height={40}
          priority
        />
        <Link
          href="/login"
          className="text-sm font-semibold border border-black px-5 py-2 rounded-full hover:bg-black hover:text-white transition-colors"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex flex-1 items-center justify-between px-12 lg:px-20 pb-10">
        {/* Left — copy */}
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
            StudySpace
          </p>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-black mb-6">
            Fair Study Spaces<br />for Everyone.
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-sm">
            Find open spots, book your place, and never lose your study space again. Real-time desk availability — no more bag-saving.
          </p>
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="border border-black text-black text-sm font-semibold px-6 py-3 rounded-full hover:bg-black hover:text-white transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right — illustration */}
        <div className="hidden lg:block flex-shrink-0">
          <Image
            src="/human.svg"
            alt="Student studying illustration"
            width={380}
            height={480}
            priority
          />
        </div>
      </main>
    </div>
  )
}
