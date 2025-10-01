import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // CredentialsProvider removido - usando solo OAuth para simplicidad
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        // Verificar si el usuario existe
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser && account?.provider === 'google') {
          // Crear nuevo usuario para Google OAuth
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image
            }
          })
        }

        return true
      } catch (error) {
        console.error('SignIn error:', error)
        return false
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { email: user.email, isNewUser })
      
      // Enviar email de bienvenida para nuevos usuarios
      if (isNewUser) {
        // await sendWelcomeEmail(user.email!)
      }
    },
    async signOut({ session, token }) {
      console.log('User signed out:', { email: session?.user?.email })
    }
  }
}

// Funciones auxiliares
export async function createUser(userData: {
  email: string
  name?: string
  password?: string
  provider?: string
}) {
  try {
        const user = await prisma.user.create({
          data: {
            ...userData,
          }
        })

    return { success: true, user }
  } catch (error: any) {
    console.error('Error creating user:', error)
    return { success: false, error: error?.message || 'Unknown error' }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        billing: true,
        workflows: true,
        _count: {
          select: {
            workflows: true
          }
        }
      }
    })

    return { success: true, user }
  } catch (error: any) {
    console.error('Error getting user:', error)
    return { success: false, error: error?.message || 'Unknown error' }
  }
}

export async function updateUserSubscription(userId: string, status: string) {
  try {
    // Buscar billing existente
    const existingBilling = await prisma.billing.findFirst({
      where: { userId }
    })

    if (existingBilling) {
      // Actualizar billing existente
      const billing = await prisma.billing.update({
        where: { id: existingBilling.id },
        data: {
          status: status as any,
          updatedAt: new Date()
        }
      })
      return { success: true, billing }
    } else {
      // Crear nuevo billing
      const billing = await prisma.billing.create({
        data: {
          userId,
          status: status as any,
          plan: 'free',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      return { success: true, billing }
    }
  } catch (error: any) {
    console.error('Error updating subscription:', error)
    return { success: false, error: error?.message || 'Unknown error' }
  }
}
