"use client";

import Image from "next/image";
import bgHomePageForStudent from "@/assets/background/homepage/nonbg-01.png";

export default function HomePageForStudent() {
  return (
    <div className="flex flex-col items-center w-screen max-w-full min-h-full">
      <div className="lg:h-[600px] h-[300px] w-full flex  bg-gradient-to-r from-[#090979] from-0% via-[#054c5c] via-[41%]  to-[#090979] to-100% relative flex-col justify-center items-center">
        <Image
          className="absolute inset-0 w-full h-full object-contain object-center py-5"
          src={bgHomePageForStudent}
          alt="image-bg-homepage-student"
        />
        <div className="text-white text-2xl lg:text-6xl font-semibold z-20 mt-[-50px]">
          NỀN TẢNG THỰC HÀNH SỐ AIoT
        </div>
      </div>
    </div>
  );
}
