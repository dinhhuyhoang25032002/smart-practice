"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EvaluateForm, EvaluationType } from "@/types/Type";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/store/context/AuthContext";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { toast } from "sonner";

type FormEvaluateProps = {
  nameStudent: string | undefined;
  lessonId: string | undefined;
  stdentId: string | undefined;
  isEvaluated: boolean | undefined;
};
export default function FormEvaluate({
  nameStudent,
  stdentId,
  lessonId,
  isEvaluated,
}: FormEvaluateProps) {
  const { user } = useUserContext();
  const form = useForm<EvaluationType>({
    resolver: zodResolver(EvaluateForm),
    defaultValues: {
      score: "",
      content: "",
    },
  });

  async function onSubmit(values: EvaluationType) {
    console.log(values);
    const res = await fetchPrivateData("evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        lessonId,
        studentId: stdentId,
      }),
    });
    if (res.status === 201 || res.status === 200) {
      toast.success("Đã gửi đánh giá thành công");
      form.reset();
    } else {
      toast.error("Gửi đánh giá thất bại", {
        description: "Xem lại thông tin đã nhập",
      });
    }
  }
  return (
    <div className={`w-full`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <span className="block text-center text-xl font-semibold uppercase">
            Phiếu đánh giá sinh viên
          </span>
          <div>
            <span className="font-semibold">Tên sinh viên: </span>
            <span className="pointer-events-none">{nameStudent}</span>
          </div>
          <div>
            <span className="font-semibold">Tên giảng viên: </span>
            <span className="pointer-events-none">{user.fullname}</span>
          </div>

          <FormField
            control={form.control}
            name="score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Điểm</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập điểm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhận xét</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Nhập nhận xét" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={`flex w-full items-center ${
              isEvaluated ? "justify-between" : "justify-end"
            }`}
          >
            {isEvaluated && (
              <span className="flex items-center gap-2">
                Đã đánh giá{" "}
                <IoMdCheckmarkCircleOutline className="text-[#1d9929]" />
              </span>
            )}
            <Button type="submit" className="active:opacity-60">
              {isEvaluated ? "Cập nhật lại" : "Nộp đánh giá"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
