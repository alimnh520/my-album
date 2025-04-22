import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { mongoClient } from "@/lib/mongoDb/mongoclient";

export const POST = async (request) => {
    const collection = (await mongoClient()).collection('userprofiles');
    try {
        const { email, password, rememberMe } = await request.json();

        const data = await collection.findOne({ email });
        if (!data) {
            return NextResponse.json({ message: 'User not found', success: false });
        }
        const validPass = await bcrypt.compare(password, data.password);
        if (!validPass) {
            return NextResponse.json({ message: 'Invalid password', success: false });
        }

        const response = NextResponse.json({ message: 'Login success', success: true });
        const accessToken = jwt.sign({ 'user_id': data._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        response.cookies.set('user-access', accessToken, {
            httpOnly: true,
            source: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
        });
        response.cookies.delete('user');
        return response
    } catch (error) {
        return NextResponse.json({ message: 'Login failed', success: false });
    }
}