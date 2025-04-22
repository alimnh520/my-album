import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb";

export const POST = async (request) => {
    try {
        const { myName, userId, username, postId } = await request.json();

        if (myName && userId && username && postId) {
            const userCollection = (await mongoClient()).collection('publishimages');
            await userCollection.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                {
                    $addToSet: {
                        liked: myName
                    }
                })

            return NextResponse.json({ message: 'Liked', success: true });
        }
        return NextResponse.json({ message: 'login account', success: true });

    } catch (error) {
        return NextResponse.json({ message: 'Failed', success: false });
    }
}