'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 手動切換主題的函數
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
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

  if (!mounted) {
    return null
  }

  return (
    <div className="flex justify-start max-sm:justify-center gap-6 py-6">
      <div className="flex flex-col items-center gap-2">
        <button
          className={`
            flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-200
            ${theme === 'light' 
              ? 'bg-blue-500 border-blue-600 text-white shadow-lg' 
              : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
            }
          `}
          onClick={() => handleThemeChange('light')}
          aria-label="切換到明亮模式"
        >
          <Sun className="h-6 w-6" />
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">明亮</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          className={`
            flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all duration-200
            ${theme === 'dark' 
              ? 'bg-blue-500 border-blue-600 text-white shadow-lg' 
              : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
            }
          `}
          onClick={() => handleThemeChange('dark')}
          aria-label="切換到暗黑模式"
        >
          <Moon className="h-6 w-6" />
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">暗黑</span>
      </div>
    </div>
  )
} 