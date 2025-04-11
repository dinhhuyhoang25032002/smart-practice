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
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Headers } from "@/constant/constant";
export default function ActiveCourse() {
  const router = useRouter();
  const form = useForm<ActiveCourseType>({
    resolver: zodResolver(ActiveCourseForm),
    defaultValues: {
      code: "",
    },
  });
  const onSubmit = async (values: ActiveCourseType) => {
    console.log(values);
    const res = await fetchPrivateData("course", {
      method: "POST",
      body: JSON.stringify(values),
      headers: Headers,
    });

    if (res && res.status === 200) {
      toastNotiFail(res.message);
      router.refresh();
      return;
    }
    toastNotiSuccess(res.message);
    router.refresh();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex items-center justify-center"
      >
        <div className="space-y-5 p-4 rounded-sm shadow-lg bg-amber-200 xl:w-1/4 w-full">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã khóa học</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
