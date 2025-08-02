"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Badge } from "@/components/ui/badge"
import { Lock, CheckCircle, Play, Code, Palette, Zap, Code2, Terminal } from "lucide-react"
import MCQQuiz from "@/components/mcq-quiz"
import { gameData } from "@/lib/game-data"
import { getProgress, updateProgress } from "@/lib/progress"
import GameMarquee from "@/components/game-marquee"

gsap.registerPlugin(ScrollTrigger)

type Category = "html" | "css" | "javascript" | "python" | "cpp"
type Difficulty = "Easy" | "Medium" | "High" | "Very High"

interface Level {
  id: number
  title: string
  difficulty: Difficulty
  description: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const categories = {
  html: { name: "HTML", icon: Code, color: "orange" },
  css: { name: "CSS", icon: Palette, color: "blue" },
  javascript: { name: "JavaScript", icon: Zap, color: "yellow" },
  python: { name: "Python", icon: Code2, color: "green" },
  cpp: { name: "C++", icon: Terminal, color: "purple" },
}

const difficultyColors = {
  Easy: "bg-green-500",
  Medium: "bg-yellow-500",
  High: "bg-red-500",
  "Very High": "bg-purple-500",
}

export default function GamePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("html")
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [progress, setProgress] = useState<Record<string, number[]>>({})
  const [showQuiz, setShowQuiz] = useState(false)
  const levelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedProgress = getProgress()
    setProgress(savedProgress)
  }, [])

  useEffect(() => {
    // Animate level cards on category change
    gsap.fromTo(
      ".level-card",
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.7)",
      },
    )
  }, [selectedCategory])

  const isLevelUnlocked = (category: Category, levelId: number): boolean => {
    if (levelId === 1) return true
    const categoryProgress = progress[category] || []
    return categoryProgress.includes(levelId - 1)
  }

  const isLevelCompleted = (category: Category, levelId: number): boolean => {
    const categoryProgress = progress[category] || []
    return categoryProgress.includes(levelId)
  }

  const handleLevelComplete = (category: Category, levelId: number) => {
    const newProgress = updateProgress(category, levelId)
    setProgress(newProgress)
    setShowQuiz(false)
    setSelectedLevel(null)

    // Success animation
    gsap.to(".success-message", {
      scale: 1.2,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    })
  }

  const openLevel = (level: Level) => {
    if (!isLevelUnlocked(selectedCategory, level.id)) return
    setSelectedLevel(level)
    setShowQuiz(true)
  }

  const levels = gameData[selectedCategory] || []

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Master Coding with MCQs
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Test your knowledge through 150 interactive quiz questions
          </motion.p>
        </div>
      </section>

      {/* Game Tips Marquee */}
      <GameMarquee />

      {/* Category Selection */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon
              const isActive = selectedCategory === key
              return (
                <motion.button
                  key={key}
                  onClick={() => setSelectedCategory(key as Category)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isActive
                      ? `bg-${category.color}-500 text-white shadow-lg`
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {levels.length}
                  </Badge>
                </motion.button>
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-gray-400">
                {progress[selectedCategory]?.length || 0} / {levels.length}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r from-${categories[selectedCategory].color}-400 to-${categories[selectedCategory].color}-600 transition-all duration-500`}
                style={{
                  width: `${((progress[selectedCategory]?.length || 0) / levels.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Levels Grid */}
          <div ref={levelsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {levels.map((level) => {
              const unlocked = isLevelUnlocked(selectedCategory, level.id)
              const completed = isLevelCompleted(selectedCategory, level.id)

              return (
                <motion.div
                  key={level.id}
                  className={`level-card p-6 rounded-xl cursor-pointer ${
                    !unlocked ? "locked" : completed ? "completed" : ""
                  }`}
                  onClick={() => openLevel(level)}
                  whileHover={unlocked ? { scale: 1.02, y: -5 } : {}}
                  whileTap={unlocked ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: level.id * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {!unlocked ? (
                        <Lock className="h-5 w-5 text-gray-500" />
                      ) : completed ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <Play className="h-5 w-5 text-cyan-400" />
                      )}
                      <span className="font-bold text-lg">Level {level.id}</span>
                    </div>
                    <Badge className={`${difficultyColors[level.difficulty]} text-white`}>{level.difficulty}</Badge>
                  </div>

                  <h3 className="font-semibold text-white mb-2">{level.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{level.description}</p>

                  {completed && (
                    <div className="mt-4 flex items-center text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* MCQ Quiz Modal */}
      {showQuiz && selectedLevel && (
        <MCQQuiz
          level={selectedLevel}
          category={selectedCategory}
          onComplete={() => handleLevelComplete(selectedCategory, selectedLevel.id)}
          onClose={() => {
            setShowQuiz(false)
            setSelectedLevel(null)
          }}
        />
      )}
    </div>
  )
}
