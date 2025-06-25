import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
export const { auth, handlers, signIn } = NextAuth({ providers: [Google] });