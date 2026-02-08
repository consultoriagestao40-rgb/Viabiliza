"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" disabled className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-neutral-300" />
                <label className="toggle-label block overflow-hidden h-5 rounded-full bg-neutral-300 cursor-pointer"></label>
            </div>
        )
    }

    return (
        <div className="flex items-center">
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-primary-600' : 'bg-neutral-200'}`}
            >
                <span
                    className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
            </button>
            <span className="ml-3 text-sm font-medium text-neutral-900 dark:text-gray-300">
                {theme === 'dark' ? 'Ativado' : 'Desativado'}
            </span>
        </div>
    )
}
