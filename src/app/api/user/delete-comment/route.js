import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { NextResponse } from "next/server"

export const POST = async (request) => {
    try {
        const { comment, postId, username } = await request.json();
        if (comment && postId && username) {
            const userCollection = (await mongoClient()).collection('publishimages');
            await userCollection.findOneAndUpdate({ post_id: postId }, {
                $pull: {
                    comment: { comment: comment }
                }
            });

            return NextResponse.json({ message: 'deleted', success: true });
        }
        return NextResponse.json({ message: 'login user', success: true });
    } catch (error) {
        return NextResponse.json({ message: 'deleted', success: false });
    }
}