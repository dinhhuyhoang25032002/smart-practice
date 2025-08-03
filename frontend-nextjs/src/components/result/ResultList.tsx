"use client";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import NoDataAvailable from "../custom/NoDataAvailable";
import Loading from "@/app/(container)/danh-sach-bai-thi-cua-sinh-vien/loading";
import { useRouter } from "next/navigation";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { Results } from "@/types/CustomType";
import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import moment from "moment-timezone";
import Link from "next/link";
type ResAllResult = {
  status: number;
  message: string;
  data: Array<Results>;
};
type ResultListProps = {
  studentId: string | null;
};
export default function ResultList({ studentId }: ResultListProps) {
  const { data, isLoading } = useSWRPrivate<ResAllResult>(
    studentId ? `result/all-results?studentId=${studentId}` : "",
  );
  const router = useRouter();
  if (data?.data?.length === 0 || data?.status === 404)
    return <NoDataAvailable />;
  if (isLoading) return <Loading />;
  console.log(data);

  return (
    <div className="flex w-full flex-col items-center bg-cyan-50/70 py-5">
      <span className="text-2xl font-semibold uppercase">Khoá học</span>
      <div className="flex w-full flex-wrap justify-center gap-5">
        {data?.data?.length !== 0 &&
          data?.data?.map((item) => (
            <div
              key={item.courseId}
              className="flex w-full flex-col border-b px-5 pb-5"
            >
              <div className="flex w-full items-center justify-between xl:px-20 xl:py-5">
                <span className="text-2xl font-semibold">
                  {item.courseName}
                </span>
                <div className="relative flex items-center justify-center">
                  <span className="inline-block">
                    {item.lessons.length} / {item.lessonNumber} bài đã nộp.
                  </span>
                  <Progress
                    className="absolute bottom-0 left-0 h-1 w-full rounded-full"
                    value={Math.round(
                      (item.lessons.length / item.lessonNumber) * 100,
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-5">
                {item.lessons.length === 0 ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-5">
                    Chưa có kết quả.
                  </div>
                ) : (
                  item.lessons.map((item) => (
                    <div
                      key={item.lessonId}
                      className={`flex w-full flex-col gap-2 rounded border-2 p-3 shadow-xl xl:w-[25%] ${
                        item.isEvaluated
                          ? "border-[#1fc930]"
                          : "border-amber-400"
                      } `}
                    >
                      {item.linkImage && (
                        <div className="relative flex items-center justify-center">
                          <Image
                            src={item.linkImage}
                            alt="image-lesson"
                            width={900}
                            height={900}
                            className="h-[200px] w-full rounded border-2 p-1"
                          />
                          <div className="absolute inset-0 hidden items-center justify-center bg-gray-500/50 opacity-0 transition-opacity duration-200 hover:opacity-100 xl:flex">
                            <Button
                              className="bg-[#239b2f] uppercase hover:bg-[#239b2f]"
                              icon={ArrowRightIcon}
                              effect={"expandIcon"}
                              iconPlacement="right"
                              onClick={() =>
                                router.push(
                                  `/danh-sach-bai-thi-cua-sinh-vien/${item.studentId._id}?lessonId=${item.lessonId}`,
                                )
                              }
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      )}
                      {item.name && (
                        <span>
                          <span className="mr-2 font-semibold">
                            Tên bài học:
                          </span>
                          {item.name}
                        </span>
                      )}
                      {item.studentId.fullname && (
                        <span>
                          <span className="mr-2 font-semibold">
                            Tên sinh viên:
                          </span>
                          {item.studentId.fullname}
                        </span>
                      )}

                      <span className="flex items-center">
                        <span className="mr-2 font-semibold">Trạng thái:</span>
                        {item.isEvaluated ? (
                          <span className="flex items-center gap-2">
                            Đã đánh giá
                            <IoMdCheckmarkCircleOutline className="text-[#1d9929]" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Chưa đánh giá
                            <IoWarningOutline className="text-amber-600" />
                          </span>
                        )}
                      </span>

                      {item.createdAt && (
                        <span>
                          <span className="mr-2 font-semibold">
                            Thời gian nộp bài:
                          </span>
                          {moment
                            .utc("2025-03-22T16:12:56.109Z")
                            .tz("Asia/Ho_Chi_Minh")
                            .locale("vi")
                            .format(
                              "dddd [ngày] D [tháng] M [năm] YYYY HH:mm:ss",
                            )
                            .charAt(0)
                            .toUpperCase() +
                            moment
                              .utc("2025-03-22T16:12:56.109Z")
                              .tz("Asia/Ho_Chi_Minh")
                              .locale("vi")
                              .format(
                                "dddd [ngày] D [tháng] M [năm] YYYY HH:mm:ss",
                              )
                              .slice(1)}
                        </span>
                      )}
                      <Link
                        href={`/danh-sach-bai-thi-cua-sinh-vien/${item.studentId._id}?lessonId=${item.lessonId}`}
                        className="inline-flex w-full items-center justify-end visited:text-purple-600 hover:text-blue-700 hover:underline active:text-purple-600 active:underline xl:hidden"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
