import cloudinary from "@/lib/cloudinary/cloudConfig";
import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { NextResponse } from "next/server"

export const POST = async (request) => {
    try {
        const { imageId, postId, type } = await request.json();

        if (type === 'mp4') {
            await cloudinary.uploader.destroy(imageId.toString(), {resource_type: "video"});
        }
        await cloudinary.uploader.destroy(imageId.toString());

        const userCollection = (await mongoClient()).collection('publishimages');

        await userCollection.deleteOne({ post_id: postId });

        return NextResponse.json({ message: 'deleted', success: true });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete', success: false });
    }
}