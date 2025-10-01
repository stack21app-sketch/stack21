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

const handler = NextAuth({
  providers,
  callbacks: {
    async session({ session, token }) {
      console.log('🔍 Session callback:', {
        session: !!session,
        token: !!token,
        sessionUser: session?.user?.email,
        tokenSub: token?.sub
      })
      
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      
      console.log('🔍 Session final:', session)
      return session
    },
    async jwt({ token, user, account }) {
      console.log('🔍 JWT callback:', { token: !!token, user: !!user, account: account?.provider })
      
      if (user) {
        token.id = user.id
      }
      return token
    },
    async signIn({ user, account, profile }) {
      console.log('🔍 SignIn callback:', { user: user?.email, account: account?.provider })
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect:', url, '->', baseUrl)
      
      // Si la URL es relativa, construir la URL completa
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`
        console.log('✅ Manteniendo dashboard:', fullUrl)
        return fullUrl
      }
      
      // Si la URL es del mismo dominio, permitirla
      if (url.startsWith(baseUrl)) {
        console.log('✅ Manteniendo dashboard:', url)
        return url
      }
      
      // Por defecto, ir al dashboard
      console.log('🔄 Redirect: /dashboard ->', baseUrl)
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }