"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
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

  async function deleteStudent(_id,name){
    const confirmation = window.confirm("Are you sure?");
    if(!confirmation) return;
    try {
      const res = await axios.delete("/api/students/delete",{
        data: {_id,name},
      })

      if(res.status===200){
        // this code deletes the student from the DOM
        setStudents(prev => prev.filter(s => s.name !== name));
        alert(`student: ${name} deleted`)
      }else if(res.status===400){
        alert("something went wrong. check backend logs")
      }
      else{
        alert("failed to delete student")
      }
    } catch (error) {
      console.log(error);
      alert("Error Deleting student: check console for error details")
    }
    
  }



  const sortedStudents = [...students].sort((a, b) => Number(a.examId) - Number(b.examId));
  return (
    <div className="p-8 w-full">

      <Link href={"/dashboard"} className="p-2 button-blue rounded-lg text-white">Back</Link>
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        {exam ? exam.name : "Loading Exam..."}
      </h1>
      <div className="flex justify-between mb-2">
        <div className="flex gap-4">
            <h2><span className="font-bold">Class</span> : {exam ? exam.class : "Loading Class..."}</h2>
            <h2><span className="font-bold">Session</span> : {exam ? exam.session : "Loading Session..."}</h2>
        </div>
        <div className="flex gap-4">
            <Link href={`admitCards/${exam ? exam._id : ""}`} className="bg-[#5BB7D8] text-white font-bold p-2 rounded-lg cursor-pointer">Admit Cards</Link>
            <Link href={"publish"} className="bg-[#5BB7D8] text-white font-bold p-2 rounded-lg cursor-pointer">Publish Results</Link>
        </div>
      </div>


      <div className="button-blue rounded bg-[#5BB7D8] max-h-[80vh] overflow-auto">
        <table className="w-full bg-white">
          <thead className="bg-[#5BB7D8]">
            <tr>
              <th className="p-3 text-center text-white">Serial</th>
              <th className="p-3 text-center text-white">Name</th>
              <th className="p-3 text-center text-white">Exam ID</th>
              <th className="p-3 text-center text-white">Roll</th>
              <th className="p-3 text-center text-white">Section</th>
              <th className="p-3 text-center text-white">Group</th>
              <th className="p-3 text-center text-white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedStudents.map((s, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="px-2 border text-center border-gray-400">{i +1}</td>
                <td className="px-2 border border-gray-400">{s.name}</td>
                <td className="px-2 border text-center border-gray-400">{s.examId}</td>
                <td className="px-2 border text-center border-gray-400">{s.roll}</td>
                <td className="px-2 border text-center border-gray-400">{s.section}</td>
                <td className="px-2 border text-center border-gray-400">{s.group}</td>
                <td className="flex justify-center border border-gray-400 px-2">
                  <button
                    onClick={() => deleteStudent(s._id, s.name)}
                    className="px-2 py-1 bg-rose-200 text-rose-500 font-bold rounded cursor-pointer"
                  >
                    <Trash color="#FF2056"/>
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
