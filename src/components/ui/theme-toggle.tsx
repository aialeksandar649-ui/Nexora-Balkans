import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../contexts/ThemeContext"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-[100] inline-flex items-center justify-center gap-2 whitespace-nowrap bg-[#FF385C] hover:bg-[#E61E4D] text-white px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 min-h-[44px]"
      style={{ borderRadius: '9999px' }}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only sm:not-sr-only sm:ml-2 font-semibold">
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </span>
    </button>
  )
}

