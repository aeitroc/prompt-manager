# Prompt Manager 🤖

🤖 **AI-Powered Prompt Manager with VSCode Dark Theme**

A professional Next.js webapp for managing AI prompts with intelligent AI enhancement, memory pattern integration, and developer-focused VSCode dark theme.

## 🚀 **Features**

### 🤖 **AI Enhancement**
- **Multi-Model Support** - Configure your AI models
- **Memory Pattern Integration** - Learn from your experience
- **Before/After Comparison** - See exactly what AI changed
- **Smart Context** - Uses relevant patterns as enhancement context
- **Professional Results** - Better prompts, clearer instructions

### 📋 **Prompt Management**
- **Full CRUD Operations** - Create, read, update, delete prompts
- **Search & Filter** - Real-time search by title and content
- **Category System** - 6 default + unlimited custom categories
- **Tag System** - Auto-create tags with full management
- **Color Coding** - 30-color palette for visual organization
- **Copy to Clipboard** - Quick copy with toast notifications
- **List/Card Views** - Toggle between layouts with persistence

### 🎨 **Professional Interface**
- **VSCode Dark Theme** - Developer-friendly interface throughout
- **Responsive Design** - Works on all screen sizes
- **Loading States** - Visual feedback for all operations
- **Toast Notifications** - Success/error feedback
- **Keyboard Shortcuts** - Power user features
- **Hover States** - Professional interactions
- **Empty States** - Helpful guidance

## 🛠️ **Tech Stack**

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript
- **Database**: SQLite + Prisma ORM
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **AI Integration**: OpenAI SDK (multiple providers)
- **Memory Patterns**: JSON-based knowledge base

## 🚀 **Development**

### Prerequisites
- Node.js 18+ (you have v3.14.0)
- **AI Configuration**: Create your AI models config file at `~/.factory/config.json`
- **Memory Patterns**: Optional - Create memory directory for pattern learning

### Quick Start
```bash
cd prompt-manager

# Install dependencies
npm install

# Setup database
npx prisma db push
npx prisma db seed

# Start development
npm run dev  # http://localhost:4443
```

## 📝 **Project Structure**

```
prompt-manager/
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── page.tsx     # Main interface
│   │   ├── layout.tsx     # Root layout
│   │   ├── globals.css    # VSCode theme
│   │   └── api/          # API routes
│   │       ├── prompts/
│   │       │   ├── route.ts       # GET, POST
│   │       │   ├── enhance/
│   │       │   │   route.ts   # POST
│   │       │   └── [id]/
│   │       │       │   └── route.ts   # GET, PUT, DELETE
│   │   ├── categories/
│   │   │   ├── route.ts       # GET, POST
│   │   │   └── [id]/
│   │   │       │   └── route.ts   # PUT, DELETE
│   │   ├── tags/
│   │   │   ├── route.ts       # GET, POST
│   │   │   └── [id]/
│   │   │       │   └── route.ts   # GET, PUT, DELETE
│   ├── components/                  # React components
│   │   ├── ui/              # shadcn/ui components (12 files)
│   │   ├── prompts/           # Prompt-related components (9 files)
│   │   │   ├── layout/              # Layout components (2 files)
│   │   ├── ai/               # AI-related components (2 files)
│   │   │   └── categories/        # Category management (2 files)
│   │   │   └── tags/            # Tag management (2 files)
│   ├── lib/                    # Utilities and libraries
│   │   ├── db.ts              # Prisma client
│   │   ├── utils.ts           # Utility functions
│   │   ├── colors.ts          # VSCode color palette
│   │   ├── validations/       # Zod schemas (3 files)
│   │   ├── ai/               # AI integration (4 files)
│   │   │   ├── config-loader.ts
│   │   │   ├── client.ts
│   │   │   └── enhance-prompt.ts
│   │   ├── memory/           # Memory system (4 files)
│   │   │   ├── loader.ts
│   │   │   ├── matcher.ts
│   │   │   └── types.ts
│   │   └── hooks/            # Custom hooks (4 files)
│   │   ├── store/            # State management (1 file)
│   │   └── types/            # TypeScript types (4 files)
│   └── prisma/           # Database files (2 files)
│   │   └── schema.prisma
│   │   └── seed.ts
│   ├── docs/                 # Documentation (4 files)
│   │   └── frontend/26-10-2025/
│   │       └── prompt-manager-nextjs/
│   │           └── plan-updated.md
│   │           └── research.md
│   │           └── implementation-status.md
│   │           └── current-status.md
│   │           └── final-status.md
│   │       └── additional-features.md
│   └── public/             # Static assets
│   ├── tests/                 # Test files (empty)
│   ├── package.json          # Package configuration
│   ├── tsconfig.json          # TypeScript config
│   ├── next.config.js         # Next.js config
│   ├── postcss.config.mjs     # PostCSS config
│   └── .env                 # Environment variables
└── prisma/                   # Database files (2 files)
│   └── schema.prisma
│   └── seed.ts
├── docs/                         # Documentation (4 files)
│   ├── frontend/26-10-2025/
│   └── prompt-manager-nextjs/
│   │       └── plan-updated.md
│   │       └── research.md
│   │       └── implementation-status.md
│   │       └── current-status.md
│   │       └── additional-features.md
│   │       └── final-status.md
└── public/                     # Static assets
└── tests/                     # Test files (empty directory)
├── package.json                     # Package configuration
├── tsconfig.json                 # TypeScript config
└── next.config.js                # Next.js config
└── postcss.config.mjs              # PostCSS config
└── .env                         # Environment variables
└── prisma/                   # Database files (2 files)
│   └── schema.prisma
│   └── seed.ts
└── README.md                    # This file
```

## 🎯 **Installation**

### System Requirements**
- **Node.js** 18+ (tested with v3.14.0)
- **npm** (tested with v10.2.4)
- **VSCode** (optional, for theme reference)

### One-Line Setup**
```bash
git clone https://github.com/yourusername/prompt-manager.git
cd prompt-manager
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

### Detailed Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/prompt-manager.git
cd prompt-manager

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed default data
npx prisma db seed

# Start development
npm run dev
```

## 🎯 **Database Setup**

The application uses **SQLite** by default for simplicity, but can easily be migrated to PostgreSQL for production:

```bash
# Update .env for PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/prompt_manager"

# Update schema
# prisma/schema.prisma

# Update package.json scripts
# npm run build && npm run start
```

# Run migrations
npx prisma migrate deploy
```

## 🎯 **Environment Variables**

Create `.env.local` (not tracked):
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

Create `.env.example`:
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

### AI Model Configuration
Create `~/.factory/config.json` with your AI models:

```json
{
  "custom_models": [
    {
      "model_display_name": "Claude.Code",
      "model": "claude-sonnet-4-5-20250929",
      "base_url": "https://api.anthropic.com",
      "api_key": "your-api-key-here",
      "provider": "anthropic"
    },
    {
      "model_display_name": "GPT-4",
      "model": "gpt-4",
      "base_url": "https://api.openai.com/v1",
      "api_key": "your-openai-key-here",
      "provider": "openai"
    }
  ]
}
```

## 🚀 **Build & Deployment**

```bash
# Development
npm run dev    # http://localhost:4443

# Production
npm run build    # Optimized bundle
npm start        # Production server (http://localhost:4443)

# Build verification
npm run build
npm start
```

---

## 🎯 **Usage**

### Creating Your First Prompt
1. Open http://localhost:4443
2. Click "New Prompt"
3. Fill in:
   - Title: "React Hook Cleanup"
   - Content: "Use cleanup function with AbortController in useEffect"
   - Category: "Frontend"
   - Tags: ["react", "hooks", "cleanup"]
   - Choose a color
4. Save

### Enhancing with AI
1. Click "Enhance with AI" in the form
2. View matched memory patterns
3. Select patterns to include
4. Choose AI model
5. Review before/after comparison
6. Accept enhanced version

### Managing Categories
1. Go to "Categories" tab
2. Click "Add Category"
3. Add:
   - Name: "Database"
   - Color: "#4EC9B0" (teal)
   - Icon: "Database"
4. Save

### Managing Tags
1. Go to "Tags" tab
2. Click "Add Tag"
3. Add: "database", "sql", "api"
4. Tags are auto-created when used in prompts

## 🔧 **API Usage**

### Basic Prompt Operations
```javascript
// List all prompts
const response = await fetch('/api/prompts')

// Create a prompt
const response = await fetch('/api/prompts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Prompt',
    content: 'Write your prompt here...',
    categoryId: 'category-id',
    tags: ['tag1', 'tag2']
  })
})

// Enhance a prompt
const response = await fetch('/api/prompts/enhance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    originalPrompt: 'Simple prompt',
    promptTitle: 'Testing',
    includeMemory: true,
    modelId: 0 // Use first model
  })
})
```

### AI Models
```javascript
// List available models
const response = await fetch('/api/ai/models')
const models = await response.json()

// Search memory patterns
const response = await fetch('/api/memory/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    promptTitle: 'React component',
    promptContent: 'Use hooks for state management'
  })
})
```

## 🎯 **Keyboard Shortcuts**

| Shortcut | Function |
|---------|---------|
| Cmd/Ctrl + N | New Prompt |
| Cmd/Ctrl + K | Focus Search |
| Cmd/Ctrl + V | Toggle View |
| Escape | Close Dialog |

## 📚� **Memory Pattern Examples**

The system finds patterns based on:

- **Technology Keywords**: React, Node.js, TypeScript, Next.js
- **Content Analysis**: React hooks, useEffect, state management
- **Best Practices**: Clean architecture, error handling

## 📚� **Success Stories**

1. **Faster Development** - AI learns from your proven patterns
2. **Better Prompts** - AI uses your experience as context
3. **Consistent Quality** - AI maintains your coding standards
4. **Team Knowledge** - Share patterns across team members

---

## 🎉 **Ready to Enhance Your Prompting! 🚀**

Your prompt manager is now a **sophistic tool** that:
- **Learns** from your development experience
- **Enhances** your prompts with relevant context
- **Adapts** to your coding style
- **Improves** with AI assistance

**Start creating prompts and watch as the AI learns from your memory patterns to provide increasingly helpful enhancements!** 🚀✨
