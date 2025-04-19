"use client";
import React, { use } from "react";

import FormEvaluate from "@/components/evaluation/FormEvaluate";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { Result } from "@/types/CustomType";
import { useState } from "react";
import { useUserContext } from "@/store/context/AuthContext";
import { UserRole } from "@/constant/constant";
import ResultContent from "@/components/result/ResultContent";
import ContentView from "@/components/result/ContentView";
import Loading from "@/app/(container)/danh-sach-bai-thi-cua-sinh-vien/[slug]/loading";
import MainLayout from "@/components/main-layout";
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
  const searchParam = use(searchParams);
  const slug = param.slug;
  const query = searchParam.lessonId;
  const { user } = useUserContext();
  const [isPreview, setIsPreview] = useState(false);
  const { data, isLoading } = useSWRPrivate<Result>(
    `result?studentId=${slug}&lessonId=${query}`
  );
  if (isLoading) return <Loading />;

  return (
    <MainLayout>
      <div className=" flex items-center justify-start h-fit p-5  xl:px-16 flex-col lg:flex-row gap-5 lg:justify-between">
        <div
          className={`xl:w-[50%] w-full cursor-pointer ${
            isPreview ? " z-50 fixed inset-0 xl:w-full h-full bg-white" : ""
          }`}
          onClick={() => setIsPreview(!isPreview)}
        >
          {data?.content && <ContentView url={data?.content} />}
        </div>

        <div className="xl:w-[40%] w-full  flex justify-center items-center">
          {user.role === UserRole.TEACHER ? (
            <FormEvaluate
              isEvaluated={data?.isEvaluated}
              nameStudent={data?.studentId?.fullname}
              lessonId={data?.lessonId}
              stdentId={data?.studentId._id}
            />
          ) : (
            <ResultContent
              lessonId={query as string}
              studentId={slug}
              isEvaluated={data?.isEvaluated}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
