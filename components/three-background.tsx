"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create floating cubes
    const cubes: THREE.Mesh[] = []
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

    for (let i = 0; i < 50; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.5),
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })

      const cube = new THREE.Mesh(cubeGeometry, material)
      cube.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20)
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

      scene.add(cube)
      cubes.push(cube)
    }

    camera.position.z = 10

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      cubes.forEach((cube, index) => {
        cube.rotation.x += 0.01 + index * 0.001
        cube.rotation.y += 0.01 + index * 0.001
        cube.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001
      })

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 -z-10" />
}
