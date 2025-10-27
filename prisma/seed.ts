import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const VSCODE_COLORS = {
  categories: {
    cloud: '#569CD6',
    js: '#F9E64F',
    bugs: '#F48771',
    frontend: '#4EC9B0',
    backend: '#C586C0',
    plan: '#89D185',
  }
}

async function main() {
  console.log('Seeding database...')

  // Create default categories
  const categories = [
    { name: 'Cloud', color: VSCODE_COLORS.categories.cloud, icon: 'Cloud', isDefault: true },
    { name: 'JS', color: VSCODE_COLORS.categories.js, icon: 'Code2', isDefault: true },
    { name: 'Bugs', color: VSCODE_COLORS.categories.bugs, icon: 'Bug', isDefault: true },
    { name: 'Frontend', color: VSCODE_COLORS.categories.frontend, icon: 'Layout', isDefault: true },
    { name: 'Backend', color: VSCODE_COLORS.categories.backend, icon: 'Server', isDefault: true },
    { name: 'Plan', color: VSCODE_COLORS.categories.plan, icon: 'ClipboardList', isDefault: true },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  console.log('✅ Seeded default categories')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
