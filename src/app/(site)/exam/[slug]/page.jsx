"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash, ArrowLeft, FileText, Send } from "lucide-react";
import Link from "next/link";

export default function EXAM() {
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    async function fetchExamDataAndStudents(slug) {
      const res = await axios.get(`/api/exams/one?slug=${slug}`);
      if (res.status === 200) {
        setExam(res.data.exam);

        // Sort students by examIdDigit or roll if needed
        const sortedStudents = res.data.students.sort(
          (a, b) => Number(a.examIdDigit) - Number(b.examIdDigit)
        );
        setStudents(sortedStudents);
      }
    }

    fetchExamDataAndStudents(slug);
  }, [slug]);

  async function deleteStudent(_id, name) {
    const confirmation = window.confirm("Are you sure?");
    if (!confirmation) return;
    try {
      const res = await axios.delete("/api/students/delete", {
        data: { _id, name },
      });

      if (res.status === 200) {
        // this code deletes the student from the DOM
        setStudents(prev => prev.filter(s => s.name !== name));
        alert(`student: ${name} deleted`);
      } else if (res.status === 400) {
        alert("something went wrong. check backend logs");
      } else {
        alert("failed to delete student");
      }
    } catch (error) {
      console.log(error);
      alert("Error Deleting student: check console for error details");
    }
  }

  const sortedStudents = [...students].sort((a, b) => Number(a.examId) - Number(b.examId));
  return (
    <div className="w-full px-6 py-4">
      {/* Back Button */}
      <Link 
        href="/dashboard" 
        className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          {exam ? exam.name : "Loading Exam..."}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex gap-6">
            <div>
              <span className="text-sm text-gray-500">Class</span>
              <p className="font-medium text-gray-900">{exam ? exam.class : "Loading Class..."}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Session</span>
              <p className="font-medium text-gray-900">{exam ? exam.session : "Loading Session..."}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href={`admitCards/${exam ? exam._id : ""}`} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileText size={16} />
              Admit Cards
            </Link>
            <Link 
              href="/results" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Send size={16} />
              Publish Results
            </Link>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStudents.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{i + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.examId}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.roll}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.section}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.group}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      onClick={() => deleteStudent(s._id, s.name)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      title="Delete Student"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}