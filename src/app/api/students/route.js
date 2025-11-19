import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB);

    // database fetching requires awaiting
    const students = await db.collection("students").find().toArray();


    return NextResponse.json(students, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to fetch students" }, { status: 500 });
  }
}
