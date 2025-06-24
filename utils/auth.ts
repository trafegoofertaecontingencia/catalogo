import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./connect";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: "147584851521-o5oeou0mqg6o6vgfbtpjsi45kiu305lp.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
};

export const getAuthSession = () => getServerSession(authOptions);
