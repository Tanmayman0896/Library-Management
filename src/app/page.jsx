'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SplashPage() {
  const router = useRouter()
  // phase 0 → outline logo, phase 1 → filled logo, phase 2 → fade out
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900)
    const t2 = setTimeout(() => setPhase(2), 1800)
    const t3 = setTimeout(() => router.push('/home'), 2600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [router])

  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-black transition-opacity duration-500 ${
        phase === 2 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`transition-all duration-700 ${
          phase === 0
            ? 'opacity-40 scale-90'
            : phase === 1
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-110'
        }`}
      >
        <Image
          src="/white-logo.svg"
          alt="StudySpace logo"
          width={160}
          height={160}
          priority
        />
      </div>
    </div>
  )
}
