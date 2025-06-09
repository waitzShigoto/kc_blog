'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-md bg-muted animate-pulse" />
    )
  }

  // 手動切換主題的函數
  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    const html = document.documentElement
    
    // 移除所有主題類別
    html.classList.remove('light', 'dark')
    
    // 添加新主題類別
    html.classList.add(newTheme)
    
    // 更新 localStorage
    localStorage.setItem('theme', newTheme)
    
    // 使用 next-themes 的 setTheme 來保持狀態同步
    setTheme(newTheme)
  }

  return (
    <button
      onClick={handleToggleTheme}
      className="
        relative w-8 h-8 rounded-md
        text-muted-foreground hover:text-foreground hover:bg-muted
        transition-all duration-200 flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-0
      "
      aria-label={theme === 'light' ? '切換到暗黑模式' : '切換到明亮模式'}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  )
} 