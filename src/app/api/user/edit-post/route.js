import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary/cloudConfig";
import { mongoClient } from "@/lib/mongoDb/mongoclient";

export const POST = async (request) => {

    const userCollection = (await mongoClient()).collection('publishimages');

    try {
        const { secure_url, public_id, text, format, post_id, delete_id } = await request.json();

        if (secure_url && public_id && format && delete_id) {
            if (format === 'mp4') {
                await cloudinary.uploader.destroy(delete_id.toString(), { resource_type: "video" });
            }
            await cloudinary.uploader.destroy(delete_id.toString());

            await userCollection.findOneAndUpdate({ post_id }, {
                $set: {
                    img_url: secure_url,
                    public_id,
                    format
                }
            });
        }

        if (text) {
            await userCollection.findOneAndUpdate({ post_id }, {
                $set: {
                    text,
                }
            });
        }

        return NextResponse.json({ message: 'Update successful', success: true });

    } catch (error) {
        return NextResponse.json({ message: 'Update failed', success: false });
    }
}