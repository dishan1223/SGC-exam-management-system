import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const client = await clientPromise;
        const collection = await client.db(process.env.DB).collection("exams").find().toArray();

        return NextResponse.json(collection, {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:"error fetching Exam information"}, {status:500});
    }
}