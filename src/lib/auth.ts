import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

// Configurar providers dinámicamente
const providers: any[] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      // Simular autenticación para desarrollo
      if (credentials.email === 'demo@stack21.com' && credentials.password === 'demo123') {
        return {
          id: 'demo-user',
          email: 'demo@stack21.com',
          name: 'Usuario Demo',
          image: null,
        }
      }

      return null
    }
  })
]

// Solo agregar Google si está configurado
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'placeholder' &&
    process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET !== 'placeholder') {
  providers.unshift(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }))
}

// Solo agregar GitHub si está configurado
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_ID !== 'placeholder' &&
    process.env.GITHUB_CLIENT_SECRET && process.env.GITHUB_CLIENT_SECRET !== 'placeholder') {
  providers.unshift(GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }))
}

const isDebug = String(process.env.NEXTAUTH_DEBUG).toLowerCase() === 'true'

export const authOptions = NextAuth({
  providers,
  callbacks: {
    async session({ session, token }) {
      if (isDebug) {
        console.log('🔍 Session callback:', {
          session: !!session,
          token: !!token,
          sessionUser: session?.user?.email,
          tokenSub: token?.sub
        })
      }
      
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      
      if (isDebug) console.log('🔍 Session final:', session)
      return session
    },
    async jwt({ token, user, account }) {
      if (isDebug) console.log('🔍 JWT callback:', { token: !!token, user: !!user, account: account?.provider })
      
      if (user) {
        token.id = user.id
      }
      return token
    },
    async signIn({ user, account, profile }) {
      if (isDebug) console.log('🔍 SignIn callback:', { user: user?.email, account: account?.provider })
      return true
    },
    async redirect({ url, baseUrl }) {
      // Evitar redirecciones "no-op" que ensucian logs
      if (url === baseUrl || url === `${baseUrl}/`) {
        return url
      }

      // Si la URL es relativa, construir la URL completa
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }

      // Si la URL es del mismo origen, permitirla
      try {
        const target = new URL(url)
        if (target.origin === baseUrl) return url
      } catch {
        // Si no es una URL válida, caer al dashboard
      }

      // Por defecto, ir al dashboard
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  debug: isDebug,
})