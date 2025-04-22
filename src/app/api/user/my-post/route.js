import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export const GET = async (request) => {
    const cookie = await request.cookies;
    const user = cookie.get('user-access')?.value;

    try {
        if (user) {
            const userId = (jwt.verify(user, process.env.JWT_SECRET)).user_id;
            const collection = (await mongoClient()).collection('userprofiles');
            const data = await collection.findOne({ _id: new ObjectId(userId) });
            const userCollection = (await mongoClient()).collection('publishimages');
            const myPost = await userCollection.find({username: data.username}).toArray();
            return NextResponse.json({ message: myPost, success: true });
        }
        return NextResponse.json({ message: 'User not register', success: false });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to load data', success: false });
    }
}