import bcrypt from 'bcryptjs'
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("🔥 [DEBUG] Starting authorization for:", credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log("❌ [DEBUG] Missing credentials");
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    console.log("🔍 [DEBUG] User lookup result:", user ? "Found" : "Not Found");

                    if (!user) {
                        console.log("❌ [DEBUG] User not found in DB");
                        return null;
                    }

                    if (!user.password) {
                        console.log("❌ [DEBUG] User has no password set");
                        return null;
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    console.log("🔐 [DEBUG] Password comparison result:", isValid);

                    if (isValid) {
                        console.log("✅ [DEBUG] Login successful!");
                        return user;
                    } else {
                        console.log("❌ [DEBUG] Invalid password");
                    }
                    return null
                } catch (error) {
                    console.error("💥 [DEBUG] Error in authorize:", error);
                    return null;
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.specialty = user.specialty
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as any
                session.user.id = token.id as string
                session.user.specialty = token.specialty
            }
            return session
        }
    },
    secret: process.env.AUTH_SECRET,
}
