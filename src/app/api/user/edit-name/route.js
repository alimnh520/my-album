import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";

export const POST = async (request) => {
    const cookie = await request.cookies;
    const user = cookie.get('user-access').value;
    const userId = (jwt.verify(user, process.env.JWT_SECRET)).user_id;
    const collection = (await mongoClient()).collection('userprofiles');
    const userCollection = (await mongoClient()).collection('publishimages');

    try {
        const { name } = await request.json();
        const searchName = await userCollection.findOne({ username: name });
        if (searchName) {
            return NextResponse.json({ message: 'Name already exits', success: false });
        }
        const user = await collection.findOneAndUpdate({ _id: new ObjectId(userId) }, {
            $set: {
                username: name
            }
        });

        await userCollection.updateMany({ username: user.username }, {
            $set: {
                username: name
            }
        });

        await userCollection.updateMany(
            { "comment.username": user.username },
            {
                $set: {
                    "comment.$[elem].username": name
                }
            },
            {
                arrayFilters: [{ "elem.username": user.username }]
            }
        )

        return NextResponse.json({ message: 'Update successful', success: true });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Update failed', success: false });
    }
}