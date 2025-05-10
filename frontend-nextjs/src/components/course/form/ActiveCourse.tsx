"use client";
import {
  toastNotiFail,
  toastNotiSuccess,
} from "@/components/custom/ToastNotification";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ActiveCourseForm, ActiveCourseType } from "@/types/Type";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { Headers } from "@/constant/constant";
import { CourseInfor } from "@/types/CustomType";
import { ArrowRightIcon } from "lucide-react";


type ActiveCourseProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setCourseActive: Dispatch<SetStateAction<CourseInfor[] | undefined>>;
  _id: string;
};

export default function ActiveCourse({
  setOpen,
  _id,
  setCourseActive,
}: ActiveCourseProps) {
  const form = useForm<ActiveCourseType>({
    resolver: zodResolver(ActiveCourseForm),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: ActiveCourseType) => {
    try {
      const res = await fetchPrivateData("course", {
        method: "POST",
        body: JSON.stringify(values),
        headers: Headers,
      });

      if (res && res.status === 200) {
        toastNotiFail(res.message);
        return;
      }
      toastNotiSuccess(res.message);
      setOpen(false);
      const data = await fetchPrivateData(`course?userId=${_id}`);
      setCourseActive(data);
    } catch (err) {
      console.log(err);
      toastNotiFail("Có lỗi xảy ra khi kích hoạt khóa học!");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex items-center justify-center"
        >
          <div className="space-y-6 p-6 rounded-lg shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 w-full">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-amber-800">
                Kích hoạt khóa học
              </h2>
              <p className="text-sm text-amber-600">
                Nhập mã khóa học để bắt đầu học ngay
              </p>
            </div>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-800 font-medium">
                    Mã khóa học
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
                      placeholder="Nhập mã khóa học của bạn"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2.5 transition-colors"
            >
              <span className="flex items-center justify-center gap-2">
                Kích hoạt khóa học
                <ArrowRightIcon className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </form>
      </Form>
    
    </div>
  );
}
