'use client'

import { useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiBlastProps {
  trigger: boolean
  type?: 'success' | 'achievement' | 'levelUp' | 'moduleComplete'
  onComplete?: () => void
}

export function ConfettiBlast({
  trigger,
  type = 'success',
  onComplete,
}: ConfettiBlastProps) {
  const fireConfetti = useCallback(() => {
    const duration = type === 'moduleComplete' ? 4000 : type === 'levelUp' ? 3000 : 2000
    const end = Date.now() + duration

    // Different color schemes based on type
    const colors = {
      success: ['#34d399', '#10b981', '#059669', '#ffffff'],
      achievement: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff'],
      levelUp: ['#60a5fa', '#3b82f6', '#2563eb', '#a855f7', '#ffffff'],
      moduleComplete: ['#fbbf24', '#f59e0b', '#60a5fa', '#a855f7', '#34d399', '#ffffff'],
    }

    // Main burst
    const mainBurst = () => {
      confetti({
        particleCount: type === 'moduleComplete' ? 150 : type === 'levelUp' ? 100 : 50,
        spread: type === 'moduleComplete' ? 100 : 70,
        origin: { y: 0.6 },
        colors: colors[type],
        disableForReducedMotion: true,
      })
    }

    // Side bursts
    const sideBurst = (side: 'left' | 'right') => {
      confetti({
        particleCount: 50,
        angle: side === 'left' ? 60 : 120,
        spread: 55,
        origin: { x: side === 'left' ? 0.1 : 0.9, y: 0.5 },
        colors: colors[type],
        disableForReducedMotion: true,
      })
    }

    // Fire initial burst
    mainBurst()
    
    if (type === 'moduleComplete' || type === 'levelUp') {
      setTimeout(() => sideBurst('left'), 200)
      setTimeout(() => sideBurst('right'), 400)
    }

    // Continuous particles for module complete
    if (type === 'moduleComplete') {
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval)
          return
        }
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: colors[type],
          disableForReducedMotion: true,
        })
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: colors[type],
          disableForReducedMotion: true,
        })
      }, 400)
    }

    setTimeout(() => {
      onComplete?.()
    }, duration)
  }, [type, onComplete])

  useEffect(() => {
    if (trigger) {
      fireConfetti()
    }
  }, [trigger, fireConfetti])

  return null
}

// Fire confetti programmatically
export function fireConfettiBlast(type: 'success' | 'achievement' | 'levelUp' | 'moduleComplete' = 'success') {
  const colors = {
    success: ['#34d399', '#10b981', '#059669', '#ffffff'],
    achievement: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff'],
    levelUp: ['#60a5fa', '#3b82f6', '#2563eb', '#a855f7', '#ffffff'],
    moduleComplete: ['#fbbf24', '#f59e0b', '#60a5fa', '#a855f7', '#34d399', '#ffffff'],
  }

  confetti({
    particleCount: type === 'moduleComplete' ? 150 : type === 'levelUp' ? 100 : 50,
    spread: type === 'moduleComplete' ? 100 : 70,
    origin: { y: 0.6 },
    colors: colors[type],
    disableForReducedMotion: true,
  })
}

export default ConfettiBlast
