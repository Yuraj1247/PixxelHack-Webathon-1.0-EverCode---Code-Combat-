"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Clock, Zap, Code, Palette, Terminal, Code2, Sparkles } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  timeLimit: number
  difficulty: "Easy" | "Medium" | "Hard"
  language: string
  color: string
  icon: any
  emoji: string
}

const challenges: Challenge[] = [
  {
    id: "html",
    title: "HTML Layout Challenge",
    description:
      "Create a responsive navbar with dropdown menu functionality. Use semantic HTML5 elements and ensure accessibility.",
    timeLimit: 10,
    difficulty: "Medium",
    language: "HTML",
    color: "from-orange-400 to-red-500",
    icon: Code,
    emoji: "🟧",
  },
  {
    id: "css",
    title: "CSS Styling Challenge",
    description:
      "Style a component with glassmorphism effect. Include backdrop blur, transparency, and subtle shadows.",
    timeLimit: 8,
    difficulty: "Easy",
    language: "CSS",
    color: "from-blue-400 to-cyan-500",
    icon: Palette,
    emoji: "🔵",
  },
  {
    id: "javascript",
    title: "JavaScript Debug Challenge",
    description:
      "Debug this async function with promise chain. Fix the error handling and optimize the callback structure.",
    timeLimit: 7,
    difficulty: "Hard",
    language: "JavaScript",
    color: "from-yellow-400 to-orange-500",
    icon: Zap,
    emoji: "🟨",
  },
  {
    id: "python",
    title: "Python One-liner Challenge",
    description: "Convert this multi-line function into a single line using list comprehension and lambda functions.",
    timeLimit: 5,
    difficulty: "Easy",
    language: "Python",
    color: "from-green-400 to-emerald-500",
    icon: Code2,
    emoji: "🟪",
  },
  {
    id: "cpp",
    title: "C++ Optimization Challenge",
    description: "Optimize this O(n²) algorithm to O(n log n). Use appropriate data structures and algorithms.",
    timeLimit: 12,
    difficulty: "Hard",
    language: "C++",
    color: "from-purple-400 to-pink-500",
    icon: Terminal,
    emoji: "⚪",
  },
  {
    id: "mystery",
    title: "Mystery Wild Card Challenge",
    description:
      "Surprise! A random challenge from any programming language. Could be anything from algorithm design to code golf!",
    timeLimit: 15,
    difficulty: "Medium",
    language: "Mystery",
    color: "from-pink-400 to-purple-500",
    icon: Sparkles,
    emoji: "🌟",
  },
]

export default function CodeDice() {
  const [isRolling, setIsRolling] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [canRoll, setCanRoll] = useState(true)
  const [timeUntilNextRoll, setTimeUntilNextRoll] = useState("")
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    // Check if user can roll (24-hour cooldown)
    const lastRoll = localStorage.getItem("lastDiceRoll")
    if (lastRoll) {
      const lastRollTime = new Date(lastRoll).getTime()
      const now = new Date().getTime()
      const timeDiff = now - lastRollTime
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (timeDiff < twentyFourHours) {
        setCanRoll(false)
        const timeLeft = twentyFourHours - timeDiff
        updateCountdown(timeLeft)
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (!canRoll) {
      interval = setInterval(() => {
        const lastRoll = localStorage.getItem("lastDiceRoll")
        if (lastRoll) {
          const lastRollTime = new Date(lastRoll).getTime()
          const now = new Date().getTime()
          const timeDiff = now - lastRollTime
          const twentyFourHours = 24 * 60 * 60 * 1000
          const timeLeft = twentyFourHours - timeDiff

          if (timeLeft <= 0) {
            setCanRoll(true)
            setTimeUntilNextRoll("")
          } else {
            updateCountdown(timeLeft)
          }
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [canRoll])

  const updateCountdown = (timeLeft: number) => {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
    setTimeUntilNextRoll(`${hours}h ${minutes}m ${seconds}s`)
  }

  const createSparkles = () => {
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setSparkles(newSparkles)

    // Remove sparkles after animation
    setTimeout(() => setSparkles([]), 2000)
  }

  const rollDice = () => {
    if (!canRoll || isRolling) return

    setIsRolling(true)
    createSparkles()

    // Animate dice roll
    gsap.to(".dice-cube", {
      rotationX: 720,
      rotationY: 1080,
      scale: 1.2,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        // Select random challenge
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)]
        setCurrentChallenge(randomChallenge)
        setShowModal(true)
        setIsRolling(false)

        // Set cooldown
        localStorage.setItem("lastDiceRoll", new Date().toISOString())
        setCanRoll(false)

        // Reset dice rotation
        gsap.set(".dice-cube", { rotationX: 0, rotationY: 0, scale: 1 })
      },
    })
  }

  const closeModal = () => {
    setShowModal(false)
    setCurrentChallenge(null)
  }

  return (
    <>
      {/* Floating Dice */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {/* Sparkles */}
          <AnimatePresence>
            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  y: -50,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              />
            ))}
          </AnimatePresence>

          {/* Dice */}
          <motion.button
            className={`dice-cube w-16 h-16 rounded-xl shadow-2xl transition-all duration-300 ${
              canRoll
                ? "bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 cursor-pointer"
                : "bg-gradient-to-br from-gray-600 to-gray-700 cursor-not-allowed"
            } backdrop-blur-sm border border-white/20`}
            onClick={rollDice}
            disabled={!canRoll || isRolling}
            whileHover={canRoll ? { scale: 1.1 } : {}}
            whileTap={canRoll ? { scale: 0.95 } : {}}
            title={canRoll ? "Roll the Code Dice!" : `Next roll in: ${timeUntilNextRoll}`}
          >
            <div className="flex items-center justify-center h-full">
              {isRolling ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  🎲
                </motion.div>
              ) : (
                <span className="text-2xl">🎲</span>
              )}
            </div>
          </motion.button>

          {/* Cooldown indicator */}
          {!canRoll && (
            <motion.div
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-white whitespace-nowrap border border-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Clock className="inline w-3 h-3 mr-1" />
              {timeUntilNextRoll}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Challenge Modal */}
      <AnimatePresence>
        {showModal && currentChallenge && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-2xl"
              initial={{ scale: 0.8, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 90 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-gray-900/95 backdrop-blur-md border border-gray-700">
                <CardHeader
                  className={`bg-gradient-to-r ${currentChallenge.color} text-white relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{currentChallenge.emoji}</span>
                      <div>
                        <CardTitle className="text-2xl font-bold">{currentChallenge.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {currentChallenge.language}
                          </Badge>
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {currentChallenge.timeLimit} min
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`bg-white/20 text-white ${
                              currentChallenge.difficulty === "Easy"
                                ? "bg-green-500/30"
                                : currentChallenge.difficulty === "Medium"
                                  ? "bg-yellow-500/30"
                                  : "bg-red-500/30"
                            }`}
                          >
                            {currentChallenge.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={closeModal} className="text-white hover:bg-white/20">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">{currentChallenge.description}</p>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={closeModal}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                    >
                      Maybe Later
                    </Button>
                    <Button
                      className={`bg-gradient-to-r ${currentChallenge.color} hover:opacity-90 text-white font-semibold px-8`}
                      onClick={() => {
                        // Here you could integrate with a code editor or challenge system
                        alert(`Starting ${currentChallenge.title}! Good luck! 🚀`)
                        closeModal()
                      }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Accept Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
