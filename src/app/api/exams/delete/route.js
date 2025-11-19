import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(req){
    try {
        const data = await req.json();
        const studentId = data._id;

        if(!studentId){
            console.log("missing _id");
            return NextResponse.json({message:"Missing _id"}, {status:500});
        }


        let client = await clientPromise;
        

        const collection = client.db(process.env.DB).collection("exams");
        // delete the document
        const res = await collection.deleteOne({_id: new ObjectId(studentId)});

        // check is delete was a success
        if (res.deletedCount === 1) {
        return NextResponse.json({ message: "Exam deleted successfully" }, { status: 200 });
        } else {
        return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:"error deleting exam"}, {status:500})
    }
    
}