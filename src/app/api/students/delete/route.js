import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req){
    const data = await req.json();
    const studentId = data._id;

    if(!studentId){
        return NextResponse.json({message:"params: _id or name missing"}, {
            status:400,
        })
    }

    let client;
    try {
        client = await clientPromise;
    } catch (error) {
        return NextResponse.json({message:"Database connection failed"},{status:500});
    }

    let db = client.db(process.env.DB);
    let collection = db.collection("students");

    try {
        const res = await collection.deleteOne({_id: new ObjectId(studentId)});
        if (res.deletedCount === 1) {
            return NextResponse.json({ message: `Student ${data.name} deleted` }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({message:"Failed: check backend logs"},{status:500})
    }
}