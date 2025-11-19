import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const data = await req.json();

  if (
    !data.name ||
    !data.class ||
    !data.session ||
    !data.examIdDigit
  ) {
    return NextResponse.json(
      { message: "Fill all the fields" },
      { status: 500 }
    );
  }

  const client = await clientPromise;
  const db = client.db(process.env.DB);

  // 1) Insert the exam
  const examInsert = await db.collection("exams").insertOne({
    name: data.name,
    class: Number(data.class),
    session: Number(data.session),
    examIdDigit: Number(data.examIdDigit),
    createdAt: new Date(),
  });

  const examId = examInsert.insertedId;

  // 2) Get all students from that class
  let students = await db
    .collection("students")
    .find({ class: Number(data.class) })
    .toArray();

  // 3) Shuffle students randomly
  students = students
    .map(s => ({ ...s, rand: Math.random() }))
    .sort((a, b) => a.rand - b.rand);

  // 4) Assign sequential exam IDs
  const examIdDigit = Number(data.examIdDigit);
  const formatExamId = n => String(n).padStart(examIdDigit, "0");

  const bulkOps = [];
  let counter = 1;

  for (const student of students) {
    const studentExamId = formatExamId(counter);

    bulkOps.push({
      updateOne: {
        filter: { _id: student._id },
        update: {
          $set: {
            ongoingExamId: examId,
            examId: studentExamId,
          },
        },
      },
    });

    counter++;
  }

  // 5) Execute updates
  if (bulkOps.length > 0) {
    await db.collection("students").bulkWrite(bulkOps);
  }

  return NextResponse.json(
    {
      message: "Exam created",
      exam: {
        _id: examId,
        name: data.name,
        class: Number(data.class),
        session: Number(data.session),
      },
    },
    { status: 200 }
  );
}
