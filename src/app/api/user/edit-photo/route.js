import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import cloudinary from "@/lib/cloudinary/cloudConfig";

export const POST = async (request) => {
    const cookie = await request.cookies;
    const user = cookie.get('user-access').value;
    const userId = (jwt.verify(user, process.env.JWT_SECRET)).user_id;
    const collection = (await mongoClient()).collection('userprofiles');
    const userCollection = (await mongoClient()).collection('publishimages');

    try {
        const {secure_url, public_id} = await request.json();

        const deleteImage = await collection.findOne({ _id: new ObjectId(userId) });

        deleteImage.imageId && await cloudinary.uploader.destroy(deleteImage.imageId.toString());
        
        const user = await collection.findOneAndUpdate({ _id: new ObjectId(userId) }, {
            $set: {
                image: secure_url,
                imageId: public_id
            }
        });
        await userCollection.updateMany({ username: user.username }, {
            $set: {
                userImage: secure_url
            }
        });

        await userCollection.updateMany(
            { "comment.username": user.username },
            {
                $set: {
                    "comment.$[elem].user_image": secure_url
                }
            },
            {
                arrayFilters: [{ "elem.username": user.username }]
            }
        )
        return NextResponse.json({ message: 'Update successful', success: true });
    } catch (error) {
        return NextResponse.json({ message: 'Update failed', success: false });
    }
}