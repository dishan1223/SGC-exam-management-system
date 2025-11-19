"use client";
import axios from "axios";
import { useParams } from "next/navigation"
import { useEffect } from "react";

export default function EXAM(){
    const params = useParams();
    const slug = params.slug;

    useEffect(()=>{
        async function fetchExamDataAndStudents(slug){
            const res = axios.get(`/api/exams/one?slug=${slug}`);
            if(res.status === 200){
                alert("success");
            }
        }

        fetchExamDataAndStudents(slug);
    })


    return (
        <div className="flex justify-center items-center h-screen">
            <div>{slug}</div>
        </div>
    )
}