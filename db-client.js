import {PrismaClient} from '@prisma/client'

export let prisma =
    global.prisma ||
    new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
