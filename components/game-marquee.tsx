"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lightbulb, Target, Trophy, Zap, Code, Rocket, Star, Brain } from "lucide-react"

const gameTips = [
  { icon: Lightbulb, text: "💡 Pro Tip: Read questions carefully - details matter!", color: "text-yellow-400" },
  {
    icon: Target,
    text: "🎯 Focus Mode: Eliminate wrong answers first, then choose the best one",
    color: "text-blue-400",
  },
  {
    icon: Trophy,
    text: "🏆 Achievement Unlocked: Complete 5 levels in a row for bonus points!",
    color: "text-purple-400",
  },
  { icon: Zap, text: "⚡ Speed Bonus: Answer within 10 seconds for extra points", color: "text-cyan-400" },
  { icon: Code, text: "💻 Debug Mindset: Think like a compiler when reading code", color: "text-green-400" },
  { icon: Rocket, text: "🚀 Level Up: Master easy levels before tackling harder ones", color: "text-orange-400" },
  { icon: Star, text: "⭐ Daily Challenge: Try the Code Dice for surprise challenges!", color: "text-pink-400" },
  { icon: Brain, text: "🧠 Memory Palace: Visualize code execution step by step", color: "text-indigo-400" },
  { icon: Target, text: "🎲 Mystery Mode: Roll the dice for random coding challenges", color: "text-red-400" },
  { icon: Trophy, text: "🎖️ Streak Master: Maintain your daily coding streak for rewards", color: "text-emerald-400" },
]

export default function GameMarquee() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div
      className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 backdrop-blur-sm border-y border-purple-500/20 py-3 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="flex space-x-8 whitespace-nowrap"
        animate={{
          x: isPaused ? 0 : [-1000, 0],
        }}
        transition={{
          duration: isPaused ? 0 : 30,
          repeat: isPaused ? 0 : Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {/* Duplicate the tips array to create seamless loop */}
        {[...gameTips, ...gameTips].map((tip, index) => {
          const Icon = tip.icon
          return (
            <div
              key={index}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50 backdrop-blur-sm"
            >
              <Icon className={`h-4 w-4 ${tip.color}`} />
              <span className="text-sm text-gray-300 font-medium">{tip.text}</span>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
