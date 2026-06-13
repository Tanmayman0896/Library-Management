'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Logo dimensions (Vector.svg viewBox 0 0 539 398)
const LOGO_W = 420
const LOGO_H = Math.round(420 * (398 / 539))

export default function SplashPage() {
  const router = useRouter()
  // 'idle' → 'rising'
  const [stage, setStage] = useState('idle')

  useEffect(() => {
    // Short pause so the ghost outline is visible first
    const t1 = setTimeout(() => setStage('rising'), 400)
    // Navigate the instant the rise animation finishes (0.5s delay + 2.8s rise)
    // Both pages are white so the cut is seamless — no fade needed
    const t2 = setTimeout(() => router.push('/home'), 3300)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Fixed-size container so both layers overlap perfectly */}
      <div
        style={{ position: 'relative', width: LOGO_W, height: LOGO_H }}
      >
        {/* Layer 1 — ghost outline (faint, always visible as a guide) */}
        <img
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
          }}
        />

        {/* Layer 2 — fully filled black logo rising from bottom upward */}
        <img
          src="/full-logo.svg"
          alt="StudySpace"
          className={stage === 'rising' ? 'logo-rise' : ''}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            clipPath: stage === 'idle' ? 'inset(100% 0 0 0)' : undefined,
          }}
        />
      </div>
    </div>
  )
}
