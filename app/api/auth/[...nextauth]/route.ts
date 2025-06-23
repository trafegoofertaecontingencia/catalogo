import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/utils/connect"
import type { NextAuthOptions, User } from "next-auth"

// Tipagem extra (se estiver usando TypeScript)
declare module "next-auth" {
  interface Session {
    user: User & { isAdmin: boolean }
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.isAdmin = token.isAdmin
      }
      return session
    },
    async jwt({ token }) {
      if (!token.email) return token

      const userInDb = await prisma.user.findUnique({
        where: { email: token.email },
      })

      token.isAdmin = userInDb?.isAdmin ?? false
      return token
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
