// src/app/api/results/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * Query params:
 * ?exam=Exam Name
 * ?session=2025
 * ?subject=Math
 * ?group=Science (optional)
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get("exam");
    const session = searchParams.get("session");
    const subject = searchParams.get("subject");
    const group = searchParams.get("group");

    if (!exam || !session || !subject) {
      return NextResponse.json(
        { message: "Please provide exam, session and subject" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB);
    const collection = db.collection("results");

    // Build filter
    const filter = {
      exam,
      session: session ? Number(session) : undefined,
      ...(group ? { group } : {})
    };

    // Find matching students
    const students = await collection
      .find(filter)
      .toArray();

    // Flatten results for the given subject
    const subjectResults = students
      .map((s) => {
        const subj = s.subjects?.find(
          (subj) => subj.subject.toLowerCase() === subject.toLowerCase()
        );
        if (!subj) return null;

        return {
          studentId: s.studentId,
          name: s.name,
          roll: s.roll,
          group: s.group,
          section: s.section,
          exam: s.exam,
          session: s.session,
          subject: subj.subject,
          mcq: subj.mcq,
          cq: subj.cq,
          obtained: subj.obtained
        };
      })
      .filter(Boolean);

    return NextResponse.json(subjectResults, { status: 200 });
  } catch (err) {
    console.error("Error fetching results:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
