import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/utils/connect";
import { PrismaAdapter } from "@auth/prisma-adapter"

const bcrypt = require("bcrypt");

export const { auth, handlers, signIn } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const senhaConfere = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!senhaConfere) return null;

        return {
          id: user.id,
          name: user.companyName,
          email: user.email,
          image: user.storeImageUrl,
          role: user.role
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", 
  },
  callbacks: {
    async jwt({ token }) {
      const user = await prisma.user.findUnique({ where: { id: token.sub } });
      token.name = user?.companyName;
      token.role = user?.role;
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
