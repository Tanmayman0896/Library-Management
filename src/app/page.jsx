'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Logo dimensions (Vector.svg viewBox 0 0 539 398)
const LOGO_W = 300
const LOGO_H = Math.round(300 * (398 / 539))

export default function SplashPage() {
  const router = useRouter()
  // 'idle' → 'rising' → 'done'
  const [stage, setStage] = useState('idle')

  useEffect(() => {
    // Short pause so the ghost outline is visible first
    const t1 = setTimeout(() => setStage('rising'), 400)
    // After rise animation completes (0.4 delay + 1.8s rise = 2.2s) fade out page
    const t2 = setTimeout(() => setStage('done'), 2400)
    // Navigate after fade
    const t3 = setTimeout(() => router.push('/home'), 2950)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [router])

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-white"
      style={
        stage === 'done'
          ? { animation: 'splashFadeOut 0.5s ease forwards' }
          : undefined
      }
    >
      {/* Fixed-size container so both layers overlap perfectly */}
      <div
        style={{ position: 'relative', width: LOGO_W, height: LOGO_H }}
      >
        {/* Layer 1 — ghost / outline feel (very faint black logo) */}
        <img
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.08,
          }}
        />

        {/* Layer 2 — full black logo revealed from bottom upward */}
        <img
          src="/logo.svg"
          alt="StudySpace"
          className={stage === 'rising' ? 'logo-rise' : ''}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            // Before animation starts keep it fully clipped (hidden)
            clipPath: stage === 'idle' ? 'inset(100% 0 0 0)' : undefined,
          }}
        />
      </div>
    </div>
  )
}
