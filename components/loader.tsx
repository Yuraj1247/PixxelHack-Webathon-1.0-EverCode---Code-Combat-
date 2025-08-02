"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null)
  const matrixRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Matrix rain effect
    const chars = "01"
    const matrix = matrixRef.current
    if (matrix) {
      for (let i = 0; i < 100; i++) {
        const span = document.createElement("span")
        span.textContent = chars[Math.floor(Math.random() * chars.length)]
        span.style.left = Math.random() * 100 + "%"
        span.style.animationDelay = Math.random() * 2 + "s"
        span.className = "matrix-char"
        matrix.appendChild(span)
      }
    }

    // Loading animation
    gsap.to(".loading-text", {
      opacity: 0.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    gsap.to(".progress-bar", {
      width: "100%",
      duration: 3,
      ease: "power2.out",
    })
  }, [])

  return (
    <div ref={loaderRef} className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div ref={matrixRef} className="absolute inset-0 overflow-hidden opacity-20">
        <style jsx>{`
          .matrix-char {
            position: absolute;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 20px;
            animation: fall 2s linear infinite;
          }
          @keyframes fall {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
          }
        `}</style>
      </div>

      <div className="text-center z-10">
        <div className="loading-text text-4xl font-bold text-cyan-400 mb-8">CODE COMBAT</div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="progress-bar h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full w-0"></div>
        </div>
        <div className="text-gray-400 mt-4">Loading your coding adventure...</div>
      </div>
    </div>
  )
}
