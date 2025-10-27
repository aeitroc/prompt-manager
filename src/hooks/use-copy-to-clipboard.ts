'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false)
  
  const copyToClipboard = async (text: string, successMessage = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      
      // Show success notification
      toast.success(successMessage)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy to clipboard')
      setIsCopied(false)
    }
  }
  
  return { copyToClipboard, isCopied }
}
