"use client";

import TooltipAvatar from "@/components/custom/TooltipAvatar";
import { useUserContext } from "@/store/context/AuthContext";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function RightContentHeader() {
  const { user } = useUserContext();
  const router = useRouter();
  return (
    <div className="content-right w-full flex items-center justify-end text-lg font-medium pl-5 gap-6  xl:pl-0 lg:pl-0">
      <div className="flex items-center gap-10">
        <Button
          className="rounded bg-[#D32F2F] hover:bg-[#239b2f] active:opacity-55 px-5 "
          effect={"expandIcon"}
          icon={ArrowRightIcon}
          iconPlacement="right"
          onClick={() => router.push(`/dang-nhap`)}
        >
          Đăng nhập
        </Button>
        <div className="flex items-center gap-2">
          <span className="hidden xl:flex">Xin Chào, {user?.fullname} </span>
          <TooltipAvatar />
        </div>
      </div>
    </div>
  );
}
