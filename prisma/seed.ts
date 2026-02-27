import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Database seeding completed successfully!')
  console.log('Cookie products are defined in src/lib/cookie-products.ts')
  console.log('No additional seeding is required for this application.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
