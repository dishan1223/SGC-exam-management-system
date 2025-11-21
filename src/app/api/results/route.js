import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB);

    // Get query params
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get("exam");
    const group = searchParams.get("group");
    const session = searchParams.get("session");

    // Build query object
    const query = {};
    if (exam) query.exam = exam;
    if (group) query.group = group;
    if (session) query.session = session;

    const results = await db.collection("results")
      .find(query)
      .sort({ roll: 1 }) // optional: sort by roll number
      .toArray();

    return NextResponse.json(results, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error fetching results. Check server logs." },
      { status: 500 }
    );
  }
}
