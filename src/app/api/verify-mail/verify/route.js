import userProfile from "@/models/userProfile";
import bcrypt, { genSalt } from 'bcryptjs';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { connectDb } from "@/lib/mongoDb/connectDb";

export const POST = async (request) => {
    const cookie = await request.cookies;
    const otpToken = cookie.get('otp')?.value;
    const user = cookie.get('user')?.value;
    const userData = (jwt.verify(user, process.env.JWT_SECRET)).user;

    try {
        const { otp } = await request.json();

        const verifyOtp = jwt.verify(otpToken, process.env.JWT_SECRET);

        if (verifyOtp.otp !== otp) {
            return NextResponse.json({ message: 'invalid otp', success: false });
        }
        
        await connectDb();
        const saltPass = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(userData.password, saltPass);
        const user = new userProfile({
            username:userData.username,
            email:userData.email,
            password: hashedPass,
        });
        await user.save();

        const response = NextResponse.json({ message: 'verify successful', success: true });
        
        const accessToken = jwt.sign({ 'user_id': user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        response.cookies.set('user-access', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
        });
        response.cookies.delete('otp');
        response.cookies.delete('user');
        return response;
    } catch (error) {
        return NextResponse.json({ message: 'Please resend code', success: false });
    }
}