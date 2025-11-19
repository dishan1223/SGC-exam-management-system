import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

function generateExamId(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    class: data.class,
    session: data.session,
    examIdDigit: data.examIdDigit,
    createdAt: new Date(),
  });

  const examId = examInsert.insertedId;

  // 2) Get all students from that class
  const students = await db
    .collection("students")
    .find({ class: data.class })
    .toArray();

  const usedIds = new Set();
  const bulkOps = [];

  // 3) Assign examId + unique random examId
  for (const student of students) {
    let studentExamId;

    do {
      studentExamId = generateExamId(data.examIdDigit);
    } while (usedIds.has(studentExamId));

    usedIds.add(studentExamId);

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
  }

  // 4) Execute updates
  if (bulkOps.length > 0) {
    await db.collection("students").bulkWrite(bulkOps);
  }

  return NextResponse.json(
    {
      message: "Exam created",
      exam: {
        _id: examId,
        name: data.name,
        class: data.class,
        session: data.session,
      },
    },
    { status: 200 }
  );
}
