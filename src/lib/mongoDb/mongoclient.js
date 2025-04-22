import clientPromise from "./connectClient";

export const mongoClient = async () => {
    const client = await clientPromise;
    const collection = client.db("test");
    return collection
}