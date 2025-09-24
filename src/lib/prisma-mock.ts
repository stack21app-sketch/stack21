// Mock temporal de Prisma para desarrollo sin base de datos

export const prisma = {
  waitlistUser: {
    findUnique: async (args: any) => {
      console.log('Mock: waitlistUser.findUnique', args)
      return null
    },
    create: async (args: any) => {
      console.log('Mock: waitlistUser.create', args)
      return {
        id: 'mock-id-' + Date.now(),
        email: args.data.email,
        name: args.data.name,
        company: args.data.company,
        tier: args.data.tier,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    },
    count: async (args?: any) => {
      console.log('Mock: waitlistUser.count', args)
      return 0
    },
    groupBy: async (args: any) => {
      console.log('Mock: waitlistUser.groupBy', args)
      return []
    },
    findMany: async (args: any) => {
      console.log('Mock: waitlistUser.findMany', args)
      return []
    }
  },
  analytics: {
    create: async (args: any) => {
      console.log('Mock: analytics.create', args)
      return {
        id: 'mock-analytics-' + Date.now(),
        ...args.data
      }
    },
    count: async (args?: any) => {
      console.log('Mock: analytics.count', args)
      return 0
    },
    groupBy: async (args: any) => {
      console.log('Mock: analytics.groupBy', args)
      return []
    },
    findMany: async (args: any) => {
      console.log('Mock: analytics.findMany', args)
      return []
    }
  },
  $queryRaw: async (query: any) => {
    console.log('Mock: $queryRaw', query)
    return [{ '?column?': 1 }]
  }
}
