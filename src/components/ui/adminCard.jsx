import Image from "next/image";

export default function AdmitCard({
  name,
  roll,
  group,
  section,
  className,
  examId,
  examName,
  phoneNumber,
  session
}) {
  return (
    <div className="border-10 py-2 px-4">
        <div className="w-auto ">
            <div className="flex jusitfy-between min-w-[758px]">
                <div className="flex w-full">
                    <Image src="/logo.jpeg" width={60} height={60} alt="logo"/>
                    <div>
                        <h1 className="text-xl font-semibold">SIRAJGANJ GOVT. COLLEGE</h1>
                        <p>SIRAJGANJ SADAR, SIRAJGANJ</p>
                    </div>
                </div>
                <div>
                    <Image src={"/qrcode.svg"} width={60} height={60} alt="qr code"/>
                </div>
            </div>
            <div className="flex justify-center p-3">
                <div className="p-3 bg-black text-white font-bold rounded-4xl">admit Card</div>    
            </div>
            <div className="flex justify-between">

                <div>
                    <div className="grid grid-cols-[140px_10px_1fr] gap-y-1 text-lg">
                        <span>Name</span>          <span>:</span> <span className="font-bold">{name}</span>
                        <span>Class</span>         <span>:</span> <span>{className}</span>
                        <span>Roll No.</span>      <span>:</span> <span>{roll}</span>
                        <span>Group</span>         <span>:</span> <span>{group}</span>
                        <span>Section</span>       <span>:</span> <span>{section}</span>
                        <span className="text-2xl font-bold">Exam ID</span>       <span>:</span> <span className="font-bold">{examId}</span>
                    </div>
                </div>

                <div>
                    <div className="grid grid-cols-[140px_10px_1fr] gap-y-1 text-lg">
                        <span>Exam Name</span>          <span>:</span> <span className="font-bold">{examName}</span>
                        <span>Year/session</span>         <span>:</span> <span>{session}</span>
                        <span>Mobile No.</span>      <span>:</span> <span>{phoneNumber}</span>
                    </div>
                </div>

            </div>
            {/* <h2>{examName} - {session}</h2>
            <p>Name: {name}</p>
            <p>Roll: {roll}</p>
            <p>Class: {className}</p>
            <p>Section: {section}</p>
            <p>Group: {group}</p>
            <p>Exam ID: {examId}</p> */}
        </div>
    </div>

  );
}
