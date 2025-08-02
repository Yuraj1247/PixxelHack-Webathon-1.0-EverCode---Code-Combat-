export interface Progress {
  [category: string]: number[]
}

export const getProgress = (): Progress => {
  if (typeof window === "undefined") return {}

  const saved = localStorage.getItem("codecombat-progress")
  return saved ? JSON.parse(saved) : { html: [1], css: [1], javascript: [1], python: [1], cpp: [1] }
}

export const updateProgress = (category: string, levelId: number): Progress => {
  const current = getProgress()

  if (!current[category]) {
    current[category] = []
  }

  if (!current[category].includes(levelId)) {
    current[category].push(levelId)
    current[category].sort((a, b) => a - b)
  }

  // Unlock next level (up to 30 levels per category)
  const nextLevel = levelId + 1
  if (nextLevel <= 30 && !current[category].includes(nextLevel)) {
    // Next level will be unlocked automatically by the isLevelUnlocked function
  }

  localStorage.setItem("codecombat-progress", JSON.stringify(current))
  return current
}

export const resetProgress = (): void => {
  localStorage.removeItem("codecombat-progress")
}

export const getCompletedLevels = (category: string): number => {
  const progress = getProgress()
  return progress[category]?.length || 0
}

export const getTotalScore = (): number => {
  const progress = getProgress()
  let total = 0

  Object.values(progress).forEach((levels) => {
    total += levels.length * 100 // 100 points per level
  })

  return total
}
