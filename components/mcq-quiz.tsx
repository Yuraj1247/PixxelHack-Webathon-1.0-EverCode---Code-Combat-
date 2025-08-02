"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { X, CheckCircle, XCircle, Lightbulb, RotateCcw } from "lucide-react"
import { gsap } from "gsap"

interface Level {
  id: number
  title: string
  difficulty: string
  description: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface MCQQuizProps {
  level: Level
  category: string
  onComplete: () => void
  onClose: () => void
}

export default function MCQQuiz({ level, category, onComplete, onClose }: MCQQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const quizRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      ".quiz-modal",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    )

    // Animate options
    gsap.fromTo(".option-card", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.3 })
  }, [])

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === level.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    setShowExplanation(true)

    // Result animation
    gsap.to(".result-animation", {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    })

    if (correct) {
      // Success confetti
      createConfetti()
      setTimeout(() => {
        onComplete()
      }, 3000)
    }
  }

  const createConfetti = () => {
    const colors = ["#06b6d4", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"]

    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div")
      confetti.className = "particle"
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.left = Math.random() * 100 + "%"
      confetti.style.top = Math.random() * 100 + "%"
      document.body.appendChild(confetti)

      setTimeout(() => {
        confetti.remove()
      }, 2000)
    }
  }

  const resetQuiz = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)
    setShowExplanation(false)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      html: "orange",
      css: "blue",
      javascript: "yellow",
      python: "green",
      cpp: "purple",
    }
    return colors[category as keyof typeof colors] || "cyan"
  }

  const categoryColor = getCategoryColor(category)

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={quizRef}
          className="quiz-modal bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-cyan-500/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">
                Level {level.id}: {level.title}
              </h2>
              <Badge className={`bg-${categoryColor}-500 text-white`}>{level.difficulty}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              {!showResult && (
                <Button variant="outline" size="sm" onClick={resetQuiz}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Question */}
            <div className="mb-8">
              <p className="text-gray-300 mb-4">{level.description}</p>
              <h3 className="text-xl font-semibold text-white mb-6">{level.question}</h3>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {level.options.map((option, index) => {
                let cardClass = "option-card p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 "

                if (showResult) {
                  if (index === level.correctAnswer) {
                    cardClass += "border-green-500 bg-green-500/10 text-green-400"
                  } else if (index === selectedAnswer && index !== level.correctAnswer) {
                    cardClass += "border-red-500 bg-red-500/10 text-red-400"
                  } else {
                    cardClass += "border-gray-600 bg-gray-800/50 text-gray-400"
                  }
                } else if (selectedAnswer === index) {
                  cardClass += `border-${categoryColor}-500 bg-${categoryColor}-500/10 text-${categoryColor}-400`
                } else {
                  cardClass += "border-gray-600 bg-gray-800/50 text-white hover:border-gray-500"
                }

                return (
                  <motion.div
                    key={index}
                    className={cardClass}
                    onClick={() => handleAnswerSelect(index)}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          showResult && index === level.correctAnswer
                            ? "border-green-500 bg-green-500 text-white"
                            : showResult && index === selectedAnswer && index !== level.correctAnswer
                              ? "border-red-500 bg-red-500 text-white"
                              : selectedAnswer === index
                                ? `border-${categoryColor}-500 bg-${categoryColor}-500 text-white`
                                : "border-gray-500"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                      {showResult && index === level.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                      {showResult && index === selectedAnswer && index !== level.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Submit Button */}
            {!showResult && (
              <div className="flex justify-center mb-6">
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className={`bg-${categoryColor}-600 hover:bg-${categoryColor}-700 text-white px-8 py-3 text-lg font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <motion.div
                className="result-animation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  className={`${isCorrect ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"} mb-6`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      {isCorrect ? (
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-400" />
                      )}
                      <h3 className={`text-2xl font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </h3>
                    </div>

                    {showExplanation && (
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-yellow-400 mb-2">Explanation:</h4>
                            <p className="text-gray-300">{level.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isCorrect && (
                      <div className="mt-4 text-center">
                        <p className="text-green-400 font-semibold">
                          🎉 Great job! Moving to next level in 3 seconds...
                        </p>
                      </div>
                    )}

                    {!isCorrect && (
                      <div className="mt-4 flex justify-center space-x-4">
                        <Button
                          onClick={resetQuiz}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                        >
                          Try Again
                        </Button>
                        <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white">
                          Close
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
