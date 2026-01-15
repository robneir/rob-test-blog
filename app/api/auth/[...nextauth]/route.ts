import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      // Use Sovereign's shared GitHub OAuth app first (no setup required!)
      // Then fall back to user's own OAuth app if they prefer
      // Get Sovereign credentials from: https://sovereign.app/oauth-credentials
      clientId: process.env.SOVEREIGN_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.SOVEREIGN_GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.accessToken) {
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
