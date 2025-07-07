import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // 👈 adiciona o role na session
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string; // 👈 adiciona o role no user do authorize
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // 👈 adiciona o role no token JWT
  }
}
