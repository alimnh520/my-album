import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        const collection = (await mongoClient()).collection('publishimages');
        const data = await collection.find({}).toArray();
        if (data) {
            return NextResponse.json({ message: data, success: true });
        }
        return NextResponse.json({ message: 'Loading data', success: false });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to get data', success: false });
    }
}