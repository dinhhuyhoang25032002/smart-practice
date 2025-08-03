"use client";
import React, { use } from "react";
import { IoArrowBack } from "react-icons/io5";
import FormEvaluate from "@/components/evaluation/FormEvaluate";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { Result } from "@/types/CustomType";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserContext } from "@/store/context/AuthContext";
import { UserRole } from "@/constant/constant";
import ResultContent from "@/components/result/ResultContent";
import ContentView from "@/components/result/ContentView";
import Loading from "@/app/(container)/danh-sach-bai-thi-cua-sinh-vien/[slug]/loading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function PdfPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const param = use(params);
  const router = useRouter();
  const searchParam = use(searchParams);
  const slug = param.slug;
  const query = searchParam.lessonId;
  const { user } = useUserContext();
  const { data, isLoading } = useSWRPrivate<Result>(
    `result?studentId=${slug}&lessonId=${query}`,
  );
  if (isLoading) return <Loading />;

  return (
    <div className="flex h-screen max-h-screen flex-col items-center justify-start gap-3 pt-5">
      <div className="flex w-full items-center justify-between px-3">
        <Button
          className="h-fit rounded bg-gray-400 px-5 py-1"
          onClick={router.back}
        >
          <IoArrowBack />
        </Button>

        <Dialog>
          <DialogTrigger className="inline-flex h-10 cursor-pointer items-center gap-2 rounded border border-gray-500 bg-white p-2 text-black hover:bg-[#041ec4] hover:text-white">
            {user.role === UserRole.TEACHER ? "Chấm điểm" : "Xem điểm"}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center">
                {user.role === UserRole.TEACHER
                  ? "Đánh giá sinh viên."
                  : "Kết quả bài tập."}
              </DialogTitle>
              <DialogDescription className="text-center">
                {user.role === UserRole.TEACHER
                  ? "Hoàn thành tất cả thông tin để đánh giá."
                  : "Kết quả đánh giá chi tiết từ giáo viên."}
              </DialogDescription>
            </DialogHeader>
            {user.role === UserRole.TEACHER ? (
              <FormEvaluate
                isEvaluated={data?.isEvaluated}
                nameStudent={data?.studentId?.fullname}
                lessonId={data?.lessonId}
                stdentId={data?.studentId._id}
              />
            ) : (
              <ResultContent
                lessonId={data?.lessonId as string}
                studentId={slug}
                isEvaluated={data?.isEvaluated}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className={`h-full w-full cursor-pointer`}>
        {data?.url && <ContentView url={data?.url} />}
      </div>

      {/* <div className="fixed flex w-full items-center justify-center">
       
      </div> */}
    </div>
  );
}
