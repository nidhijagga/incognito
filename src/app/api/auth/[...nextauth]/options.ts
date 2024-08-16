import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                console.log("Authorization called with:", credentials);
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { username: credentials?.username },
                            { email: credentials.email }
                        ]
                    })
                    console.log('user', user)
                    if (!user) {
                        throw new Error("User Not Found")
                    } else {
                        if (!user.isVerified) {
                            throw new Error("User Not Verified")
                        } else {
                            const isMatch = await bcrypt.compare(credentials.password, user.password)
                            if (!isMatch) {
                                throw new Error("Invalid Password")
                            } else {
                                return user
                            }
                        }
                    }
                } catch (error: any) {
                    console.log('error in login', error)
                    throw new error(error)
                }
            }

        })
    ],
    pages: {
        signIn: '/auth/signin', 
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            // Add user info to the token
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.email = user.email;
                token.isVerified = user.isVerified
            }
            return token;
        },
        async session({ session, token }) {
            // Add user info to the session
            if (token) {
                session.user._id = token._id as string;
                session.user.username = token.username as string;
                session.user.email = token.email as string;
                session.user.isVerified = token.isVerified as boolean;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}