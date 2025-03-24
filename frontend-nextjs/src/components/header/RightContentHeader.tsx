"use client";

import TooltipAvatar from "@/components/custom/TooltipAvatar";
import { useUserContext } from "@/store/context/AuthContext";
export default function RightContentHeader() {
  const { user } = useUserContext();
  return (
    <div className="content-right w-full flex items-center justify-end text-lg font-medium pl-5 gap-6  xl:pl-0 lg:pl-0">
       <div className="flex items-center gap-2">
        <span className="hidden xl:flex">Xin Chào, {user?.fullname} </span>
        <TooltipAvatar />
      </div>
    </div>
  );
}
