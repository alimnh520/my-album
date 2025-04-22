import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import bcrypt from "bcryptjs"
import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { connectDb } from "@/lib/mongoDb/connectDb";
import userProfile from "@/models/userProfile";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: "40759986375-6m3jo4pbn5a5e11g6u1cl6mb79ljg6mb.apps.googleusercontent.com",
            clientSecret: "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"
        }),
        FacebookProvider({
            clientId: "1823682408203386",
            clientSecret: "a94892e978b5078a9d41ca0c48e76c3b"
        }),

    ],

    session: {
        strategy: "jwt"
    },

    callbacks: {
        async signIn({ account, profile }) {

            if (account?.provider === "facebook") {

                const collection = (await mongoClient()).collection('userprofiles');

                let user = await collection.findOne({ user_id: profile.id });

                if (!user) {
                    await connectDb();
                    user = await userProfile.create({
                        user_id: profile.id,
                        username: profile.name,
                        image: profile.picture.data.url
                    });
                }
                const customToken = jwt.sign(
                    { 'user_id': user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                );
                const cookieStore = cookies();
                cookieStore.set("user-access", customToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/'
                });
            }

            if (account?.provider === "google") {
                const collection = (await mongoClient()).collection('userprofiles');
                let user = await collection.findOne({ email: profile.email });

                if (!user) {
                    await connectDb();
                    user = await userProfile.create({
                        username: profile.name,
                        email: profile.email,
                        image: profile.picture
                    });
                }

                const customToken = jwt.sign(
                    { 'user_id': user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                );

                const cookieStore = cookies();
                cookieStore.set("user-access", customToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/'
                });
            }
            return true;
        },
    },
    secret: "sdhfhDFKHFJDHFVEDSfUHfgugdfcusdh345rwffdSHKJhskjd",
    pages: {
        signIn: "/login"
    },
});

export { handler as GET, handler as POST }