import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";


export async function POST(req){
    const student = await req.json();

    if(!student.name || !student.roll || !student.phoneNumber || !student.class ||!student.section||!student.group){
        return NextResponse.json({message: "There are missing fields"}, {status:300})
    }
    

    student._id = new ObjectId();


    let client
    try {
        client = await clientPromise;
    } catch (err) {
        return NextResponse.json({ message: "Failed to connect to database" }, { status: 500 });
    }

    const db = client.db(process.env.DB);
    const collection = db.collection("students");


    try {
        await collection.insertOne(student)
    } catch (err) {
        return NextResponse.json({ message: "Cannot insert student" }, { status: 500 });
    }

    
    return NextResponse.json(student,{
        status: 201,
    })
}