import { NextResponse } from "next/server"
import bcrypt, { genSalt } from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { cookies } from "next/headers";

export const POST = async (request) => {
    const cookieStore = cookies();
    const user = cookieStore.get('user')?.value;
    const email = (jwt.verify(user, process.env.JWT_SECRET)).user;
    const collection = (await mongoClient()).collection('userprofiles');
    try {
        const { password, confirmPassword } = await request.json();

        if (password.length < 6 || confirmPassword.length < 6) {
            return NextResponse.json({ message: 'required minimum 6 digit', success: false });
        }
        if (password !== confirmPassword) {
            return NextResponse.json({ message: 'password does not match', success: false });
        }
        const genPass = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, genPass);

        await collection.findOneAndUpdate({ email }, {
            $set: {
                password: hashedPass
            }
        });

        const response = NextResponse.json({ message: 'password change successfully', success: true });
        response.cookies.delete('forget-pass');
        response.cookies.delete('user');
        return response

    } catch (error) {
        return NextResponse.json({ message: 'Failed to change password', success: false });
    }
}