"use client"
import React from "react";
import { IoWarningOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

import { BsHouseDoor, BsBoxArrowRight } from "react-icons/bs";
import { Button } from "@/components/ui/button";
export default function CommingSoon() {
    const router = useRouter();
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-8 text-4xl font-semibold text-[#F4B324] w-full py-4">
      <div className="flex items-center justify-center">
        <IoWarningOutline />
        <span
          style={{
            textShadow:
              "rgb(177, 181, 200) 3px 1px 0px, rgb(198 216 205) 7px 1px 10px, rgb(175 145 145) 3px 1px 2px, rgb(190 220 217) 5px 1px 30px",
          }}
        >
          Comming soon...
        </span>
      </div>
      <Button
        onClick={() => router.back()}
        className="text-xl underline flex items-center gap-1 bg-[#228d2c] p-3 rounded-lg text-white "
      >
        <BsHouseDoor className="text-xl font-semibold" /> Quay lại khóa học
        <BsBoxArrowRight className="text-xl font-semibold ml-4" />
      </Button>
    </div>
  );
}
