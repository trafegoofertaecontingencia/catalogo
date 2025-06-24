import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

console.log("GOOGLE_ID NO BUILD:", process.env.AUTH_GOOGLE_ID)

 
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  secret: process.env.AUTH_SECRET,
})
