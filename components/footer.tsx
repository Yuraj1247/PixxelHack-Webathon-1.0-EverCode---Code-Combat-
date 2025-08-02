"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, ArrowUp, Code2 } from "lucide-react"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-gray-900 border-t border-cyan-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Code2 className="h-8 w-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Code Combat
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Master coding through interactive MCQ challenges. From HTML basics to advanced C++, test your programming
              knowledge with our comprehensive quiz platform.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="h-6 w-6" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Game", "Leaderboard", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-cyan-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quiz Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/game?category=html" className="text-gray-400 hover:text-orange-400 transition-colors">
                  HTML Quiz
                </Link>
              </li>
              <li>
                <Link href="/game?category=css" className="text-gray-400 hover:text-blue-400 transition-colors">
                  CSS Quiz
                </Link>
              </li>
              <li>
                <Link
                  href="/game?category=javascript"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  JavaScript Quiz
                </Link>
              </li>
              <li>
                <Link href="/game?category=python" className="text-gray-400 hover:text-green-400 transition-colors">
                  Python Quiz
                </Link>
              </li>
              <li>
                <Link href="/game?category=cpp" className="text-gray-400 hover:text-purple-400 transition-colors">
                  C++ Quiz
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Code Combat. Created by <span className="text-cyan-400 font-semibold">Yuvraj Chinarathod</span> &
            Team
          </p>

          <motion.button
            onClick={scrollToTop}
            className="mt-4 md:mt-0 p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-full transition-colors"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
