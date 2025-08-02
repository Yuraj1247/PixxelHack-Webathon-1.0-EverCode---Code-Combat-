"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Zap, Trophy, Users, Star, Play, Target, BookOpen, Award } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ThreeBackground from "@/components/three-background"
import RippleEffect from "@/components/ripple-effect"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Code,
    title: "Interactive Coding",
    description: "Practice with real code challenges across multiple programming languages",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get immediate results and explanations for every question you answer",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description: "Level up your skills with our engaging progression system and achievements",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of developers improving their skills together",
    color: "from-green-400 to-emerald-500",
  },
]

const stats = [
  { icon: Users, label: "Active Learners", value: "10,000+", color: "text-blue-400" },
  { icon: BookOpen, label: "Coding Challenges", value: "500+", color: "text-green-400" },
  { icon: Award, label: "Skills Mastered", value: "50+", color: "text-purple-400" },
  { icon: Star, label: "Success Rate", value: "95%", color: "text-yellow-400" },
]

const languages = [
  { name: "HTML", color: "bg-orange-500", count: "30 levels" },
  { name: "CSS", color: "bg-blue-500", count: "30 levels" },
  { name: "JavaScript", color: "bg-yellow-500", count: "30 levels" },
  { name: "Python", color: "bg-green-500", count: "30 levels" },
  { name: "C++", color: "bg-purple-500", count: "30 levels" },
]

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hero animations
    gsap.fromTo(".hero-title", { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })

    gsap.fromTo(
      ".hero-subtitle",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" },
    )

    gsap.fromTo(
      ".hero-buttons",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" },
    )

    // Features animation
    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Stats animation
    gsap.fromTo(
      ".stat-card",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Language badges animation
    gsap.fromTo(
      ".language-badge",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".languages-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <ThreeBackground />
      <RippleEffect />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center z-10">
          <motion.h1
            className="hero-title text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Code Combat
          </motion.h1>

          <motion.p
            className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Master programming through interactive challenges, MCQs, and real-world coding scenarios. Level up your
            skills in HTML, CSS, JavaScript, Python, and C++.
          </motion.p>

          <motion.div
            className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link href="/game">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold rounded-full group"
              >
                Start Playing
                <Play className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 px-8 py-4 text-lg font-semibold rounded-full bg-transparent"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-4 bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div key={index} className="stat-card text-center" whileHover={{ scale: 1.05 }}>
                  <Icon className={`h-12 w-12 ${stat.color} mx-auto mb-4`} />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Why Choose Code Combat?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines the excitement of gaming with effective learning methodologies to help you master
              programming concepts faster than ever.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div key={index} className="feature-card group" whileHover={{ y: -10 }}>
                  <Card className="h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="languages-section py-20 px-4 bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Master 5 Programming Languages
          </motion.h2>
          <motion.p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            From web development to system programming, we've got you covered with comprehensive challenges in the most
            popular languages.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {languages.map((lang, index) => (
              <motion.div
                key={index}
                className="language-badge"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="outline"
                  className={`${lang.color} text-white border-0 px-6 py-3 text-lg font-semibold`}
                >
                  {lang.name} • {lang.count}
                </Badge>
              </motion.div>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/game">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-4 text-lg font-semibold rounded-full"
              >
                <Target className="mr-2 h-5 w-5" />
                Start Your Journey
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers who are already improving their coding skills with Code Combat.
            </p>
            <Link href="/game">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-12 py-6 text-xl font-bold rounded-full group"
              >
                Begin Your Quest
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
