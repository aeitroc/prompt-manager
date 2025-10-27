'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { PromptList } from '@/components/prompts/prompt-list'
import { PromptDialog } from '@/components/prompts/prompt-dialog'
import { PromptFilters } from '@/components/prompts/prompt-filters'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePrompts } from '@/hooks/use-prompts'
import { CategoriesManager } from '@/components/categories/categories-manager'
import { TagsManager } from '@/components/tags/tags-manager'
import type { Prompt, Category, Tag } from '@/types/prompt'

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('prompts')
  const [filters, setFilters] = useState({
    category: 'all',
    tags: [],
  })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<(Prompt & { category: Category | null; tags: Tag[] }) | null>(null)
  
  const { prompts, isLoading, refetch } = usePrompts({
    categoryId: filters.category === 'all' ? undefined : filters.category,
    tags: filters.tags,
  })
  
  const handleAddPrompt = () => {
    setEditingPrompt(null)
    setDialogOpen(true)
  }
  
  const handleEditPrompt = (prompt: Prompt & { category: Category | null; tags: Tag[] }) => {
    setEditingPrompt(prompt)
    setDialogOpen(true)
  }

  const handleEnhancePrompt = (prompt: Prompt & { category: Category | null; tags: Tag[] }) => {
    setEditingPrompt(prompt)
    setDialogOpen(true)
  }
  
  const handleDeletePrompt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return
    
    try {
      const response = await fetch(`/api/prompts/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Failed to delete prompt')
      }
      refetch()
    } catch (error) {
      console.error('Error deleting prompt:', error)
    }
  }
  
  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingPrompt(null)
  }
  
  const handleSuccess = () => {
    refetch()
  }

  const handleNavigate = (section: string) => {
    setActiveSection(section)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header 
        onAddPrompt={handleAddPrompt} 
        onManageCategories={() => setActiveSection('categories')} 
        onManageTags={() => setActiveSection('tags')}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />
      
      <main className="container mx-auto px-4 py-6" id="main-content">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prompts" className="vscode-button-primary data-[state=active]:bg-vscode-blue">
              Prompts
            </TabsTrigger>
            <TabsTrigger value="categories" className="vscode-button-secondary data-[state=active]:bg-bg-elevated">
              Categories
            </TabsTrigger>
            <TabsTrigger value="tags" className="vscode-button-secondary data-[state=active]:bg-bg-elevated">
              Tags
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompts" className="space-y-6">
            <PromptFilters filters={filters} onFilterChange={setFilters} />
            <PromptList
              prompts={prompts}
              isLoading={isLoading}
              onEdit={handleEditPrompt}
              onEnhance={handleEnhancePrompt}
              onDelete={handleDeletePrompt}
            />
          </TabsContent>
          
          <TabsContent value="categories">
            <CategoriesManager />
          </TabsContent>
          
          <TabsContent value="tags">
            <TagsManager />
          </TabsContent>
        </Tabs>
      </main>
      
      <PromptDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        prompt={editingPrompt}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
