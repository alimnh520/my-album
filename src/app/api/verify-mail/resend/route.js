import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { emailVerify } from "@/lib/sendMail";

export const GET = async (request) => {
    const cookie = await request.cookies;
    const user = cookie.get('user').value;
    const userData = (jwt.verify(user, process.env.JWT_SECRET)).user;

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await emailVerify({ email:userData.email, otp });
        const hashedOtp = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: '2m' });
        const response = NextResponse.json({ message: 'otp resend successfully', success: true });
        response.cookies.set('otp', hashedOtp, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 2 * 60 ,
            path: '/'
        });
        return response;
    } catch (error) {
        return NextResponse.json({ message: 'failed to send code', success: false });
    }
}