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

// import { useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import LoginForm from "@/components/auth/FormLogin";
import RegisterForm from "@/components/auth/FormRegister";
export default function RightContentHeader() {
  const { user, setOpenSheet, openSheet } = useUserContext();
  const _id = user?._id;
  const [tab, setTab] = useState("login");

  return (
    <div className="w-full  flex items-center justify-end xl:justify-center text-lg font-medium xl:pl-5 gap-6 pl-0 lg:pl-0">
      <div className="flex items-center gap-10 justify-center">
        {_id ? (
          <div className="flex items-center gap-2">
            <span className="hidden xl:flex">Xin Chào, {user?.fullname}</span>
            <TooltipAvatar />
          </div>
        ) : (
          <Sheet open={openSheet} onOpenChange={() => setOpenSheet(!openSheet)}>
            <SheetTrigger
              onClick={() => setOpenSheet(true)}
              className="rounded bg-[#D32F2F] hover:bg-[#1513be] active:bg-[#1513be] cursor-pointer text-base p-2 text-white font-medium flex items-center gap-2"
            >
              Đăng nhập
            </SheetTrigger>
            <SheetContent className="flex items-center justify-center min-w-full xl:min-w-1/3 px-5 ">
              <SheetHeader className="hidden">
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </SheetDescription>
              </SheetHeader>
              <Tabs defaultValue="login" value={tab} className="w-full z-10">
                <TabsList className="w-full h-12">
                  <TabsTrigger
                    value="login"
                    onClick={() => setTab("login")}
                    className="w-1/2  data-[state=active]:bg-blue-700 data-[state=active]:text-white py-2 cursor-pointer"
                  >
                    Đăng nhập
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    onClick={() => setTab("register")}
                    className="w-1/2 data-[state=active]:bg-blue-700 data-[state=active]:text-white py-2 cursor-pointer"
                  >
                    Đăng kí
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="w-full shadow-xl ">
                  <Suspense>
                    <LoginForm />
                  </Suspense>
                </TabsContent>
                <TabsContent value="register" className=" w-full">
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
