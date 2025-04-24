"use client";
import MainLayout from "@/components/main-layout";
import Image from "next/image";
import LoginForm from "@/components/auth/FormLogin";
import bgImage from "@/assets/background/auth/00d8fc7bcb426c1c3553.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";
import RegisterForm from "@/components/auth/FormRegister";
export default function AuthContent() {
  const [tab, setTab] = useState("login");

  return (
    <MainLayout authPage={true}>
      <div className="flex w-screen h-screen max-h-screen justify-center items-center xl:px-40 relative ">
        <Tabs
          defaultValue="login"
          value={tab}
          className="xl:w-[36%] w-[94%] sm:w-[65%] lg:w-[45%] 2xl:w-[30%] z-10"
        >
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
          <TabsContent value="login" className="w-full ">
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

        <div
          className=" h-full lg:flex xl:flex 2xl:flex absolute inset-0 z-0
        before:contenr-[''] before:w-46 before:h-full before:bg-gradient-to-r before:from-[rgba(255,255,255,1)] before:from-0% before:via-[rgba(239,242,239,0.6)] before:via-48% before:to-[rgba(255,255,255,0.2)] before:to-100%  before:absolute before:inset-0 before:z-0
        after:contenr-[''] after:w-46 after:h-full after:bg-gradient-to-r after:from-[rgba(207,230,213,0.08)] after:from-0% after:via-[rgba(239,242,239,0.6)] after:via-48% after:to-[rgba(255,255,255,1)] after:to-100% after:absolute after:top-0 after:right-0 after:z-0"
        >
          <Image
            src={bgImage}
            alt="Cloud-Image"
            priority
            className="w-full h-full object-cover object-center blur-[2px]"
          />
        </div>
      </div>
    </MainLayout>
  );
}
