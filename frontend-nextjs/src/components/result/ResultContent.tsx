"use client";
import NoResult from "@/components/result/NoResult";
import { Textarea } from "@/components/ui/textarea";
import { HttpStatus } from "@/constant/constant";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { Evaluate } from "@/types/CustomType";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";

type ResultProps = {
  lessonId: string;
  studentId: string;
  isEvaluated: boolean | undefined;
};
type ResEvaluate = {
  status: number;
  data: Evaluate;
  message: string;
};
export default function ResultContent({
  lessonId,
  studentId,
  isEvaluated,
}: ResultProps) {
  const { data } = useSWRPrivate<ResEvaluate>(
    `evaluate?studentId=${studentId}&lessonId=${lessonId}`,
  );
  if (data && data?.status === HttpStatus.NOT_FOUND) return <NoResult />;
  const evaluate = data?.data;
  return (
    data?.data &&
    data?.status === HttpStatus.OK && (
      <div className="w-full">
        <div
          className={`flex flex-col space-y-4 rounded-lg p-5 shadow-xl ${
            isEvaluated ? "border border-[#1fc930]" : ""
          }`}
        >
          <span className="text-center text-2xl font-semibold">
            Phiếu Đánh Giá Sinh Viên
          </span>
          <div className="flex flex-col space-y-2">
            <span>
              <span className="font-semibold">Họ và tên:</span>{" "}
              <span>{evaluate?.studentId.fullname}</span>
            </span>
            <span>
              <span className="font-semibold">Tên bài học:</span>{" "}
              <span>{evaluate?.lessonId.name}</span>
            </span>
            <span>
              <span className="font-semibold">Điểm:</span>{" "}
              {evaluate?.score ? (
                <span className="inline-flex items-center gap-2">
                  {evaluate?.score}
                  {+parseFloat(evaluate.score).toFixed(2) > 6 && (
                    <IoMdCheckmarkCircleOutline className="text-[#1d9929]" />
                  )}
                  {+parseFloat(evaluate.score).toFixed(2) <= 6 &&
                    +parseFloat(evaluate.score).toFixed(2) >= 5 && (
                      <IoWarningOutline className="text-amber-500" />
                    )}
                  {+parseFloat(evaluate.score).toFixed(2) < 5 && (
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
                defaultValue={evaluate?.content}
                className="pointer-events-none mt-2"
              />
            </span>
          </div>
        </div>
      </div>
    )
  );
}
