import {NextResponse} from "next/server";
import clientPromise from "@/lib/mongodb"

export async function POST(req){
	try{
		const data = await req.json();
		
		if (!Array.isArray(data) || data.length === 0) {
		  return NextResponse.json({ message: "No results to insert" }, { status: 400 });
		}

		console.log(data);

		const client = await clientPromise;
		const db = client.db(process.env.DB);

		// NOTE: a new mongodb collection for storing all results of the students
		// previously by mistake i inserted the datas to my existing exams collection
		const res = await db.collection("results").insertMany(data); 

		return NextResponse.json({message:"Exams Inserted to database",insertedCount:res.insertedCount}, {status: 201});
	}catch(error){
		console.log(error)
		return NextResponse.json({message: "Error saving results information. Check server logs"}, {status:500});
	}
}