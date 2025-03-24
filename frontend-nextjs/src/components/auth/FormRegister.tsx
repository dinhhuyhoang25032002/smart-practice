"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { RegisterBody, RegisterBodyType } from "@/types/Type";
import { handleSignUp } from "@/services/auth/authService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Dispatch, SetStateAction, useState } from "react";
import {
  toastNotiFail,
  toastNotiSuccess,
} from "@/components/custom/ToastNotification";

type RegisterFormProps = {
  setTab: Dispatch<SetStateAction<string>>;
};
export default function RegisterForm({ setTab }: RegisterFormProps) {
  const [isShowPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(values: RegisterBodyType) {
    
    const res = await handleSignUp(
      values.fullname,
      values.email,
      values.password,
      values.confirmPassword
    );
    if (res && res.status === 400) {
      toastNotiFail(res.message, "Hãy thay đổi địa chỉ email khác");
      return;
    }

    toastNotiSuccess(
      res.message,
      "Hãy đăng nhập để trải nghiệm những dịch vụ tuyệt vời"
    );
    setTab("login");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4  bg-white h-fit px-5 py-4 rounded-md"
      >
        <div className="flex flex-col text-center">
          <span className=" text-xl font-semibold">Đăng kí</span>
          <span className="">Hoàn thiện thông tin để tiếp tục</span>
        </div>
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nhập tên của bạn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Nhập tên email" {...field} />
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
              <FormControl>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhập lại mật khẩu</FormLabel>
              <FormControl>
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
        <Button type="submit" className="bg-blue-700 w-full">
          Đăng kí
        </Button>
        <div className="text-sm font-medium w-full text-center">
          <span>Quay lại đăng nhập?</span>
          <span className="font-semibold ">Đăng nhập ngay</span>
        </div>
      </form>
    </Form>
  );
}
