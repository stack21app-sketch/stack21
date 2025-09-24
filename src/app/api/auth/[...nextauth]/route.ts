import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session }) {
      // Simular datos de usuario sin base de datos
      if (session.user) {
        session.user.id = 'simulated-user-id'
        session.user.workspaces = [
          {
            id: 'simulated-workspace-1',
            name: 'Mi Workspace',
            slug: 'mi-workspace',
            role: 'OWNER'
          }
        ]
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = 'simulated-user-id'
        token.workspaces = [
          {
            id: 'simulated-workspace-1',
            name: 'Mi Workspace',
            slug: 'mi-workspace',
            role: 'OWNER'
          }
        ]
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
