import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        const url = new URL(req.url);
        const slug = url.searchParams.get("slug");
        console.log(slug)


        const client = await clientPromise;
        const db = client.db(process.env.DB);
        const exam = await db.collection("exams").findOne({_id: new ObjectId(slug)});

        console.log(exam);

        // students who will be attending this exam;
        const students = await db.collection("students").find({examId})

        return NextResponse.json({message: "OK"}, {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse({message:"not ok"},{status:500})
    }
}