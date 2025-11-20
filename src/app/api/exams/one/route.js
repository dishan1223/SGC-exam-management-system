import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        const url = new URL(req.url);
        const slug = url.searchParams.get("slug");



        const client = await clientPromise;
        const db = client.db(process.env.DB);
        const exam = await db.collection("exams").findOne({_id: new ObjectId(slug)});



        // students who will be attending this exam;
        const students = await db.collection("students").find({ongoingExamId:new ObjectId(slug)}).toArray();



        return NextResponse.json({exam, students}, {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:"not ok"},{status:500})
    }
}