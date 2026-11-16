'use client'

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

type RevealProps = {
  children?: ReactNode
  as?: ElementType
  /** Order within a group; each step delays the entrance a little. */
  i?: number
  /** "line" grows a rule from the left instead of rising. */
  variant?: 'rise' | 'line'
  className?: string
  style?: CSSProperties
  id?: string
}

/** Adds the "in" class the first time the element scrolls into view. */
export default function Reveal({
  children,
  as: Tag = 'div',
  i = 0,
  variant = 'rise',
  className = '',
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('in')
            io.disconnect()
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`${variant === 'line' ? 'reveal-line' : 'reveal'} ${className}`}
      style={{ ...style, ['--i' as string]: i }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
