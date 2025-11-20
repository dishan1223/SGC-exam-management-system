"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import AdmitCard from "@/components/ui/adminCard";

export default function AdmitCardPage(){
    const [exam, setExam] = useState([]);
    const [students, setStudents] = useState([]);
    const param = useParams();
    const slug = param.slug;


    const sortedStudents = [...students].sort((a, b) => Number(a.examId) - Number(b.examId));
    useEffect(() =>{
        async function FetchExamsAndStudents(){
            try {
                const res = await axios.get(`/api/exams/one?slug=${slug}`);
                if(res.status===200){
                    setExam(res.data.exam);
                    setStudents(res.data.students);
                }else if(res.status===500){
                    alert("Failed to fetch data from backend. /api/exams/one?slug={}")
                }
            } catch (error) {
                alert("something went wrong. check console")
                console.log(error)
            }
        }

        FetchExamsAndStudents();
    }, []);


    return (
        <div className="h-screen w-full flex justify-center">
            <div className="flex flex-col print-container">
                {sortedStudents.map((s,i) => (
                    <div key={i} className="admit-wrapper">
                        <AdmitCard
                            name={s.name}
                            roll={s.roll}
                            group={s.group}
                            section={s.section}
                            className={s.class}
                            examId={s.examId}
                            examName={exam.name}
                            session={exam.session}
                            phoneNumber={s.phoneNumber}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}