import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mongoClient } from "@/lib/mongoDb/mongoclient";

export const POST = async (request) => {
    const cookie = await request.cookies;
    const otpToken = cookie.get('otp')?.value;
    try {
        const { otp } = await request.json();

        const verifyOtp = jwt.verify(otpToken, process.env.JWT_SECRET);

        const forgetPass = jwt.sign({'forget-pass': otp}, process.env.JWT_SECRET);

        if (verifyOtp.otp !== otp) {
            return NextResponse.json({ message: 'invalid otp', success: false });
        }
        const response = NextResponse.json({ message: 'verify successful', success: true });
        response.cookies.set('forget-pass', forgetPass, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            path: '/'
        });
        response.cookies.delete('otp');
        return response;
    } catch (error) {
        return NextResponse.json({ message: 'Please resend code', success: false });
    }
}