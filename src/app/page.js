"use client";
export const dynamic = "force-static";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [failModal, setFailModal] = useState(false);
  const router = useRouter();

  async function loginFunction(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const res = await axios.post("/api/login", data);

      if (res.data.message === "OK") {
        router.push("/dashboard");
      } else {
        setFailModal(true);
      }
    } catch (err) {
      console.log(err);
      setFailModal(true);
    }
  }

  return (
    <div className="h-screen w-full flex justify-center items-center relative bg-gray-100">

      {/* MAIN CONTENT */}
      <div
        className={`p-16 border border-gray-300 rounded-xl flex flex-col gap-6 bg-white transition-all duration-300 ${
          failModal ? "opacity-10 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo.jpeg" alt="logo" height={100} width={100} />
          SGC-Exam Management Dashboard
        </div>

        <form onSubmit={loginFunction} className="flex flex-col gap-4">
          <input
            placeholder="username"
            type="text"
            name="username"
            className="border py-2 px-4 rounded-lg border-gray-300"
          />
          <input
            placeholder="password"
            type="password"
            name="password"
            className="border py-2 px-4 rounded-lg border-gray-300"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>

      {/* MODAL */}
      {failModal && (
        <div className="absolute z-50 bg-white p-6 rounded-xl shadow-lg w-[300px] text-center flex flex-col gap-4 animate-fadeIn">
          <h2 className="text-lg font-semibold text-red-500">Login Failed</h2>
          <p className="text-gray-600">Incorrect username or password.</p>

          <button
            onClick={() => setFailModal(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
