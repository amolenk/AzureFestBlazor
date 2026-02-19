'use client'

import React, { useEffect, useRef } from 'react'
import styles from './OtpInput.module.css'

interface OtpInputProps {
  value: string[]
  onChange: (value: string[]) => void
}

export default function OtpInput({ value, onChange }: OtpInputProps) {
  const hiddenRef = useRef<HTMLInputElement | null>(null)
    
  useEffect(() => {
    // Focus as soon as the component mounts
    hiddenRef.current?.focus()
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // accept only digits
    const digits = e.target.value.replace(/\D/g, '').slice(0, value.length)
    const newValue = [...value]

    // spread digits across boxes
    for (let i = 0; i < value.length; i++) {
      newValue[i] = digits[i] || ''
    }
    onChange(newValue)
  }

  // When user clicks a box, focus the hidden input
  const focusHidden = () => hiddenRef.current?.focus()

  return (
    <div className={styles.otpWrapper} onClick={focusHidden}>
      {/* visually hidden real input */}
      <input
        ref={hiddenRef}
        type="tel"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value.join('')}
        onChange={handleInput}
        className={styles.hiddenInput}
        aria-label={`OTP code`}
      />

      {/* visible boxes that just display the digits */}
      {value.map((digit, i) => (
        <div key={i} className={styles.otpBox}>
          {digit}
        </div>
      ))}
    </div>
  )
}