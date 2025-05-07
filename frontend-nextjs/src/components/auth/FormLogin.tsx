"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { LoginBody, LoginBodyType } from "@/types/Type";
import { handleLogin } from "@/services/auth/authService";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { decodeUrl } from "@/utils/encryption-url";
// import { useAuthStore } from "@/store/auth/AuthStore";
import { useState } from "react";
import { toastNotiFail, toastNotiSuccess } from "@/components/custom/ToastNotification";
import { useUserContext } from "@/store/context/AuthContext";

export default function LoginForm() {
  // const { setUser, setIsAuth } = useAuthStore();
  const [isShowPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const query = useSearchParams();
  const { setOpenSheet } = useUserContext();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    const res = await handleLogin(values.email, values.password);
    const queryUrl = query?.get("back_to");
    console.log(res);
    if (res && res.status === 403) {
      toastNotiFail(res.message, "Hãy nhập đúng mật khẩu");
      return;
    }
    if (res && res.status === 400) {
      toastNotiFail(res.message, "Hãy nhập đúng tên tài khoản");
      return;
    }

    const validateJwt: { sub: string; role: string } = jwtDecode(
      res.accessToken
    );
    const user = {
      _id: validateJwt.sub,
      act: res.accessToken,
    };

    localStorage.setItem("s", JSON.stringify(user));
    localStorage.setItem("isAuth", JSON.stringify(true));

    if (queryUrl) {
      const back_to = decodeUrl(queryUrl);
      router.replace(`${back_to}`, {});
    } else {
      form.reset();
      setOpenSheet(false);
      toastNotiSuccess("Đăng nhập thành công!")
    }
  }
  const handleLoginWithGoogle = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_ENDPOINT}/auth/google/login`;
  };

  return (
    <Form {...form}>
      <section className="space-y-4 w-full bg-white h-fit px-5 py-4 rounded-md">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 h-fit py-4 "
        >
          <div className="flex flex-col text-center">
            <span className=" text-xl font-semibold">Đăng nhập</span>
            <span className="">Hoàn thiện thông tin để tiếp tục</span>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl className=" ">
                  <div className="relative">
                    <Input
                      placeholder="Nhập mật khẩu"
                      {...field}
                      type={isShowPassword === true ? "text" : "password"}
                    />
                    {isShowPassword === true ? (
                      <AiOutlineEye
                        className=" absolute top-1/2 right-2  transform  -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!isShowPassword)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="absolute top-1/2 right-2  transform  -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!isShowPassword)}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" flex justify-end items-center  w-full">
            <span className="text-xs font-medium text-end  ">
              Quên mật khẩu
            </span>
          </div>
          <Button
            type="submit"
            className="bg-blue-700 w-full active:opacity-60"
          >
            Đăng nhập
          </Button>
        </form>
        <aside className="space-y-4">
          <div className=" text-center  w-full">
            <span className="">Đăng nhập bằng</span>
            <div className="flex text-3xl xl:px-12 pt-4 justify-around">
              <FaFacebook className="text-[#1877f2] text-4xl cursor-pointer" />

              <FcGoogle
                className="text-4xl cursor-pointer"
                onClick={handleLoginWithGoogle}
              />
              <FaGithub className="text-4xl cursor-pointer" />
            </div>
          </div>
          <div className="text-sm font-medium w-full text-center">
            <span>Bạn chưa có tài khoản?</span>
            <span className="font-semibold ">Đăng kí ngay</span>
          </div>
        </aside>
      </section>
    </Form>
  );
}
