import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: await (async () => {
    const { PrismaAdapter } = await import("@auth/prisma-adapter")
    const { prisma } = await import("@/utils/connect")
    return PrismaAdapter(prisma)
  })(),
  providers: [Google],
  secret: process.env.AUTH_SECRET,
})

export const { GET, POST } = handlers
export const dynamic = "force-dynamic"
