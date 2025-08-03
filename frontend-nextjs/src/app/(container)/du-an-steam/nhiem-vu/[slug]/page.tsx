"use client";
import Loading from "@/app/loading";
import { FaRegCircleCheck } from "react-icons/fa6";
import UploadFile from "@/components/custom/UploadFile";
import { FaRegClock } from "react-icons/fa6";
import {
  Headers,
  HttpStatus,
  STATUS_TASK,
  StatusComment,
  UpdateMode,
} from "@/constant/constant";
import { IoMdCloudUpload } from "react-icons/io";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { handleGetUserInfor } from "@/store/localStorage";
import { TaskDetail } from "@/types/CustomType";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { toast } from "sonner";
const task = {
  title: "Nộp báo cáo tiến độ tuần 1",
  description:
    "Các thành viên cần hoàn thành báo cáo tiến độ tuần 1, bao gồm các nội dung:\n- Tóm tắt công việc đã làm\n- Gặp khó khăn gì\n- Đề xuất hỗ trợ nếu có",
  deadline: "2024-06-30 23:59",
};

type ResTaskDetail = {
  status: number;
  data: TaskDetail;
};
export default function Page() {
  const q = useSearchParams().get("q");
  const { data, isLoading, mutate } = useSWRPrivate<ResTaskDetail>(
    `steam/task-detail?q=${q}`,
  );
  const [openedFile, setOpenedFile] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const { _id } = handleGetUserInfor();
  const taskDetail = data?.data || null;
  useEffect(() => {
    if (openedFile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openedFile]);
  if (isLoading) {
    return <Loading />;
  }

  // Sau khi qua isLoading, ta có thể kiểm tra taskDetail
  if (!taskDetail || data?.status === HttpStatus.NOT_FOUND) {
    return <div>Không tìm thấy nhiệm vụ</div>;
  }
  const {
    _id: taskId,
    name,
    implementer,
    creator,
    startDate,
    completeTime,
    deadline,
    description,
    status,
    projectId,
    file,
    startTime,
  } = taskDetail;
  const handleChangeStatus = async (value: string, item: any) => {
    const res = await fetchPrivateData(`/steam/change-status-task`, {
      method: "POST",
      body: JSON.stringify({
        taskId,
        status: value,
        fileId: item._id,
      }),
      headers: Headers,
    });
    if (res.status === HttpStatus.OK) {
      mutate();
      toast.success(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-indigo-50 px-2 py-10 sm:px-0">
      <div className="relative mx-auto max-w-2xl space-y-10 rounded-3xl border border-indigo-100 bg-white/90 p-8 shadow-2xl">
        {/* Tiêu đề và deadline */}
        <div className="mb-4 flex w-full flex-col items-center justify-center gap-2">
          <span className="mb-2 flex items-center justify-center">
            {/* icon nhiệm vụ */}
            <span className="rounded-full bg-indigo-100 p-2 shadow-md">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#6366f1" />
                <path
                  d="M8 12.5l2.5 2.5 5-5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>
          <h1 className="flex flex-col items-center gap-1 text-center text-2xl font-extrabold text-indigo-800 drop-shadow-sm">
            <span>{name}</span>
            <span className="text-lg font-semibold text-indigo-500 italic">
              {projectId?.name}
            </span>
          </h1>
        </div>

        <div className="mb-4 flex flex-col items-center justify-between gap-4 font-semibold text-indigo-700 sm:flex-row">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 p-1">
                {/* Icon user cho người tạo */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="#6366f1"
                    strokeWidth="2"
                  />
                  <path
                    d="M4 19c0-2.761 3.582-5 8-5s8 2.239 8 5"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>
                {creator?.fullname}
                <div className="text-xs leading-tight text-slate-500 italic">
                  Người tạo nhiệm vụ
                </div>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-50 p-1">
                {/* Icon user-check cho người đảm nhiệm */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    stroke="#6366f1"
                    strokeWidth="2"
                  />
                  <path
                    d="M4 19c0-2.761 3.582-5 8-5s8 2.239 8 5"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 17l2 2 4-4"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                {implementer?.fullname || "Chưa phân công"}
                <div className="text-xs leading-tight text-slate-500 italic">
                  Người thực hiện nhiệm vụ
                </div>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-1">
              <FaRegClock className="text-base" />
              <span>Ngày bắt đầu:</span>{" "}
              <span className="ml-1 font-bold text-indigo-600">
                {startDate ? format(startDate, "dd/MM/yyyy") : ""}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <FaRegClock className="text-base" />
              <span>Ngày kết thúc:</span>{" "}
              <span className="ml-1 font-bold text-rose-600">
                {deadline ? format(deadline, "dd/MM/yyyy") : ""}
              </span>
            </div>
            
              <div className="flex items-center gap-1">
                <span className="rounded-full shadow-md">
                  <FaRegCircleCheck className="text-base" />
                </span>
                <span>Trạng thái:</span>{" "}
                <span className={`ml-1 font-bold ${status === STATUS_TASK.COMPLETED ? "text-green-600" : "text-amber-600"}`}>
                  {status === STATUS_TASK.COMPLETED
                    ? "Đã hoàn thành"
                    : "Chưa hoàn thành"}
                </span>
              </div>
            
          </div>
        </div>
        {/* Mô tả nhiệm vụ */}
        <div className="flex items-start gap-3 rounded-xl bg-indigo-50/60 p-4 shadow-sm">
          <span className="mt-1 text-indigo-400">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" />
              <path
                d="M12 8v4l3 1"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <div className="mb-1 font-semibold text-indigo-700">
              Mô tả nhiệm vụ
            </div>
            <p className="whitespace-pre-line text-slate-700">{description}</p>
          </div>
        </div>
        <div className="mb-7 flex items-start gap-3 rounded-xl bg-amber-50/80 p-4 shadow-sm">
          <span className="mt-1 text-amber-400">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="4" fill="#fbbf24" />
              <path
                d="M8 12h8M12 8v8"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <div className="mb-1 font-semibold text-amber-700">
              Yêu cầu nhiệm vụ
            </div>
            <div className="whitespace-pre-line text-slate-700">
              {task.description}
            </div>
          </div>
        </div>
        {/* Khu vực nộp bài */}
        {_id !== creator?._id && status !== STATUS_TASK.COMPLETED ? (
          <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-indigo-300 bg-white/80 p-6 shadow-md">
            <div className="mb-2 flex items-center gap-2 text-2xl">
              <IoMdCloudUpload className="text-indigo-700" />
              <span className="font-semibold text-indigo-700">
                Nộp bài tại đây
              </span>
            </div>
            <UploadFile
              endpoint={"uploads/task"}
              mutate={mutate}
              extraFields={{
                _id: taskId,
                submitTime: new Date(),
                name: name,
                mode: UpdateMode.TASK,
              }}
            />
            <span className="mt-1 text-xs text-slate-500">
              Chỉ thành viên dự án mới có thể nộp bài.
            </span>
          </div>
        ) : null}
        {/* Lịch sử nộp bài */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-indigo-800">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" />
              <path
                d="M8 12.5l2.5 2.5 5-5"
                stroke="#6366f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Lịch sử nộp bài
          </h2>
          <ul className="list-none space-y-4 p-0">
            {Array.isArray(file) &&
              [...file].reverse().map((item, idx) => (
                <div key={idx}>
                  <li
                    className={`relative flex flex-col gap-2 rounded-xl border-2 p-4 shadow-lg ${status === STATUS_TASK.COMPLETED ? "border-green-300 bg-green-50/60" : "border-amber-200 bg-yellow-50/60"}`}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {status === STATUS_TASK.COMPLETED ? (
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" fill="#22c55e" />
                            <path
                              d="M8 12.5l2.5 2.5 5-5"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" fill="#fbbf24" />
                            <path
                              d="M12 8v4l3 1"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        <b
                          className={
                            status === STATUS_TASK.COMPLETED
                              ? "text-green-600"
                              : "text-amber-500"
                          }
                        >
                          {status === STATUS_TASK.COMPLETED
                            ? "Đã chấm"
                            : "Chưa chấm"}
                        </b>
                      </span>
                      {status === STATUS_TASK.COMPLETED ? (
                        <span className="text-green-600">
                          {item.status === StatusComment.GOOD
                            ? "Tốt"
                            : item.status === StatusComment.AVERAGE
                              ? "Khá"
                              : "Trung bình"}
                        </span>
                      ) : (
                        <Select
                          onValueChange={(value) =>
                            handleChangeStatus(value, item)
                          }
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="Đánh giá" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={StatusComment.GOOD}>
                              Tốt
                            </SelectItem>
                            <SelectItem value={StatusComment.AVERAGE}>
                              Khá
                            </SelectItem>
                            <SelectItem value={StatusComment.BAD}>
                              Trung bình
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="font-semibold">Thời gian:</span>{" "}
                      <span>
                        {item.submitTime
                          ? format(item.submitTime, "dd/MM/yyyy HH:mm:ss")
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="font-semibold">File đã nộp:</span>
                      <span className="flex items-center gap-1">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <rect
                            x="4"
                            y="4"
                            width="16"
                            height="16"
                            rx="4"
                            fill="#6366f1"
                          />
                          <path
                            d="M8 12h8M12 8v8"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>

                        <span
                          className="cursor-pointer text-indigo-600 hover:underline active:text-indigo-700"
                          onClick={() => setOpenedFile(item)}
                        >
                          {item?.name}
                        </span>
                      </span>
                    </div>

                    {/* Nhận xét và điểm số nếu có */}
                    {/* {sub.score !== null && (
                  <span className="flex items-center gap-1 font-semibold text-indigo-600">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="mr-0.5 align-middle"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#facc15" /></svg>
                    Điểm: {sub.score}
                  </span>
                )} */}
                    {/* {sub.comment && (
                  <div className="mt-2 rounded-md bg-indigo-50 p-2 text-indigo-600 italic">
                    <b>Nhận xét:</b> {sub.comment}
                  </div>
                )} */}
                  </li>
                  {openedFile && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                      <div className="relative flex h-full w-full flex-col overflow-y-auto bg-white">
                        <div className="flex items-center justify-between px-10">
                          <h2 className="mb-2 text-lg font-bold">
                            Báo cáo tiến độ tuần 1
                          </h2>
                          <button
                            className="text-xl text-gray-500 hover:text-indigo-600"
                            onClick={() => setOpenedFile(null)}
                          >
                            &times;
                          </button>
                        </div>
                        <iframe
                          src={openedFile.url}
                          className="w-full flex-1"
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
