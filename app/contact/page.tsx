"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react"
import * as THREE from "three"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const earthRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Typing animation for title
    if (titleRef.current) {
      const text = "Get In Touch"
      titleRef.current.innerHTML = ""

      gsap.to(
        {},
        {
          duration: 2,
          ease: "none",
          onUpdate: function () {
            const progress = this.progress()
            const currentLength = Math.floor(progress * text.length)
            if (titleRef.current) {
              titleRef.current.innerHTML =
                text.slice(0, currentLength) + (progress < 1 ? '<span class="animate-pulse">|</span>' : "")
            }
          },
        },
      )
    }

    // 3D Earth background
    if (earthRef.current) {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      earthRef.current.appendChild(renderer.domElement)

      // Create Earth
      const geometry = new THREE.SphereGeometry(2, 32, 32)
      const textureLoader = new THREE.TextureLoader()

      // Use built-in earth texture
      const earthTexture = textureLoader.load("/assets/3d/texture_earth.jpg")
      const material = new THREE.MeshBasicMaterial({
        map: earthTexture,
        transparent: true,
        opacity: 0.8,
      })

      const earth = new THREE.Mesh(geometry, material)
      scene.add(earth)

      // Add wireframe overlay
      const wireframeGeometry = new THREE.SphereGeometry(2.1, 16, 16)
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
      const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
      scene.add(wireframe)

      camera.position.z = 5

      const animate = () => {
        requestAnimationFrame(animate)
        earth.rotation.y += 0.005
        wireframe.rotation.y -= 0.003
        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        if (earthRef.current && renderer.domElement) {
          earthRef.current.removeChild(renderer.domElement)
        }
        renderer.dispose()
      }
    }

    // Form animation
    gsap.fromTo(".contact-form", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.5 })

    gsap.fromTo(".contact-info", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, delay: 0.7 })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Success animation
    gsap.to(".success-message", {
      scale: 1.1,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    })

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* 3D Earth Background */}
      <div ref={earthRef} className="fixed inset-0 -z-10 opacity-30" />

      {/* Header */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent min-h-[80px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.p
            className="text-xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            Have questions? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="contact-info">
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-gray-300">contact@codecombat.dev</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Phone</h3>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Location</h3>
                      <p className="text-gray-300">San Francisco, CA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">&lt; 24h</div>
                      <div className="text-gray-400 text-sm">Email Response</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">99%</div>
                      <div className="text-gray-400 text-sm">Satisfaction Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isSubmitted ? (
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="floating-label-group">
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                            placeholder="Your Name"
                          />
                        </div>
                        <div className="floating-label-group">
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                            placeholder="Your Email"
                          />
                        </div>
                      </div>

                      <div className="floating-label-group">
                        <Input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                          placeholder="Subject"
                        />
                      </div>

                      <div className="floating-label-group">
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 resize-none"
                          placeholder="Your Message"
                        />
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white py-3 text-lg font-semibold rounded-lg ripple-effect"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Sending...
                            </div>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  ) : (
                    <motion.div
                      className="success-message text-center py-12"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-300">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
