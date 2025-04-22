import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { emailVerify } from "@/lib/sendMail";
import { mongoClient } from "@/lib/mongoDb/mongoclient";

export const POST = async (request) => {

    try {

        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json({ message: 'required all', success: false });
        }

        const collection = (await mongoClient()).collection('userprofiles');
        const findUser = await collection.findOne({ email });
        const findUserName = await collection.findOne({ username });
        
        if (findUser) {
            return NextResponse.json({ message: 'user already exist', success: false });
        }

        if (findUserName) {
            return NextResponse.json({ message: 'username already exist', success: false });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: 'required minimum 6 digit', success: false });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = jwt.sign({ otp }, process.env.JWT_SECRET, { expiresIn: '2m' });

        await emailVerify({ email, otp });

        const saveUser = jwt.sign({ 'user': { username, email, password } }, process.env.JWT_SECRET);

        const response = NextResponse.json({ message: 'verify user', success: true });
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
        console.log(error)
        return NextResponse.json({ message: 'Failed to signup : ', error, success: false });
    }
}