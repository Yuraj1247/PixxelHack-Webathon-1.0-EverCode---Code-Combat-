"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, Mail, Code, Coffee, Heart } from "lucide-react"
import { useState } from "react"

const teamMembers = [
  {
    name: "Developer 1",
    role: "Full Stack Developer",
    bio: "Passionate about creating seamless user experiences and robust backend systems. Loves working with React, Node.js, and modern web technologies.",
    avatar: "/placeholder.svg?height=200&width=200&text=YC",
    realImage:
      "https://static.vecteezy.com/system/resources/previews/031/023/185/non_2x/portrait-of-smiling-male-software-developer-photo.jpg",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    social: {
      github: "https://github.com/yuvraj",
      linkedin: "https://linkedin.com/in/yuvraj",
      twitter: "https://twitter.com/yuvraj",
    },
  },
  {
    name: "Developer 2",
    role: "Frontend Architect",
    bio: "UI/UX enthusiast with a keen eye for design and performance optimization. Specializes in creating interactive and accessible web applications.",
    avatar: "/placeholder.svg?height=200&width=200&text=AT",
    realImage: "https://static.vecteezy.com/system/resources/previews/031/023/185/non_2x/portrait-of-smiling-male-software-developer-photo.jpg",
    skills: ["Vue.js", "CSS3", "JavaScript", "Figma", "Three.js"],
    social: {
      github: "https://github.com/alexthompson",
      linkedin: "https://linkedin.com/in/alexthompson",
      twitter: "https://twitter.com/alexthompson",
    },
  },
]

const features = [
  {
    icon: Code,
    title: "Interactive Learning",
    description: "Hands-on coding challenges and MCQs to test your knowledge across multiple programming languages.",
  },
  {
    icon: Coffee,
    title: "Gamified Experience",
    description: "Level up your skills with our engaging game mechanics, progress tracking, and achievement system.",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Built by developers, for developers. Join our community and contribute to the learning experience.",
  },
]

export default function AboutPage() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Code Combat
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We're on a mission to make coding education fun, interactive, and accessible to everyone. Through
            gamification and hands-on challenges, we help developers of all levels improve their skills.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              To revolutionize coding education by combining the excitement of gaming with practical programming
              challenges. We believe learning should be engaging, rewarding, and fun.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 h-full hover:border-cyan-500/40 transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      <Icon className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-300">The passionate developers behind Code Combat</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onMouseEnter={() => setHoveredMember(index)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="relative mb-6 inline-block">
                  <div
                    className={`relative w-48 h-48 mx-auto rounded-full overflow-hidden transition-all duration-500 ${
                      hoveredMember === index ? "scale-110 rotate-3" : ""
                    }`}
                  >
                    {/* Animated shining border */}
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-1 transition-all duration-500 ${
                        hoveredMember === index ? "animate-spin" : ""
                      }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                        <img
                          src={hoveredMember === index ? member.realImage : member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover transition-all duration-500"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-cyan-400 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-300 mb-6 leading-relaxed">{member.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {member.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="outline" className="border-purple-500/50 text-purple-300">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.social.github}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-300 mb-8">
              Have questions, suggestions, or want to contribute? We'd love to hear from you!
            </p>
            <div className="flex justify-center space-x-8">
              <a
                href="mailto:hello@codecombat.dev"
                className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
              >
                <Mail className="h-6 w-6" />
                <span className="text-lg">hello@codecombat.dev</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
