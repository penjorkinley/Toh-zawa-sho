import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserFromDb, comparePassword } from "@/server/auth/utils"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials.")
        }

        try {
          // Get user from database
          const user = await getUserFromDb(credentials.email as string)
   
          if (!user || !user.password) {
            throw new Error("Invalid credentials.")
          }

          // // Compare the provided password with the hashed password in the database
          // const isValidPassword = await comparePassword(credentials.password as string, user.password)
          
          // if (!isValidPassword) {
          //   throw new Error("Invalid credentials.")
          // }
   
          // Return user object with their profile data (exclude password)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error("Invalid credentials.")
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/owner-dashboard')
      const isOnAuth = nextUrl.pathname.startsWith('/login') || 
                       nextUrl.pathname.startsWith('/signup') || 
                       nextUrl.pathname.startsWith('/forgot-password') ||
                       nextUrl.pathname.startsWith('/reset-password') ||
                       nextUrl.pathname.startsWith('/verify-otp')

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/owner-dashboard', nextUrl))
        }
        return true
      }
      
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})