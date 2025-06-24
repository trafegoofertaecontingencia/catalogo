import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import { prisma } from "@/utils/connect"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: <Adapter>PrismaAdapter(prisma),
  providers: [Google],
  secret: process.env.AUTH_SECRET,
})

export const { GET, POST } = handlers
export const dynamic = "force-dynamic"