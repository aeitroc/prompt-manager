# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🤖 Agent Management System (AVAILABLE)

**Agent Manager:** `@agents/agent-manager.md` - Ultra-intelligent agent that creates specialized subagents

**Use Agent Manager to:**
- Analyze project needs and create specialized subagents for parallel work
- Detect current requirements and anticipate future needs
- Create agents in `/project-folder/.claude/agents/` as `.md` files
- Orchestrate multiple agents working simultaneously

**Agent Types Available:**
- frontend-architect, backend-engineer, testing-expert, security-specialist
- devops-engineer, database-architect, performance-optimizer
- documentation-writer, integration-specialist, code-reviewer

**When to Use Agent Manager:**
- Complex tasks requiring multiple expertise areas
- Parallel development needed for speed
- Large codebases requiring specialized knowledge
- Tasks that can be divided by domain/technology

## Code Style & Rules

**Core Principle:**
- Leverage using Multi Agents/Subagents in parallel by assigning tasks to them.
- Use agent manager to create specialized subagents: `./agent-manager create /project-folder --max-agents 3`
- Launch agents in parallel when tasks can be divided by expertise.
- In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of concision.
- Interact with Github via Github CLI.
- Interact with Docker via Docker CLI.
- Interact with Stripe via Stripe CLI.
- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise. Sacrifice grammar for the sake of concision.

## Feature Implementation System Guidelines

### Feature Implementation Priority Rules
- IMMEDIATE EXECUTION: Launch parallel Tasks immediately upon feature requests.
- NO CLARIFICATION: Skip asking what type of implementation unless absolutely critical.
- PARALLEL BY DEFAULT: Always use 7-parallel-Task method for efficiency.

**Style Guidelines:**
- **TypeScript:** Strict mode, no `any`, use type imports (`import type`)
- **Imports:** Use `@/` path alias, group by external/internal
- **Naming:** camelCase for functions/vars, PascalCase for types/components
- **Error Handling:** Return error objects, don't throw in services
- **Testing:** Use Node.js native test runner, dependency injection for services

**Coding Rules:**
1. **File Size:** Max 600 lines per file (ideal: 500-600 lines)
2. **Single Responsibility:** Each file must have one primary responsibility
3. **Documentation:** JSDoc required for all public APIs (`@param`, `@returns`)
4. **Unit Tests:** Create `*.test.ts` files for business logic
5. **Barrel Exports:** Each feature directory must have `index.ts`
6. **Dependency Injection:** Pass dependencies as function arguments

# Workflow Rules

**Data Model Changes:**
- Update `./docs/architecture/data-model.md` if schema changes required
- Create file if it doesn't exist

**Task Storage and Documentation:**
- Only create Documentation when necessary for complex features ONLY.
- Frontend tasks: `docs/tasks/frontend/DD-MM-YYYY/<task-id>/`
- Backend tasks: `docs/tasks/backend/DD-MM-YYYY/<task-id>/`
- Use semantic task ID slugs

## Project Overview

**Project**: Prompt Manager 🤖
**Type**: Next.js Full-Stack Web Application
**Tech Stack**: Next.js 15.1.3, React 18, TypeScript, Prisma 6.1.0, SQLite, Zustand 5.0.2, Zod 3.24.1, Tailwind CSS
**Description**: AI-Powered Prompt Manager with VSCode Dark Theme featuring intelligent AI enhancement, memory pattern integration, and developer-focused interface.

## Development Commands

### Essential Commands
```bash
# Development
npm run dev          # Start dev server on port 4443
npm run build        # Production build
npm run start        # Start production server

# Database
npm run db:push     # Push schema changes to database
npm run db:seed     # Seed default data
npm run db:studio   # Open Prisma Studio

# Code Quality
npm run lint        # Run ESLint
```

### Environment Setup
```bash
# Create .env.local
echo "DATABASE_URL=file:./dev.db" > .env.local
echo "NODE_ENV=development" >> .env.local

# Create AI configuration
mkdir -p ~/.factory
# Add ~/.factory/config.json with AI model configurations
```

### AI Configuration Required
Create `~/.factory/config.json`:
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

## Architecture & Patterns

### Core Architecture Patterns
- **Full-stack Next.js** with App Router architecture
- **TypeScript-strict** with no `any` types and `import type` usage
- **Database-first** approach with Prisma ORM and SQLite
- **Component-driven** UI with shadcn/ui design system
- **Hook-based** data fetching and state management
- **AI-enhanced** workflow with multi-provider support

### Key Design Principles
- **VSCode Dark Theme** throughout entire application
- **RESTful API** design with consistent response patterns
- **Memory Pattern Integration** for cross-project knowledge sharing
- **Type-safe** data transfer with Zod validation
- **Optimistic UI** with proper error handling
- **Responsive design** with mobile-first approach

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main interface (tabbed layout)
│   ├── layout.tsx         # Root layout with theme
│   ├── globals.css        # VSCode dark theme styles
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── prompts/          # Prompt-related components
│   ├── layout/           # Layout components
│   ├── ai/               # AI enhancement components
│   ├── categories/       # Category management
│   └── tags/             # Tag management
├── lib/                  # Utilities and services
│   ├── db.ts             # Prisma client instance
│   ├── utils.ts          # General utilities
│   ├── colors.ts         # VSCode color palette
│   ├── validations/      # Zod validation schemas
│   ├── ai/               # AI integration services
│   ├── memory/           # Memory pattern system
│   └── hooks/            # Custom React hooks
├── types/                # TypeScript type definitions
├── store/                # Zustand state management
└── prisma/               # Database schema and seed
```

### API Design Pattern
```
GET    /api/prompts                    # List all prompts (with filters)
POST   /api/prompts                    # Create new prompt
GET    /api/prompts/[id]               # Get single prompt
PUT    /api/prompts/[id]               # Update prompt
DELETE /api/prompts/[id]               # Delete prompt
POST   /api/prompts/enhance           # AI enhancement endpoint

GET    /api/categories                 # List all categories
POST   /api/categories                 # Create category
GET    /api/categories/[id]            # Get category
PUT    /api/categories/[id]           # Update category
DELETE /api/categories/[id]           # Delete category

GET    /api/tags                      # List all tags
POST   /api/tags                      # Create tag
GET    /api/tags/[id]                 # Get tag
PUT    /api/tags/[id]                 # Update tag
DELETE /api/tags/[id]                 # Delete tag

GET    /api/ai/models                 # List AI models
POST   /api/memory/search             # Memory pattern search
```

## Technology Stack Details

### Frontend
- **Next.js 15.1.3** with App Router
- **React 18** with TypeScript
- **Zustand 5.0.2** for state management
- **React Hook Form + Zod** for form handling and validation
- **Tailwind CSS** with VSCode dark theme customization
- **Radix UI** components for accessibility
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Prisma 6.1.0** as ORM
- **SQLite** (development), PostgreSQL ready
- **Next.js API Routes** for backend functionality
- **TypeScript** strict mode throughout

### AI Integration
- **OpenAI SDK** with multi-provider support
- **Anthropic + OpenAI** compatibility
- **Memory Pattern System** for knowledge sharing
- **Configurable models** via `~/.factory/config.json`

## Data Models

### Core Entities
- **Prompt**: Main entity with AI enhancement tracking
- **Category**: Organization with VSCode colors and icons
- **Tag**: Flexible tagging system
- **PromptTag**: Many-to-many join table

### Key Relationships
- Categories can have many prompts (one-to-many)
- Prompts can have many tags (many-to-many)
- Tags can have many prompts (many-to-many)
- Enhancement tracking preserves original content

## UI Components & Patterns

### Component Organization
- **UI Components**: Reusable shadcn/ui components
- **Feature Components**: Organized by domain (prompts, categories, tags)
- **Layout Components**: Header, navigation, dialogs
- **Form Components**: Consistent form validation and submission

### VSCode Theme Implementation
- **Color System**: Consistent with VSCode dark theme
- **Component Styling**: Semantic color usage for states
- **Accessibility**: Proper contrast ratios and focus management

### State Management
- **Zustand**: Global state for view mode persistence
- **Custom Hooks**: Data fetching for prompts, categories, tags
- **Local State**: Component-level state for forms and dialogs

## Key Features & Workflows

### Main Features
1. **Prompt Management**: Full CRUD with categories, tags, colors
2. **AI Enhancement**: Multi-model AI prompt improvement with memory context
3. **Memory Patterns**: Cross-project knowledge integration
4. **VSCode Theme**: Consistent dark theme throughout
5. **Search & Filtering**: Real-time search by title/content, category filtering
6. **Responsive Design**: Mobile-friendly interface

### AI Enhancement Workflow
1. User selects prompt for enhancement
2. System searches relevant memory patterns
3. User selects patterns to include
4. AI enhances prompt with selected context
5. User reviews before/after comparison
6. Enhanced prompt saved with tracking metadata

### Memory Pattern System
- **Success Patterns**: Proven implementations with benefits/tradeoffs
- **Failure Patterns**: Debugged issues with solutions
- **Project Templates**: Reusable project structures
- **Pattern Matching**: Keyword-based relevance scoring

## Current Development Status

**Active Development**: Header enhancement implementation in progress
- Enhanced search system with filters and suggestions
- Quick actions toolbar for favorites and recent prompts
- Loading states and skeleton components
- Improved UX with VSCode dark theme consistency

**Recent Changes**:
- Multiple header components created (enhanced-header.tsx, quick-actions.tsx, search-with-filters.tsx)
- Custom hooks for debounced search functionality
- Utility functions for search optimization
- Skeleton loading components for better UX

**Documentation**:
- Comprehensive data model documentation available at `docs/architecture/data-model.md`
- Task documentation in `docs/tasks/frontend/27-10-2025/`

## Common Tasks

### Adding New Features
1. **Create API Route**: Add in `src/app/api/[feature]/`
2. **Create Components**: Add in `src/components/[feature]/`
3. **Add Types**: Define in `src/types/`
4. **Update Validation**: Add Zod schemas in `src/lib/validations/`
5. **Update Database**: Modify `prisma/schema.prisma` and run migrations

### Debugging Patterns
- **AI Issues**: Check `~/.factory/config.json` and API keys
- **Database Issues**: Run `npm run db:studio` to inspect
- **UI Issues**: Use browser dev tools and check CSS variables
- **API Issues**: Check network tab and response status codes