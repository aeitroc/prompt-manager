import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewMode = 'card' | 'list'

interface ViewStore {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      viewMode: 'card',
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'prompt-view-mode',
    }
  )
)
