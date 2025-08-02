"use client"

import { useEffect, useRef, useCallback } from "react"

interface Sparkle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  opacity: number
  rotation: number
  rotationSpeed: number
}

export default function RippleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparklesRef = useRef<Sparkle[]>([])
  const animationRef = useRef<number>()
  const sparkleIdRef = useRef(0)
  const isMouseDownRef = useRef(false)

  const colors = [
    "#00f5ff", // Cyan
    "#ff00ff", // Magenta
    "#00ff00", // Lime
    "#ffff00", // Yellow
    "#ff6b6b", // Coral
    "#4ecdc4", // Turquoise
    "#45b7d1", // Sky Blue
    "#96ceb4", // Mint
    "#feca57", // Orange
    "#ff9ff3", // Pink
    "#54a0ff", // Blue
    "#5f27cd", // Purple
  ]

  const createSparkle = useCallback(
    (x: number, y: number, vx: number, vy: number, size = 2) => {
      const sparkle: Sparkle = {
        id: sparkleIdRef.current++,
        x,
        y,
        vx,
        vy,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        size: size + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      }
      sparklesRef.current.push(sparkle)
    },
    [colors],
  )

  const createSparkles = useCallback(
    (x: number, y: number, count = 15) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
        const velocity = 2 + Math.random() * 4
        createSparkle(x, y, Math.cos(angle) * velocity, Math.sin(angle) * velocity, 2)
      }
    },
    [createSparkle],
  )

  const createRipple = useCallback(
    (x: number, y: number) => {
      // Create multiple ripple waves
      for (let wave = 0; wave < 3; wave++) {
        setTimeout(() => {
          const rippleCount = 20 + Math.random() * 10
          for (let j = 0; j < rippleCount; j++) {
            const angle = (Math.PI * 2 * j) / rippleCount
            const distance = 50 + wave * 30
            const sparkleX = x + Math.cos(angle) * distance * (0.5 + Math.random() * 0.5)
            const sparkleY = y + Math.sin(angle) * distance * (0.5 + Math.random() * 0.5)

            createSparkle(sparkleX, y, Math.cos(angle) * (1 + Math.random()), Math.sin(angle) * (1 + Math.random()), 1)
          }
        }, wave * 100)
      }
    },
    [createSparkle],
  )

  const updateSparkles = useCallback(() => {
    sparklesRef.current = sparklesRef.current.filter((sparkle) => {
      sparkle.life++
      sparkle.x += sparkle.vx
      sparkle.y += sparkle.vy
      sparkle.vx *= 0.98 // Friction
      sparkle.vy *= 0.98
      sparkle.vy += 0.1 // Gravity
      sparkle.opacity = Math.max(0, 1 - sparkle.life / sparkle.maxLife)
      sparkle.size *= 0.995 // Shrink over time
      sparkle.rotation += sparkle.rotationSpeed

      return sparkle.life < sparkle.maxLife && sparkle.opacity > 0.01 && sparkle.size > 0.1
    })
  }, [])

  const drawStar = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
      const spikes = 4
      const outerRadius = size
      const innerRadius = size * 0.5

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.beginPath()

      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const px = Math.cos(angle) * radius
        const py = Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.closePath()
      ctx.restore()
    },
    [],
  )

  const drawSparkles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      sparklesRef.current.forEach((sparkle) => {
        ctx.save()
        ctx.globalAlpha = sparkle.opacity

        // Main sparkle
        ctx.fillStyle = sparkle.color
        ctx.shadowColor = sparkle.color
        ctx.shadowBlur = 15

        drawStar(ctx, sparkle.x, sparkle.y, sparkle.size, sparkle.rotation)
        ctx.fill()

        // Glow effect
        ctx.globalAlpha = sparkle.opacity * 0.3
        ctx.beginPath()
        ctx.arc(sparkle.x, sparkle.y, sparkle.size * 2.5, 0, Math.PI * 2)
        ctx.fill()

        // Inner bright core
        ctx.globalAlpha = sparkle.opacity * 0.8
        ctx.beginPath()
        ctx.arc(sparkle.x, sparkle.y, sparkle.size * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.fill()

        ctx.restore()
      })
    },
    [drawStar],
  )

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    updateSparkles()
    drawSparkles(ctx)

    animationRef.current = requestAnimationFrame(animate)
  }, [updateSparkles, drawSparkles])

  const getEventPosition = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    let x: number, y: number

    if (e instanceof MouseEvent) {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    } else {
      const touch = e.touches[0] || e.changedTouches[0]
      if (!touch) return null
      x = touch.clientX - rect.left
      y = touch.clientY - rect.top
    }

    return { x, y }
  }, [])

  const handleClick = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const pos = getEventPosition(e)
      if (!pos) return

      createSparkles(pos.x, pos.y, 15)
      createRipple(pos.x, pos.y)
    },
    [getEventPosition, createSparkles, createRipple],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const pos = getEventPosition(e)
      if (!pos) return

      // Create subtle trail sparkles
      if (Math.random() < 0.15) {
        createSparkle(
          pos.x + (Math.random() - 0.5) * 20,
          pos.y + (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          1,
        )
      }

      // Create more sparkles when dragging
      if (isMouseDownRef.current && Math.random() < 0.3) {
        createSparkles(pos.x, pos.y, 5)
      }
    },
    [getEventPosition, createSparkle, createSparkles],
  )

  const handleMouseDown = useCallback(() => {
    isMouseDownRef.current = true
  }, [])

  const handleMouseUp = useCallback(() => {
    isMouseDownRef.current = false
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const pos = getEventPosition(e)
      if (!pos) return

      if (Math.random() < 0.4) {
        createSparkles(pos.x, pos.y, 8)
      }
    },
    [getEventPosition, createSparkles],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse events
    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)

    // Touch events
    canvas.addEventListener("touchstart", handleClick)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("touchend", handleClick)

    // Start animation
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("touchstart", handleClick)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleClick)

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, handleClick, handleMouseMove, handleMouseDown, handleMouseUp, handleTouchMove])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-40"
      style={{
        mixBlendMode: "screen",
        background: "transparent",
      }}
    />
  )
}
