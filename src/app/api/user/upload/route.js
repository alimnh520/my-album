import { ObjectId } from "mongodb";
import { mongoClient } from "@/lib/mongoDb/mongoclient";
import publishImage from "@/models/publishImage";
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { connectDb } from "@/lib/mongoDb/connectDb";

export const POST = async (request) => {
    const cookie = await request.cookies;
    const user = cookie.get('user-access')?.value;
    const userId = (jwt.verify(user, process.env.JWT_SECRET)).user_id;
    const collection = (await mongoClient()).collection('userprofiles');
    const userCollection = (await mongoClient()).collection('publishimages');

    try {
        const {secure_url, public_id, text, format} = await request.json();
        await connectDb();
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        const postCount = await userCollection.countDocuments();
        const userImage = new publishImage({
            username: user.username,
            userImage: user.image,
            img_url: secure_url,
            format,
            public_id,
            post_id: postCount,
            text
        });
        await userImage.save();

        return NextResponse.json({ message: 'Upload successful', success: true });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to upload', success: false });
    }
}