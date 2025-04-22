import { mongoClient } from "@/lib/mongoDb/mongoclient";
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb";

export const POST = async (request) => {
    try {
        const { username } = await request.json();

        const data = ''
        return NextResponse.json({ message: data, success: true });

    } catch (error) {
        return NextResponse.json({ message: 'Failed', success: false });
    }
}