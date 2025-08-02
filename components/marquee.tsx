"use client"

import { useEffect, useState } from "react"

const topScorers = [
  { name: "Alex Chen", score: 2850, level: 90 },
  { name: "Sarah Kim", score: 2720, level: 87 },
  { name: "Mike Johnson", score: 2650, level: 85 },
  { name: "Emma Davis", score: 2580, level: 82 },
  { name: "David Wilson", score: 2490, level: 79 },
  { name: "Lisa Zhang", score: 2420, level: 76 },
  { name: "Tom Brown", score: 2350, level: 73 },
  { name: "Anna Lee", score: 2280, level: 70 },
]

export default function Marquee() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topScorers.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 backdrop-blur-sm border-y border-cyan-500/20 py-4 overflow-hidden group">
      <div className="flex animate-marquee group-hover:pause-animation whitespace-nowrap">
        {[...topScorers, ...topScorers].map((scorer, index) => (
          <div key={index} className="flex items-center mx-8 text-cyan-400">
            <span className="text-yellow-400 mr-2">🏆</span>
            <span className="font-semibold">{scorer.name}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-purple-400">{scorer.score} pts</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-green-400">Level {scorer.level}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%) }
          100% { transform: translateX(-50%) }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .pause-animation {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
