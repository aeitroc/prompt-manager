import fs from 'fs'
import path from 'path'
import type { SuccessPattern, FailurePattern, ProjectTemplate } from '@/types/memory'

const MEMORY_DIR = '/Users/besi/Code/memory'

export function loadSuccessPatterns(): SuccessPattern[] {
  try {
    const filePath = path.join(MEMORY_DIR, 'success_patterns.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(data)
    
    // Handle both array format and object format with patterns property
    if (Array.isArray(parsed)) {
      return parsed
    }
    if (parsed.patterns && Array.isArray(parsed.patterns)) {
      return parsed.patterns
    }
    return []
  } catch (error) {
    console.error('Failed to load success patterns:', error)
    return []
  }
}

export function loadFailurePatterns(): FailurePattern[] {
  try {
    const filePath = path.join(MEMORY_DIR, 'failure_patterns.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(data)
    
    // Handle both array format and object format with patterns property
    if (Array.isArray(parsed)) {
      return parsed
    }
    if (parsed.patterns && Array.isArray(parsed.patterns)) {
      // Map the actual structure to expected FailurePattern format
      return parsed.patterns.map((p: any) => ({
        id: p.id || p.name || 'unknown',
        date: p.date || new Date().toISOString().split('T')[0],
        problem: p.name || p.description || '',
        symptoms: p.common_issues || p.warning_signs || [],
        root_cause: p.root_cause || p.description || '',
        solution: p.solution || p.resolution?.approach || '',
        technologies: p.tech_stack ? Object.values(p.tech_stack).flat() : [],
        prevention: p.prevention || p.resolution?.prevention || '',
        diagnostic_commands: p.diagnostic_commands || [],
      }))
    }
    return []
  } catch (error) {
    console.error('Failed to load failure patterns:', error)
    return []
  }
}

export function loadProjectTemplates(): ProjectTemplate[] {
  try {
    const filePath = path.join(MEMORY_DIR, 'project_templates.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(data)
    
    // Handle both array format and object format with templates property
    if (Array.isArray(parsed)) {
      return parsed
    }
    if (parsed.templates && Array.isArray(parsed.templates)) {
      return parsed.templates.map((t: any) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
        tech_stack: t.tech_stack || {},
        file_structure: t.file_structure,
      }))
    }
    return []
  } catch (error) {
    console.error('Failed to load project templates:', error)
    return []
  }
}

export function loadAllPatterns() {
  return {
    success: loadSuccessPatterns(),
    failure: loadFailurePatterns(),
    templates: loadProjectTemplates(),
  }
}
