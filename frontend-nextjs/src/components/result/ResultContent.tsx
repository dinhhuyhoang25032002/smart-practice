"use client";
import { Textarea } from "@/components/ui/textarea";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { Evaluate } from "@/types/CustomType";

type ResultProps = {
  lessonId: string;
  studentId: string;
};
export default function ResultContent({ lessonId, studentId }: ResultProps) {
  const { data } = useSWRPrivate<Evaluate>(
    `evaluate?studentId=${studentId}&lessonId=${lessonId}`
  );
  return (
    <div className="w-full">
      <div className="flex flex-col p-5 shadow-xl rounded-lg space-y-4">
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
            <span>{data?.score}</span>
          </span>
          <span className="flex flex-col">
            <span className="font-semibold">Nhận xét của giảng viên:</span>{" "}
            <Textarea defaultValue={data?.content} className="pointer-events-none mt-2"/>
          </span>
        </div>
      </div>
    </div>
  );
}
