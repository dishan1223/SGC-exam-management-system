import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ message: "Payload must be an array" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB);
    const collection = db.collection("results");

    let insertedCount = 0;
    let updatedCount = 0;
    let subjectInsertedCount = 0;
    let subjectUpdatedCount = 0;

    for (const entry of data) {
      const { studentId, name, roll, group, section, exam, session, subjects } = entry;

      if (!studentId || !exam) continue;

      const subjectsArr = Array.isArray(subjects) ? subjects : [];

      // Upsert the student's result document
      // use nullish check for session so explicit null/empty handling is up to you
      const baseFilter = { studentId, exam, ...(session !== undefined ? { session } : {}) };

      const ensureRes = await collection.updateOne(
        baseFilter,
        {
          // Only fields that must only be present on insert:
          $setOnInsert: {
            studentId,
            exam,
            ...(session !== undefined ? { session } : {}),
            subjects: [],
            createdAt: new Date()
          },
          // Fields to set/refresh on every call (including an insert--$set applies on insert too),
          // but note we must NOT repeat the same field in $setOnInsert.
          $set: {
            name,
            roll,
            group,
            section,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      // Properly detect insert vs update
      if (ensureRes.upsertedId) {
        insertedCount++;
      } else if (ensureRes.modifiedCount && ensureRes.modifiedCount > 0) {
        updatedCount++;
      }

      // Loop through subjects
      for (const subjObj of subjectsArr) {
        if (!subjObj?.subject) continue;

        const subjName = subjObj.subject;
        const mcq = Number(subjObj.mcq ?? 0);
        const cq = Number(subjObj.cq ?? 0);
        const obtained = mcq + cq;
        const totalMCQ = Number(subjObj.totalMCQ ?? 0);
        const totalCQ = Number(subjObj.totalCQ ?? 0);
        const totalMarks = totalMCQ + totalCQ;

        // Try to update existing subject entry
        const updateRes = await collection.updateOne(
          { ...baseFilter, "subjects.subject": subjName },
          {
            $set: {
              "subjects.$.mcq": mcq,
              "subjects.$.cq": cq,
              "subjects.$.obtained": obtained,
              "subjects.$.totalMCQ": totalMCQ,
              "subjects.$.totalCQ": totalCQ,
              "subjects.$.totalMarks": totalMarks,
              "subjects.$.updatedAt": new Date()
            },
            $setOnInsert: { updatedAt: new Date() }
          }
        );

        // If subject exists, do NOT push; count only when modified
        if (updateRes.matchedCount && updateRes.matchedCount > 0) {
          if (updateRes.modifiedCount && updateRes.modifiedCount > 0) {
            subjectUpdatedCount++;
          }
          continue;
        }

        // Subject doesn't exist → push it
        const pushRes = await collection.updateOne(
          baseFilter,
          {
            $push: {
              subjects: {
                subject: subjName,
                mcq,
                cq,
                obtained,
                totalMCQ,
                totalCQ,
                totalMarks,
                addedAt: new Date()
              }
            },
            $set: { updatedAt: new Date() }
          }
        );

        if (pushRes.modifiedCount && pushRes.modifiedCount > 0) {
          subjectInsertedCount++;
        }
      }
    }

    return NextResponse.json(
      { message: "Publish complete", insertedCount, updatedCount, subjectInsertedCount, subjectUpdatedCount },
      { status: 201 }
    );
  } catch (err) {
    console.error("publish route error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}