import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { emailVerify } from "@/lib/sendMail";

export const POST = async (request) => {
    const collection = (await mongoClient()).collection('userprofiles');
    try {
        const { email } = await request.json();
        const data = await collection.findOne({ email });
        if (!data) {
            return NextResponse.json({ message: 'user not found', success: false });
        }
        if (data.isVerified === false) {
            await collection.deleteOne({ email });
            return NextResponse.json({ message: 'User not found', success: false });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: '2m' });
        const saveUser = jwt.sign({ 'user': email }, process.env.JWT_SECRET);
        await emailVerify({ email, otp });
        const response = NextResponse.json({ message: 'Verify account', success: true });
        response.cookies.set('otp', hashedOtp, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 2 * 60,
            path: '/'
        });
        response.cookies.set('user', saveUser, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: '/'
        });
        return response;
    } catch (error) {
        return NextResponse.json({ message: 'Failed to search email', success: false });
    }
}