# Implementation Plan: Fix "Enhance with AI" Button and Default Model

## Task ID: enhance-button-fix
**Date**: 2025-10-26  
**Status**: Completed

## Objectives

1. ✅ Make "Enhance with AI" button visually clear when disabled
2. ✅ Ensure Claude.Code is used as default model for AI enhancement
3. ✅ Improve user experience with tooltips and clear feedback

## Implementation Steps

### Step 1: Fix Button Visibility and Feedback ✅

**File**: `src/components/prompts/prompt-form.tsx`

**Changes**:
- Add Tailwind classes for disabled state styling
- Add tooltip via `title` attribute
- Conditional tooltip text based on button state

**Code Change**:
```typescript
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => setShowEnhanceDialog(true)}
  disabled={!currentContent || currentContent.length < 10}
  className="text-vscode-blue disabled:opacity-50 disabled:cursor-not-allowed"
  title={!currentContent || currentContent.length < 10 
    ? "Add at least 10 characters to enable AI enhancement" 
    : "Enhance this prompt with AI"}
>
  <Sparkles className="mr-2 h-4 w-4" />
  Enhance with AI
</Button>
```

**Result**: Button is always visible but clearly shows disabled state with visual feedback and explanation.

---

### Step 2: Fix Default Model Selection in Dialog ✅

**File**: `src/components/prompts/prompt-enhance-dialog.tsx`

**Changes**:
1. Change `selectedModel` initial state from `0` to `undefined`
2. Add comment explaining the behavior

**Code Change**:
```typescript
// OLD:
const [selectedModel, setSelectedModel] = useState<number>(0)

// NEW:
const [selectedModel, setSelectedModel] = useState<number | undefined>(undefined) 
// Use undefined to let backend choose default
```

**Result**: When no model is explicitly selected, the backend uses `getDefaultModel()` which returns Claude.Code.

---

### Step 3: Update AI Provider Selector ✅

**File**: `src/components/ai/ai-provider-selector.tsx`

**Changes**:
1. Update props interface to accept `number | undefined`
2. Add "Default (Claude.Code)" option
3. Handle undefined value in Select component
4. Show appropriate model info based on selection

**Code Changes**:

**Interface Update**:
```typescript
interface AIProviderSelectorProps {
  selectedModel: number | undefined  // Was: number
  onSelectModel: (index: number | undefined) => void  // Was: (index: number) => void
}
```

**Select Component Update**:
```typescript
<Select 
  value={selectedModel !== undefined ? selectedModel.toString() : 'default'} 
  onValueChange={(val) => onSelectModel(val === 'default' ? undefined : parseInt(val))}
>
  <SelectTrigger className="vscode-input">
    <SelectValue placeholder="Select AI model" />
  </SelectTrigger>
  <SelectContent className="bg-bg-secondary border-bdr-default">
    <SelectItem value="default">
      <span className="font-semibold">Default (Claude.Code)</span>
    </SelectItem>
    {models.map((model, index) => (
      <SelectItem key={index} value={index.toString()}>
        {model.model_display_name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Model Info Display**:
```typescript
{selectedModel !== undefined && models[selectedModel] && (
  <p className="text-xs text-txt-muted">
    Model: {models[selectedModel].model}
  </p>
)}
{selectedModel === undefined && (
  <p className="text-xs text-txt-muted">
    Using default: Claude.Code (claude-sonnet-4-5-20250929)
  </p>
)}
```

**Result**: Users can explicitly choose "Default (Claude.Code)" or select any other model. Clear feedback shows which model will be used.

---

## Technical Architecture

### Data Flow (After Fix)

```
1. User opens prompt form
   ↓
2. Types content (10+ characters)
   ↓
3. "Enhance with AI" button enables (visible feedback)
   ↓
4. Clicks button → PromptEnhanceDialog opens
   ↓
5. Dialog state: selectedModel = undefined
   ↓
6. User sees "Default (Claude.Code)" selected
   ↓
7. Clicks "Enhance Prompt"
   ↓
8. API call: POST /api/prompts/enhance
   Body: { ..., modelId: undefined }
   ↓
9. Backend: modelId undefined → getDefaultModel()
   ↓
10. Returns: Claude.Code model config
    ↓
11. AI enhancement using Claude.Code ✅
```

### Backend Default Model Logic

```typescript
// src/lib/ai/enhance-prompt.ts
export async function enhancePrompt(request: EnhancePromptRequest, ...): Promise<...> {
  // When modelId is undefined, use default
  const modelConfig = request.modelId !== undefined
    ? getModelByIndex(request.modelId)
    : getDefaultModel()  // ← Returns Claude.Code
  
  // ... rest of enhancement logic
}
```

```typescript
// src/lib/ai/config-loader.ts
export function getDefaultModel() {
  const models = getAvailableModels()
  // Prefer Claude.Code (found at index 3 in current config)
  const claudeCode = models.find(m => m.model_display_name === 'Claude.Code')
  const firstAnthropic = models.find(m => m.provider === 'anthropic')
  return claudeCode || firstAnthropic || models[0]
}
```

---

## Testing Checklist

### Button Behavior
- [ ] Button appears in prompt form (always visible)
- [ ] Button is disabled when content is empty
- [ ] Button is disabled when content < 10 characters
- [ ] Button shows tooltip on hover explaining why it's disabled
- [ ] Button enables after typing 10+ characters
- [ ] Button tooltip changes to "Enhance this prompt with AI" when enabled
- [ ] Button opens enhancement dialog on click

### Model Selection
- [ ] Enhancement dialog opens with "Default (Claude.Code)" selected
- [ ] Model selector shows all 7 models + Default option
- [ ] Selecting "Default" shows: "Using default: Claude.Code (claude-sonnet-4-5-20250929)"
- [ ] Selecting specific model shows: "Model: {model-name}"
- [ ] Enhancement uses Claude.Code when default is selected
- [ ] Enhancement uses selected model when explicitly chosen

### Enhancement Flow
- [ ] Click "Enhance Prompt" calls API with correct modelId
- [ ] API returns enhanced prompt
- [ ] Before/after comparison shows correctly
- [ ] Accepting enhancement updates content field
- [ ] Enhancement metadata shows correct model name

---

## Files Modified

1. `src/components/prompts/prompt-form.tsx`
   - Line 115-122: Enhanced button styling and tooltip

2. `src/components/prompts/prompt-enhance-dialog.tsx`
   - Line 43: Changed selectedModel initial state to undefined

3. `src/components/ai/ai-provider-selector.tsx`
   - Line 8-9: Updated interface to accept undefined
   - Line 27-30: Updated Select to handle default value
   - Line 35-37: Added "Default (Claude.Code)" option
   - Line 45-54: Conditional model info display

---

## Verification Steps

1. **Start dev server**: `npm run dev`
2. **Open app**: http://localhost:3002
3. **Create new prompt**:
   - Click "New Prompt"
   - Observe "Enhance with AI" button (should be disabled, grayed out)
   - Hover over button (should show tooltip: "Add at least 10 characters...")
4. **Type content**: Enter at least 10 characters
   - Button should enable (no longer grayed)
   - Tooltip should change to "Enhance this prompt with AI"
5. **Click "Enhance with AI"**:
   - Dialog opens
   - Model selector shows "Default (Claude.Code)"
   - Below selector shows: "Using default: Claude.Code (claude-sonnet-4-5-20250929)"
6. **Click "Enhance Prompt"**:
   - Loading indicator appears
   - AI processes prompt
   - Enhanced version appears in comparison view
   - Metadata shows "Model: Claude.Code" or similar
7. **Accept enhancement**:
   - Content field updates with enhanced version
   - Dialog closes

---

## Success Criteria

✅ **Visibility**: Button is always visible with clear disabled/enabled states  
✅ **Feedback**: Tooltips explain button state to users  
✅ **Default Model**: Claude.Code is used when no model is explicitly selected  
✅ **Flexibility**: Users can still manually select other models  
✅ **UX**: Clear indication of which model will be used  

---

## Notes

- The button was never actually "hidden" - it was disabled and users couldn't tell why
- The root issue was hardcoded model index 0 bypassing default model selection
- Solution maintains backward compatibility while fixing the default behavior
- Users can still override and select any available model
- The fix applies to both new and existing prompts

---

## Related Documentation

- AI Config: `/Users/besi/.factory/config.json`
- Default Model Logic: `src/lib/ai/config-loader.ts`
- Enhancement API: `src/app/api/prompts/enhance/route.ts`
- Enhancement Logic: `src/lib/ai/enhance-prompt.ts`
