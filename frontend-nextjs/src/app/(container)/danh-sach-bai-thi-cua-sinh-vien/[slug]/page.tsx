"use client";
import React, { use } from "react";

import FormEvaluate from "@/components/evaluation/FormEvaluate";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { Result } from "@/types/CustomType";
import dynamic from "next/dynamic";
import { useUserContext } from "@/store/context/AuthContext";
import { UserRole } from "@/constant/constant";
import ResultContent from "@/components/result/ResultContent";

import Loading from "@/app/(container)/danh-sach-bai-thi-cua-sinh-vien/[slug]/loading";
type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
const PdfView = dynamic(() => import("@/components/result/PdfView"), {
  ssr: false,
});
export default function PdfPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const param = use(params);
  const searchParam = use(searchParams);
  const slug = param.slug;
  const query = searchParam.lessonId;
  const { user } = useUserContext();

  const { data, isLoading } = useSWRPrivate<Result>(
    `result?studentId=${slug}&lessonId=${query}`
  );
  if (isLoading) return <Loading />;


  return (
    <>
      <div className=" flex items-center justify-between  py-5 px-16">
        <div className="w-[50%]">
          {data?.content && <PdfView url={data?.content} />}
        </div>
        <div className="w-[40%]  flex justify-center items-center">
          {user.role === UserRole.TEACHER ? (
            <FormEvaluate
              isEvaluated={data?.isEvaluated}
              nameStudent={data?.studentId.fullname}
              lessonId={data?.lessonId}
              stdentId={data?.studentId._id}
            />
          ) : (
            <ResultContent lessonId={query as string} studentId={slug} />
          )}
        </div>
      </div>
    </>
  );
}
