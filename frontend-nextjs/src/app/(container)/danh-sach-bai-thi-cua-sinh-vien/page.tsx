"use client";

import { useSearchParams } from "next/navigation";

import MainLayout from "@/components/main-layout";
import ResultList from "@/components/result/ResultList";

export default function AllResultsFromStudent() {
  const studentId = useSearchParams().get("studentId");

  return (
    <MainLayout>
      <div className="flex w-full flex-col items-center">
        <span className="py-10 text-2xl font-semibold uppercase">
          Kết quả học tập
        </span>
        <ResultList studentId={studentId} />
      </div>
    </MainLayout>
  );
}
