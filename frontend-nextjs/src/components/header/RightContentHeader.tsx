"use client";

import TooltipAvatar from "@/components/custom/TooltipAvatar";
import { useUserContext } from "@/store/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Notification from "../notification/Notification";
// import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import LoginForm from "@/components/auth/FormLogin";
import RegisterForm from "@/components/auth/FormRegister";
export default function RightContentHeader() {
  const { user, setOpenSheet, openSheet } = useUserContext();
  const _id = user?._id;
  const [tab, setTab] = useState("login");

  return (
    <div className="flex w-full items-center justify-end gap-6 pl-0 text-lg font-medium lg:pl-0 xl:justify-center xl:pl-5">
      <div className="flex items-center justify-center gap-10">
        {_id ? (
          <div className="flex items-center gap-2">
            <span className="hidden xl:flex">Xin Chào, {user?.fullname}</span>
            <TooltipAvatar />
            <Notification />
          </div>
        ) : (
          <Sheet open={openSheet} onOpenChange={() => setOpenSheet(!openSheet)}>
            <SheetTrigger
              onClick={() => setOpenSheet(true)}
              className="flex cursor-pointer items-center gap-2 rounded bg-[#D32F2F] p-2 text-base font-medium text-white hover:bg-[#1513be] active:bg-[#1513be]"
            >
              Đăng nhập
            </SheetTrigger>
            <SheetContent className="flex min-w-full items-center justify-center px-5 xl:min-w-1/3">
              <SheetHeader className="hidden">
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
              <Tabs defaultValue="login" value={tab} className="z-10 w-full">
                <TabsList className="h-12 w-full">
                  <TabsTrigger
                    value="login"
                    onClick={() => setTab("login")}
                    className="w-1/2 cursor-pointer py-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                  >
                    Đăng nhập
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    onClick={() => setTab("register")}
                    className="w-1/2 cursor-pointer py-2 data-[state=active]:bg-blue-700 data-[state=active]:text-white"
                  >
                    Đăng kí
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="w-full shadow-xl">
                  <Suspense>
                    <LoginForm />
                  </Suspense>
                </TabsContent>
                <TabsContent value="register" className="w-full">
                  <Suspense>
                    <RegisterForm setTab={setTab} />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>
        )}

        {/* <div className="flex items-center gap-2">
          <span className="hidden xl:flex">Xin Chào, {user?.fullname} </span>
          <TooltipAvatar />
        </div> */}
      </div>
    </div>
  );
}
