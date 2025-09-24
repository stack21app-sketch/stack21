import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaClient } from "@prisma/client"

// Configuración de Prisma
const prisma = new PrismaClient()
console.log('🔧 NextAuth configurado con PostgreSQL local')

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    // Google OAuth Provider
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
    
    // GitHub OAuth Provider
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        authorization: {
          params: {
            scope: "read:user user:email"
          }
        }
      })
    ] : []),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // Usar token si user no está disponible (JWT strategy)
      if (token) {
        session.user.id = token.sub || token.id as string
      } else if (user) {
        session.user.id = user.id
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async signIn({ user, account, profile }) {
      console.log(`🔐 Usuario autenticado: ${user.email} via ${account?.provider}`)
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log(`🔄 Redirect: ${url} -> ${baseUrl}`)
      // Redirigir al dashboard después del login
      if (url === baseUrl) return `${baseUrl}/dashboard`
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`✅ Sign in successful: ${user.email} via ${account?.provider}`)
    },
    async signOut({ session, token }) {
      console.log(`👋 Sign out: ${session?.user?.email}`)
    },
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}