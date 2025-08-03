"use client";
import React from "react";
import Image from "next/image";
import { BsBoxArrowRight, BsHouseDoor } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export default function NoDataAvailable() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#79c7d3]">
      <div className="flex flex-col items-center justify-center">
        <div>
          <Image
            alt="404-image"
            src="/assets/images/no-data-available.jpg"
            width={640}
            height={200}
            priority
            className="h-[200px] w-[200px] rounded-[8px] object-contain object-center"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <span className="text-lg font-semibold">
            Ối!! Trang không tìm thấy dữ liệu
          </span>
          <div className="flex flex-col items-center justify-center gap-4 text-base">
            Xin lỗi nhưng trang hiện tại bạn đang truy cập không có dữ liệu,
            chưa cập nhật hoặc tạm thời không có.
            <span className="animate-gradient-flow bg-[linear-gradient(to_right,#24348C_0%,#F07F29_25%,#24348C_50%,#F07F29_75%,#24348C_100%)] bg-[length:200%_auto] bg-clip-text text-5xl text-transparent uppercase [--animation-duration:20s]">
              Coming soon...
            </span>
          </div>
          <Button
            onClick={() => router.back()}
            effect={"expandIcon"}
            icon={BsBoxArrowRight}
            iconPlacement="right"
            className="flex items-center gap-1 rounded-lg bg-[#228d2c] p-3 text-xl text-white"
          >
            <BsHouseDoor className="text-xl font-semibold" /> Quay lại trang
            trước
          </Button>
        </div>
      </div>
    </div>
  );
}
