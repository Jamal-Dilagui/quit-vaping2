import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/app/models/users";
import { connectMongoDb } from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectMongoDb();
          // Find user by email
          const user = await User.findOne({ email: credentials.email }).select('+password');
          if (!user) {
            throw new Error("No user found with this email");
          }
          // Compare passwords
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid password");
          }
          // Return user object without password
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            quitDate: user.quitDate,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error.message);
        }
      }
    }),
   GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code"
      //   }
      // }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist user data in token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.quitDate = user.quitDate;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data to session
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      
      // Format quitDate if it exists
      if (token.quitDate) {
        session.user.quitDate = new Date(token.quitDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } else {
        session.user.quitDate = null;
      }
      
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 