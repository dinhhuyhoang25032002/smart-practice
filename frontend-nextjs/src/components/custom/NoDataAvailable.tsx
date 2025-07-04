"use client";
import React from "react";
import Image from "next/image";
import { BsBoxArrowRight, BsHouseDoor } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function NoDataAvailable() {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#79c7d3]">
      <div className="flex flex-col justify-center items-center ">
        <div>
          <Image
            alt="404-image"
            src="/assets/images/no-data-available.jpg"
            width={640}
            height={200}
            priority
            className="object-cover object-center rounded-[8px] w-[240px] h-[240px]"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
         
          <span className="text-lg font-semibold">
            Ối!! Trang không tìm thấy dữ liệu
          </span>
          <p className="text-base">
            Xin lỗi nhưng trang hiện tại bạn đang truy cập không có dữ liệu, đã được LOẠI
            BỎ, chưa cập nhật hoặc tạm thời không có.
          </p>
          <Button
            onClick={() => router.back()}
            className="text-xl mt-4 underline flex items-center gap-1 bg-[#228d2c] p-3 rounded-lg text-white "
          >
            <BsHouseDoor className="text-xl font-semibold" /> Quay lại trang trước
            <BsBoxArrowRight className="text-xl font-semibold ml-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
