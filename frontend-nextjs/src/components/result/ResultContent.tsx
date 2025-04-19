"use client";
import NoResult from "@/components/result/NoResult";
import { Textarea } from "@/components/ui/textarea";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { Evaluate, ResponseException } from "@/types/CustomType";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";

type ResultProps = {
  lessonId: string;
  studentId: string;
  isEvaluated: boolean | undefined;
};
export default function ResultContent({
  lessonId,
  studentId,
  isEvaluated,
}: ResultProps) {
  const { data } = useSWRPrivate<Evaluate | ResponseException>(
    `evaluate?studentId=${studentId}&lessonId=${lessonId}`
  );

  if (data && "status" in data && data.status === 400) return <NoResult />;

  return (
    data &&
    "_id" in data && (
      <div className="w-full">
        <div
          className={`flex flex-col p-5 shadow-xl rounded-lg space-y-4 ${
            isEvaluated ? "border-[#1fc930] border" : ""
          }`}
        >
          <span className=" text-2xl font-semibold text-center">
            Phiếu Đánh Giá Sinh Viên
          </span>
          <div className="flex flex-col space-y-2">
            <span>
              <span className="font-semibold">Họ và tên:</span>{" "}
              <span>{data?.studentId.fullname}</span>
            </span>
            <span>
              <span className="font-semibold">Tên bài học:</span>{" "}
              <span>{data?.lessonId.name}</span>
            </span>
            <span>
              <span className="font-semibold">Điểm:</span>{" "}
              {data && data.score ? (
                <span className="inline-flex items-center gap-2">
                  {data?.score}
                  {+parseFloat(data.score).toFixed(2) > 6 && (
                    <IoMdCheckmarkCircleOutline className="text-[#1d9929]" />
                  )}
                  {+parseFloat(data.score).toFixed(2) <= 6 &&
                    +parseFloat(data.score).toFixed(2) >= 5 && (
                      <IoWarningOutline className="text-amber-500" />
                    )}
                  {+parseFloat(data.score).toFixed(2) < 5 && (
                    <IoWarningOutline className="text-red-600" />
                  )}
                </span>
              ) : (
                <span className="pointer-events-none">Chưa có điểm</span>
              )}
            </span>
            <span className="flex flex-col">
              <span className="font-semibold">Nhận xét của giảng viên:</span>
              <Textarea
                defaultValue={data?.content}
                className="pointer-events-none mt-2"
              />
            </span>
          </div>
        </div>
      </div>
    )
  );
}
