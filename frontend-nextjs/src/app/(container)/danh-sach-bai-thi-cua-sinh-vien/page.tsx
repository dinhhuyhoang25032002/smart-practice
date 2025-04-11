"use client";

import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { Results } from "@/types/CustomType";
import Image from "next/image";
import { IoWarningOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import moment from "moment-timezone";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import NoDataAvailable from "@/components/custom/NoDataAvailable";

import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Link from "next/link";
import Loading from "@/app/(container)/danh-sach-bai-thi-cua-sinh-vien/loading";
export default function AllResultsFromStudent() {
  const studentId = useSearchParams().get("studentId");
  const { data, isLoading } = useSWRPrivate<Array<Results>>(
    studentId ? `result/all-results?studentId=${studentId}` : ""
  );
  const router = useRouter();
  if (data?.length === 0) return <NoDataAvailable />;
  if (isLoading) return <Loading />;

  return (
    <>
      <div className="flex justify-center items-center w-full h-full gap-5 p-5 flex-col ">
        <span className="uppercase text-2xl font-semibold">
          Danh sách bài đã nộp
        </span>
        <div className="flex flex-wrap gap-5 w-full">
          {data?.map((item) => (
            <div
              key={item._id}
              className={`flex flex-col gap-2 border-2 p-3 xl:w-[25%] w-full rounded ${
                item.isEvaluated ? "border-[#1fc930]" : "border-amber-400"
              } `}
            >
              {item.lessonId.linkImage && (
                <div className="flex justify-center items-center relative">
                  <Image
                    src={item.lessonId.linkImage}
                    alt="image-lesson"
                    width={900}
                    height={900}
                    className="w-full h-[200px] rounded"
                  />
                  <div className="hidden absolute inset-0 bg-gray-500/50 xl:flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <Button
                      className="uppercase bg-[#239b2f] hover:bg-[#239b2f]"
                      icon={ArrowRightIcon}
                      effect={"expandIcon"}
                      iconPlacement="right"
                      onClick={() =>
                        router.push(
                          `/danh-sach-bai-thi-cua-sinh-vien/${item.studentId._id}?lessonId=${item.lessonId._id}`
                        )
                      }
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              )}
              {item.lessonId.name && (
                <span>
                  <span className="mr-2 font-semibold">Tên bài học:</span>
                  {item.lessonId.name}
                </span>
              )}
              {item.studentId.fullname && (
                <span>
                  <span className="mr-2 font-semibold">Tên sinh viên:</span>
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
                  <span className="mr-2 font-semibold">Thời gian nộp bài:</span>
                  {moment
                    .utc("2025-03-22T16:12:56.109Z")
                    .tz("Asia/Ho_Chi_Minh")
                    .locale("vi")
                    .format("dddd [ngày] D [tháng] M [năm] YYYY HH:mm:ss")
                    .charAt(0)
                    .toUpperCase() +
                    moment
                      .utc("2025-03-22T16:12:56.109Z")
                      .tz("Asia/Ho_Chi_Minh")
                      .locale("vi")
                      .format("dddd [ngày] D [tháng] M [năm] YYYY HH:mm:ss")
                      .slice(1)}
                </span>
              )}
              <Link
                href={`/danh-sach-bai-thi-cua-sinh-vien/${item.studentId._id}?lessonId=${item.lessonId._id}`}
                className="xl:hidden inline-flex items-center justify-end w-full visited:text-purple-600 active:text-purple-600 hover:text-blue-700 active:underline hover:underline"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
