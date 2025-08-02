"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Play, RotateCcw, Lightbulb, CheckCircle } from "lucide-react"
import { gsap } from "gsap"

interface Level {
  id: number
  title: string
  difficulty: string
  description: string
  starterCode: string
  solution: string
  hint: string
}

interface CodeEditorProps {
  level: Level
  category: string
  onComplete: () => void
  onClose: () => void
}

export default function CodeEditor({ level, category, onComplete, onClose }: CodeEditorProps) {
  const [code, setCode] = useState(level.starterCode)
  const [output, setOutput] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Focus on editor when opened
    if (editorRef.current) {
      editorRef.current.focus()
    }

    // Entrance animation
    gsap.fromTo(
      ".editor-modal",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    )
  }, [])

  const validateSyntax = (code: string, category: string): { isValid: boolean; error?: string } => {
    try {
      if (category === "html") {
        // Enhanced HTML validation
        const trimmedCode = code.trim()

        // Check for basic HTML structure
        if (trimmedCode.includes("<!DOCTYPE") && !trimmedCode.toLowerCase().includes("<!doctype html>")) {
          return { isValid: false, error: "Invalid DOCTYPE declaration. Use <!DOCTYPE html>" }
        }

        // Check for proper tag structure
        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g
        const tags = []
        let match

        while ((match = tagRegex.exec(code)) !== null) {
          const tagName = match[1].toLowerCase()
          const isClosing = match[0].startsWith("</")
          const isSelfClosing = match[0].endsWith("/>")

          if (isClosing) {
            const lastOpenTag = tags.pop()
            if (!lastOpenTag || lastOpenTag !== tagName) {
              return { isValid: false, error: `Mismatched closing tag: </${tagName}>` }
            }
          } else if (!isSelfClosing) {
            // Self-closing tags don't need to be tracked
            const selfClosingTags = [
              "img",
              "br",
              "hr",
              "input",
              "meta",
              "link",
              "area",
              "base",
              "col",
              "embed",
              "source",
              "track",
              "wbr",
            ]
            if (!selfClosingTags.includes(tagName)) {
              tags.push(tagName)
            }
          }
        }

        // Check for unclosed tags
        if (tags.length > 0) {
          return { isValid: false, error: `Unclosed tag(s): ${tags.map((tag) => `<${tag}>`).join(", ")}` }
        }

        // Check for invalid characters in tag names
        const invalidTagRegex = /<[^a-zA-Z!/][^>]*>/g
        if (invalidTagRegex.test(code)) {
          return { isValid: false, error: "Invalid HTML tag format detected" }
        }

        return { isValid: true }
      }

      if (category === "css") {
        // Enhanced CSS validation
        const lines = code.split("\n")
        let braceCount = 0
        const inRule = false

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()

          // Skip empty lines and comments
          if (!line || line.startsWith("/*") || line.startsWith("*") || line.startsWith("*/")) {
            continue
          }

          // Count braces
          braceCount += (line.match(/{/g) || []).length
          braceCount -= (line.match(/}/g) || []).length

          // Check for CSS property syntax
          if (line.includes(":") && !line.includes("{") && !line.includes("}")) {
            // This should be a CSS property
            if (!line.endsWith(";") && !line.endsWith("{")) {
              return { isValid: false, error: `Missing semicolon at line ${i + 1}: ${line}` }
            }

            // Check property format
            const propertyRegex = /^[a-zA-Z-]+\s*:\s*.+;?$/
            if (!propertyRegex.test(line.replace(/;$/, ""))) {
              return { isValid: false, error: `Invalid CSS property format at line ${i + 1}: ${line}` }
            }
          }

          // Check for selector syntax
          if (line.includes("{") && !line.includes(":")) {
            const selector = line.replace("{", "").trim()
            if (!selector) {
              return { isValid: false, error: `Empty CSS selector at line ${i + 1}` }
            }
          }
        }

        // Check for balanced braces
        if (braceCount !== 0) {
          return {
            isValid: false,
            error: `Unbalanced CSS braces (${braceCount > 0 ? "missing closing" : "extra closing"} braces)`,
          }
        }

        return { isValid: true }
      }

      if (category === "javascript") {
        // Enhanced JavaScript validation
        try {
          // Basic syntax check using Function constructor
          new Function(code)

          const lines = code.split("\n")

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()

            // Skip empty lines and comments
            if (!line || line.startsWith("//") || line.startsWith("/*") || line.startsWith("*")) {
              continue
            }

            // Check for common syntax issues
            if (line.match(/^(let|const|var)\s+\w+/) && !line.includes("=") && !line.endsWith(";")) {
              return { isValid: false, error: `Variable declaration should end with semicolon at line ${i + 1}` }
            }

            // Check function syntax
            if (line.includes("function") && !line.match(/function\s+\w*\s*$$[^)]*$$\s*{?/)) {
              return { isValid: false, error: `Invalid function syntax at line ${i + 1}` }
            }

            // Check for missing semicolons in statements
            if (line.match(/^(return|throw|break|continue)\s+/) && !line.endsWith(";")) {
              return { isValid: false, error: `Missing semicolon after statement at line ${i + 1}` }
            }
          }

          return { isValid: true }
        } catch (error: any) {
          return { isValid: false, error: `JavaScript syntax error: ${error.message}` }
        }
      }

      if (category === "python") {
        // Enhanced Python validation
        const lines = code.split("\n")
        const expectedIndent = 0

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          const trimmed = line.trim()

          // Skip empty lines and comments
          if (!trimmed || trimmed.startsWith("#")) {
            continue
          }

          // Check indentation (basic check)
          const currentIndent = line.length - line.trimStart().length

          // Check for colon after control structures
          if (
            trimmed.match(/^(if|elif|else|for|while|def|class|try|except|finally|with)\b/) &&
            !trimmed.endsWith(":")
          ) {
            return { isValid: false, error: `Missing colon at line ${i + 1}: ${trimmed}` }
          }

          // Check for proper function definition
          if (trimmed.startsWith("def ") && !trimmed.match(/^def\s+\w+\s*$$[^)]*$$\s*:$/)) {
            return { isValid: false, error: `Invalid function definition at line ${i + 1}` }
          }

          // Check for proper class definition
          if (trimmed.startsWith("class ") && !trimmed.match(/^class\s+\w+($$[^)]*$$)?\s*:$/)) {
            return { isValid: false, error: `Invalid class definition at line ${i + 1}` }
          }

          // Check for print function (not statement)
          if (trimmed.includes("print ") && !trimmed.includes("print(")) {
            return { isValid: false, error: `Use print() function, not print statement at line ${i + 1}` }
          }

          // Check for proper string quotes
          const singleQuotes = (trimmed.match(/'/g) || []).length
          const doubleQuotes = (trimmed.match(/"/g) || []).length
          if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
            return { isValid: false, error: `Unmatched quotes at line ${i + 1}` }
          }
        }

        return { isValid: true }
      }

      if (category === "cpp") {
        // Enhanced C++ validation
        const lines = code.split("\n")
        let braceCount = 0
        let hasInclude = false
        let hasMain = false

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()

          // Skip empty lines and comments
          if (!line || line.startsWith("//") || line.startsWith("/*") || line.startsWith("*")) {
            continue
          }

          // Count braces
          braceCount += (line.match(/{/g) || []).length
          braceCount -= (line.match(/}/g) || []).length

          // Check for include statements
          if (line.startsWith("#include")) {
            hasInclude = true
            if (!line.match(/#include\s*<[^>]+>/) && !line.match(/#include\s*"[^"]+"/)) {
              return { isValid: false, error: `Invalid include syntax at line ${i + 1}: ${line}` }
            }
          }

          // Check for main function
          if (line.includes("main") && line.includes("(")) {
            hasMain = true
          }

          // Check for missing semicolons
          if (line.match(/^(int|float|double|char|bool|string)\s+\w+/) && !line.endsWith(";") && !line.includes("(")) {
            return { isValid: false, error: `Missing semicolon at line ${i + 1}: ${line}` }
          }

          // Check cout/cin syntax
          if (line.includes("cout") && !line.includes("<<")) {
            return { isValid: false, error: `Invalid cout syntax at line ${i + 1}. Use cout << ` }
          }
          if (line.includes("cin") && !line.includes(">>")) {
            return { isValid: false, error: `Invalid cin syntax at line ${i + 1}. Use cin >> ` }
          }

          // Check function definition syntax
          if (line.match(/^\w+\s+\w+\s*\(/)) {
            if (!line.includes("{") && !line.endsWith(";")) {
              return {
                isValid: false,
                error: `Function declaration missing semicolon or opening brace at line ${i + 1}`,
              }
            }
          }

          // Check for proper variable declarations
          if (line.match(/^(int|float|double|char|bool|string)\s+\w+\s*=/) && !line.endsWith(";")) {
            return { isValid: false, error: `Variable assignment missing semicolon at line ${i + 1}` }
          }
        }

        // Check for balanced braces
        if (braceCount !== 0) {
          return {
            isValid: false,
            error: `Unbalanced braces (${braceCount > 0 ? "missing closing" : "extra closing"} braces)`,
          }
        }

        // For basic programs, check if include and main exist
        if (code.length > 50 && !hasInclude) {
          return { isValid: false, error: "Missing #include directive for a complete C++ program" }
        }

        return { isValid: true }
      }

      return { isValid: true }
    } catch (error: any) {
      return { isValid: false, error: `Syntax error: ${error.message}` }
    }
  }

  const runCode = () => {
    // First validate syntax
    const validation = validateSyntax(code, category)

    if (!validation.isValid) {
      setOutput(`❌ Syntax Error: ${validation.error}`)
      setIsCorrect(false)
      return
    }

    try {
      let result = ""

      if (category === "html") {
        // For HTML, just display the code as rendered HTML
        result = code
      } else if (category === "css") {
        // For CSS, create a simple preview
        result = `<div style="${code}">CSS Preview</div>`
      } else if (category === "javascript") {
        // For JavaScript, evaluate the code safely
        const func = new Function(
          code + '; return typeof result !== "undefined" ? result : "Code executed successfully";',
        )
        result = String(func())
      } else if (category === "python") {
        // For Python, simulate execution (in a real app, you'd use a Python interpreter)
        result =
          "✅ Python code syntax is valid! (Note: This is a simulation - Python execution would require a backend server)"

        // Check if code contains print statements
        if (code.includes("print(")) {
          const printMatches = code.match(/print$$[^)]+$$/g)
          if (printMatches) {
            result +=
              "\n\nOutput:\n" +
              printMatches
                .map((match) => {
                  const content = match.replace(/print$$(['"`])(.*?)\1$$/, "$2")
                  return content
                })
                .join("\n")
          }
        }
      } else if (category === "cpp") {
        // For C++, simulate compilation and execution
        result =
          "✅ C++ code syntax is valid! (Note: This is a simulation - C++ compilation would require a backend compiler)"

        // Check if code contains cout statements
        if (code.includes("cout")) {
          const coutMatches = code.match(/cout\s*<<\s*[^;]+/g)
          if (coutMatches) {
            result +=
              "\n\nOutput:\n" +
              coutMatches
                .map((match) => {
                  const content = match.replace(/cout\s*<<\s*(['"`])(.*?)\1/, "$2")
                  return content.replace(/cout\s*<<\s*/, "")
                })
                .join("\n")
          }
        }
      }

      setOutput(result)

      // Check if solution is correct (simplified check)
      const isMatch = code.trim().toLowerCase().includes(level.solution.trim().toLowerCase())
      setIsCorrect(isMatch)

      if (isMatch) {
        setShowSuccess(true)
        // Success animation
        gsap.to(".success-animation", {
          scale: 1.2,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        })

        // Confetti effect
        createConfetti()

        setTimeout(() => {
          onComplete()
        }, 2000)
      }
    } catch (error: any) {
      setOutput(`❌ Runtime Error: ${error.message}`)
      setIsCorrect(false)
    }
  }

  const createConfetti = () => {
    const colors = ["#06b6d4", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"]

    for (let i = 0; i < 50; i++) {
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

  const resetCode = () => {
    setCode(level.starterCode)
    setOutput("")
    setIsCorrect(false)
    setShowSuccess(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="editor-modal bg-gray-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-cyan-500/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">
                Level {level.id}: {level.title}
              </h2>
              <Badge className="bg-purple-500 text-white">{level.difficulty}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Left Panel - Instructions */}
            <div className="lg:w-1/3 p-6 border-r border-gray-700 bg-gray-800/50">
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">Instructions</h3>
              <p className="text-gray-300 mb-6">{level.description}</p>

              <div className="space-y-4">
                <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)} className="w-full">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>

                {showHint && (
                  <motion.div
                    className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <p className="text-yellow-400 text-sm">{level.hint}</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Middle Panel - Code Editor */}
            <div className="lg:w-1/2 flex flex-col">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={resetCode}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={runCode} className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Run Code
                  </Button>
                </div>
              </div>

              <div className="flex-1 p-4">
                <textarea
                  ref={editorRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-gray-800 text-white font-mono text-sm p-4 rounded-lg border border-gray-600 focus:border-cyan-500 focus:outline-none resize-none"
                  placeholder="Write your code here..."
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Right Panel - Output */}
            <div className="lg:w-1/3 flex flex-col border-l border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Output</h3>
              </div>

              <div className="flex-1 p-4">
                <div
                  ref={outputRef}
                  className="w-full h-full bg-gray-800 rounded-lg border border-gray-600 p-4 overflow-auto"
                >
                  {output ? (
                    category === "html" || category === "css" ? (
                      <div dangerouslySetInnerHTML={{ __html: output }} />
                    ) : (
                      <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{output}</pre>
                    )
                  ) : (
                    <p className="text-gray-500 italic">Run your code to see the output</p>
                  )}
                </div>

                {isCorrect && (
                  <motion.div
                    className="success-animation mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-green-400 font-semibold">Correct! Well done!</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
