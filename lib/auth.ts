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

        // Agora sim você sabe que são strings
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log(user)

        if (!user || !user.password) return null;

        const senhaConfere = await bcrypt.compare(
          credentials.password,
          user.password
        );

        console.log("SENHAS CONFEREM:", senhaConfere)

        if (!senhaConfere) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // ou "database" se quiser usar sessão persistente
  },
  callbacks: {
    async jwt({ token }) {
      const user = await prisma.user.findUnique({ where: { id: token.sub } });
      token.name = user?.name;
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
