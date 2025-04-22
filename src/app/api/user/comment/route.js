import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb";

export const POST = async (request) => {
    try {
        const { myName, userId, username, postId, comment, image } = await request.json();

        if (myName && userId && username && postId && comment) {
            const userCollection = (await mongoClient()).collection('publishimages');
            await userCollection.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                {
                    $push: {
                        comment: {
                            username: myName,
                            user_image: image,
                            comment,
                            createdAt: new Date()
                        }
                    }
                })
            return NextResponse.json({ message: 'comment', success: true });
        }
        return NextResponse.json({ message: 'login account', success: true });

    } catch (error) {
        return NextResponse.json({ message: 'Failed', success: false });
    }
}
