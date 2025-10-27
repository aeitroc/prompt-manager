'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'
import type { Prompt } from '@/types/prompt'

export function useKeyboardShortcuts(callbacks: {
  onNewPrompt?: () => void
  onFocusSearch?: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey

      // Don't trigger when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // New prompt shortcut (Cmd/Ctrl + N)
      if (isMod && e.key === 'n' && callbacks.onNewPrompt) {
        e.preventDefault()
        callbacks.onNewPrompt()
      }

      // Search shortcut (Cmd/Ctrl + K)
      if (isMod && e.key === 'k' && callbacks.onFocusSearch) {
        e.preventDefault()
        callbacks.onFocusSearch()
      }

      // View toggle (Cmd/Ctrl + V)
      if (isMod && e.key === 'v' && !e.shiftKey) {
        e.preventDefault()
        // Toggle view would be implemented here
        toast('View toggle feature - coming soon!')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [callbacks.onNewPrompt, callbacks.onFocusSearch])

  return {
    shortcuts: {
      'mod': ['metaKey', 'ctrlKey'],
      'keys': {
        'n': ['n'],
        'k': ['k'],
        'v': ['v'],
        's': ['s'],
        'e': ['Escape'],
      }
    }
  }
}
