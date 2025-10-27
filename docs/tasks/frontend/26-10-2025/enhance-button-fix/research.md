# Research: Fix "Enhance with AI" Button and Default Model

## Task ID: enhance-button-fix
**Date**: 2025-10-26  
**Type**: Frontend Fix + Configuration  
**Priority**: High

## Problem Statement

User reported:
1. "Enhance with AI" button is hidden and cannot be clicked
2. Need to ensure Claude.Code is used as the default model

## Research Findings

### 1. Button Visibility Issue

**Root Cause**: The button was NOT actually hidden, but **disabled** when:
- Content field is empty (`!currentContent`)
- Content has less than 10 characters (`currentContent.length < 10`)

**Location**: `src/components/prompts/prompt-form.tsx` (line 115-122)

```typescript
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => setShowEnhanceDialog(true)}
  disabled={!currentContent || currentContent.length < 10}
  className="text-vscode-blue"
>
  <Sparkles className="mr-2 h-4 w-4" />
  Enhance with AI
</Button>
```

**Issue**: Disabled state was not visually obvious to users. The button appeared but users couldn't tell why it wouldn't work.

### 2. Default Model Configuration

**Current Setup**:
- Config file: `/Users/besi/.factory/config.json`
- 7 models configured (Codex High, GLM 4.6, Claude.Opus, Claude.Code, Qwen.Coder.Plus, Qwen.Coder.Free, Grok.Code.Fast)
- Default model selection logic in `src/lib/ai/config-loader.ts`:

```typescript
export function getDefaultModel() {
  const models = getAvailableModels()
  // Prefer Claude.Code or first Anthropic model
  const claudeCode = models.find(m => m.model_display_name === 'Claude.Code')
  const firstAnthropic = models.find(m => m.provider === 'anthropic')
  return claudeCode || firstAnthropic || models[0]
}
```

**Finding**: The logic ALREADY prefers Claude.Code, but the UI was hardcoded to use model index 0 (Codex High) instead of letting the backend choose the default.

### 3. Enhancement Flow

```
User clicks "Enhance with AI"
  ↓
PromptForm opens PromptEnhanceDialog
  ↓
PromptEnhanceDialog state: selectedModel = 0 (hardcoded)
  ↓
API call: /api/prompts/enhance with modelId=0
  ↓
Backend: getModelByIndex(0) → Returns Codex High (NOT Claude.Code!)
  ↓
AI enhancement using wrong model
```

**Problem**: The dialog was hardcoded to use model index 0, bypassing the default model selection logic.

## Existing Patterns in Codebase

### AI Configuration Pattern
- Configuration loaded from external JSON file
- Supports multiple providers (OpenAI, Anthropic)
- Models identified by index in array

### UI State Management
- React hooks for state (`useState`, `useEffect`)
- Custom hooks for data fetching (`useAIModels`, `useCategories`, `useTags`)
- Controlled components with form validation (React Hook Form + Zod)

### VSCode Theme Pattern
- Custom color classes (`vscode-input`, `vscode-button-primary`, `bg-bg-secondary`)
- Consistent disabled states with opacity
- Tooltip support via `title` attribute

## Solution Approach

### 1. Fix Button Visibility
- Add visual feedback for disabled state
- Add tooltip explaining why button is disabled
- Use Tailwind classes: `disabled:opacity-50`, `disabled:cursor-not-allowed`

### 2. Fix Default Model Selection
- Change `selectedModel` initial state from `0` to `undefined`
- Let backend use `getDefaultModel()` when `modelId` is undefined
- Update AIProviderSelector to handle undefined value
- Add "Default (Claude.Code)" option in dropdown

### 3. Improve User Experience
- Show which model is being used
- Display model info below selector
- Make default selection obvious in UI

## Technical Details

### Files to Modify
1. `src/components/prompts/prompt-form.tsx` - Button styling and tooltip
2. `src/components/prompts/prompt-enhance-dialog.tsx` - Default model state
3. `src/components/ai/ai-provider-selector.tsx` - Handle undefined, show default

### Testing Requirements
1. Button appears and shows tooltip when disabled
2. Button enables after typing 10+ characters
3. Enhancement uses Claude.Code by default
4. Model selector shows "Default (Claude.Code)" option
5. Can still manually select other models
6. Model info displays correctly

## References

- Config file: `/Users/besi/.factory/config.json`
- AI config loader: `src/lib/ai/config-loader.ts`
- Enhancement logic: `src/lib/ai/enhance-prompt.ts`
- API endpoint: `src/app/api/prompts/enhance/route.ts`
