"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Crown, Star, TrendingUp, Users, Target } from "lucide-react"
import { getTotalScore, getProgress } from "@/lib/progress"

interface Player {
  id: number
  name: string
  score: number
  totalLevels: number
  completedLevels: {
    html: number
    css: number
    javascript: number
    python: number
    cpp: number
  }
  rank: number
  badge: string
  isCurrentUser?: boolean
}

const generateMockPlayers = (userScore: number, userLevels: any): Player[] => {
  const mockPlayers: Player[] = [
    {
      id: 1,
      name: "Alex Chen",
      score: 2850,
      totalLevels: 95,
      completedLevels: { html: 30, css: 30, javascript: 30, python: 3, cpp: 2 },
      rank: 1,
      badge: "Grandmaster",
    },
    {
      id: 2,
      name: "Sarah Kim",
      score: 2720,
      totalLevels: 87,
      completedLevels: { html: 30, css: 29, javascript: 28, python: 0, cpp: 0 },
      rank: 2,
      badge: "Master",
    },
    {
      id: 3,
      name: "Mike Johnson",
      score: 2650,
      totalLevels: 85,
      completedLevels: { html: 30, css: 28, javascript: 27, python: 0, cpp: 0 },
      rank: 3,
      badge: "Expert",
    },
    {
      id: 4,
      name: "Emma Davis",
      score: 2580,
      totalLevels: 82,
      completedLevels: { html: 29, css: 27, javascript: 26, python: 0, cpp: 0 },
      rank: 4,
      badge: "Advanced",
    },
    {
      id: 5,
      name: "David Wilson",
      score: 2490,
      totalLevels: 79,
      completedLevels: { html: 28, css: 26, javascript: 25, python: 0, cpp: 0 },
      rank: 5,
      badge: "Advanced",
    },
    {
      id: 6,
      name: "Lisa Zhang",
      score: 2420,
      totalLevels: 76,
      completedLevels: { html: 27, css: 25, javascript: 24, python: 0, cpp: 0 },
      rank: 6,
      badge: "Intermediate",
    },
    {
      id: 7,
      name: "Tom Brown",
      score: 2350,
      totalLevels: 73,
      completedLevels: { html: 26, css: 24, javascript: 23, python: 0, cpp: 0 },
      rank: 7,
      badge: "Intermediate",
    },
    {
      id: 8,
      name: "Anna Lee",
      score: 2280,
      totalLevels: 70,
      completedLevels: { html: 25, css: 23, javascript: 22, python: 0, cpp: 0 },
      rank: 8,
      badge: "Intermediate",
    },
  ]

  // Add current user
  const userTotalLevels = Object.values(userLevels).reduce((sum: number, levels: any) => sum + levels.length, 0)
  const currentUser: Player = {
    id: 999,
    name: "You",
    score: userScore,
    totalLevels: userTotalLevels,
    completedLevels: {
      html: userLevels.html?.length || 0,
      css: userLevels.css?.length || 0,
      javascript: userLevels.javascript?.length || 0,
      python: userLevels.python?.length || 0,
      cpp: userLevels.cpp?.length || 0,
    },
    rank: 0,
    badge: getBadgeForScore(userScore),
    isCurrentUser: true,
  }

  const allPlayers = [...mockPlayers, currentUser].sort((a, b) => b.score - a.score)
  return allPlayers.map((player, index) => ({ ...player, rank: index + 1 }))
}

const getBadgeForScore = (score: number): string => {
  if (score >= 2500) return "Grandmaster"
  if (score >= 2000) return "Master"
  if (score >= 1500) return "Expert"
  if (score >= 1000) return "Advanced"
  if (score >= 500) return "Intermediate"
  return "Beginner"
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-8 w-8 text-yellow-400" />
    case 2:
      return <Trophy className="h-8 w-8 text-gray-300" />
    case 3:
      return <Medal className="h-8 w-8 text-amber-600" />
    default:
      return <Award className="h-6 w-6 text-gray-400" />
  }
}

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case "Grandmaster":
      return "bg-gradient-to-r from-purple-500 to-pink-500"
    case "Master":
      return "bg-gradient-to-r from-blue-500 to-cyan-500"
    case "Expert":
      return "bg-gradient-to-r from-green-500 to-emerald-500"
    case "Advanced":
      return "bg-gradient-to-r from-orange-500 to-red-500"
    case "Intermediate":
      return "bg-gradient-to-r from-yellow-500 to-orange-500"
    default:
      return "bg-gradient-to-r from-gray-500 to-gray-600"
  }
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [userStats, setUserStats] = useState({ score: 0, rank: 0, totalPlayers: 0 })
  const leaderboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateLeaderboard = () => {
      const userScore = getTotalScore()
      const userProgress = getProgress()
      const updatedPlayers = generateMockPlayers(userScore, userProgress)

      setPlayers(updatedPlayers)

      const currentUser = updatedPlayers.find((p) => p.isCurrentUser)
      setUserStats({
        score: userScore,
        rank: currentUser?.rank || updatedPlayers.length,
        totalPlayers: updatedPlayers.length,
      })
    }

    updateLeaderboard()

    // Update leaderboard every 5 seconds to simulate real-time updates
    const interval = setInterval(updateLeaderboard, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Animate leaderboard entries
    gsap.fromTo(
      ".leaderboard-item",
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      },
    )

    // Animate rank badges
    gsap.fromTo(
      ".rank-badge",
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.5,
      },
    )
  }, [players])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Live Leaderboard
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Real-time rankings updated as you progress
          </motion.p>

          {/* User Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="h-5 w-5 text-cyan-400" />
                <span className="text-gray-400">Your Rank</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">#{userStats.rank}</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-purple-400" />
                <span className="text-gray-400">Your Score</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{userStats.score.toLocaleString()}</div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-pink-500/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-pink-400" />
                <span className="text-gray-400">Total Players</span>
              </div>
              <div className="text-2xl font-bold text-pink-400">{userStats.totalPlayers}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Updates Marquee */}
      <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 backdrop-blur-sm border-y border-cyan-500/20 py-3 overflow-hidden group">
        <div className="flex animate-marquee group-hover:pause-animation whitespace-nowrap">
          <div className="flex items-center mx-8 text-green-400">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>Live updates every 5 seconds!</span>
          </div>
          <div className="flex items-center mx-8 text-blue-400">
            <Star className="h-4 w-4 mr-2" />
            <span>Complete more levels to climb the ranks!</span>
          </div>
          <div className="flex items-center mx-8 text-purple-400">
            <Trophy className="h-4 w-4 mr-2" />
            <span>Your progress is automatically tracked!</span>
          </div>
          <div className="flex items-center mx-8 text-orange-400">
            <Target className="h-4 w-4 mr-2" />
            <span>Compete with developers worldwide!</span>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {players.slice(0, 3).map((player, index) => (
              <motion.div
                key={player.id}
                className={`leaderboard-item text-center ${
                  index === 0 ? "md:order-2 transform md:scale-110" : index === 1 ? "md:order-1" : "md:order-3"
                } ${player.isCurrentUser ? "ring-2 ring-cyan-400" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card
                  className={`bg-gray-800/50 backdrop-blur-sm border-2 ${
                    index === 0 ? "border-yellow-400 glow-yellow" : index === 1 ? "border-gray-300" : "border-amber-600"
                  } ${player.isCurrentUser ? "bg-cyan-900/20 border-cyan-400" : ""}`}
                >
                  <CardHeader className="pb-4">
                    <div className="rank-badge mx-auto mb-4">{getRankIcon(player.rank)}</div>
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-cyan-400 bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{player.name.charAt(0)}</span>
                    </div>
                    <CardTitle className={`text-xl ${player.isCurrentUser ? "text-cyan-400" : "text-white"}`}>
                      {player.name}
                    </CardTitle>
                    <Badge className={`${getBadgeColor(player.badge)} text-white`}>{player.badge}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyan-400 mb-2">{player.score.toLocaleString()}</div>
                    <div className="text-gray-400 mb-4">{player.totalLevels} Levels Completed</div>
                    <div className="grid grid-cols-5 gap-1 text-xs">
                      <div className="text-orange-400">HTML: {player.completedLevels.html}</div>
                      <div className="text-blue-400">CSS: {player.completedLevels.css}</div>
                      <div className="text-yellow-400">JS: {player.completedLevels.javascript}</div>
                      <div className="text-green-400">PY: {player.completedLevels.python}</div>
                      <div className="text-purple-400">C++: {player.completedLevels.cpp}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Rest of Leaderboard */}
          <div className="space-y-4">
            {players.slice(3).map((player, index) => (
              <motion.div
                key={player.id}
                className={`leaderboard-item ${player.isCurrentUser ? "ring-2 ring-cyan-400" : ""}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
              >
                <Card
                  className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-cyan-500/50 transition-all ${
                    player.isCurrentUser ? "bg-cyan-900/20 border-cyan-400" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rank-badge flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full">
                          <span className="text-xl font-bold text-white">#{player.rank}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-gray-600 bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">{player.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3
                            className={`text-lg font-semibold ${player.isCurrentUser ? "text-cyan-400" : "text-white"}`}
                          >
                            {player.name}
                          </h3>
                          <Badge className={`${getBadgeColor(player.badge)} text-white text-xs`}>{player.badge}</Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400">{player.score.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">{player.totalLevels} Levels</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-orange-400 font-semibold">{player.completedLevels.html}</div>
                        <div className="text-gray-500">HTML</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-semibold">{player.completedLevels.css}</div>
                        <div className="text-gray-500">CSS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-semibold">{player.completedLevels.javascript}</div>
                        <div className="text-gray-500">JavaScript</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-semibold">{player.completedLevels.python}</div>
                        <div className="text-gray-500">Python</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-400 font-semibold">{player.completedLevels.cpp}</div>
                        <div className="text-gray-500">C++</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
;<style jsx>{`
  .glow-yellow {
    box-shadow: 0 0 30px rgba(251, 191, 36, 0.3);
  }
  
  .pause-animation {
    animation-play-state: paused;
  }
  
  .animate-marquee {
    animation: marquee 25s linear infinite;
  }
  
  @keyframes marquee {
    0% { transform: translateX(0%) }
    100% { transform: translateX(-100%) }
  }
`}</style>
