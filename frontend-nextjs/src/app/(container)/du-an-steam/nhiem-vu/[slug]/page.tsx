"use client";
import FormSendResult from "@/components/course/section/FormSendResult";
import React, { useRef, useState } from "react";

const task = {
  title: "Nộp báo cáo tiến độ tuần 1",
  description:
    "Các thành viên cần hoàn thành báo cáo tiến độ tuần 1, bao gồm các nội dung:\n- Tóm tắt công việc đã làm\n- Gặp khó khăn gì\n- Đề xuất hỗ trợ nếu có",
  deadline: "2024-06-30 23:59",
};

const submissionsSample = [
  {
    time: "2024-06-20 20:15",
    status: "Đã chấm",
    score: 9,
    comment: "Báo cáo tốt, cần bổ sung thêm hình ảnh minh hoạ.",
    files: ["baocao_tuan1.pdf"],
  },
  {
    time: "2024-06-18 21:00",
    status: "Chưa chấm",
    score: null,
    comment: null,
    files: ["baocao_tuan1_v1.pdf"],
  },
];

export default function Page() {
  const [submissions, setSubmissions] = useState(submissionsSample);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    setSubmissions([
      {
        time: new Date().toLocaleString("vi-VN"),
        status: "Chưa chấm",
        score: null,
        comment: null,
        files: selectedFiles.map((f) => f.name),
      },
      ...submissions,
    ]);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-10">
      <div className="relative mx-auto max-w-2xl space-y-10 rounded-2xl bg-white p-8 shadow-lg">
        {/* Tiêu đề và deadline */}
        <div className="mb-2 flex w-full items-center justify-center">
          <span className="mr-3 flex items-center">
            {/* icon nhiệm vụ */}
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
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
          <h1 className="m-0 text-center text-3xl font-extrabold text-indigo-800">
            {task.title}
          </h1>
        </div>
        <div className="mb-4 flex items-center font-semibold text-indigo-600">
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            className="mr-1.5"
          >
            <path
              d="M12 8v4l3 1"
              stroke="#6366f1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" />
          </svg>
          Deadline: <span className="ml-1">{task.deadline}</span>
        </div>
        {/* Mô tả nhiệm vụ */}
        <div className="rounded-lg bg-slate-100 p-4">
          <span className="font-semibold text-indigo-600">Mô tả nhiệm vụ</span>
          <p className="text-slate-700">{task.description}</p>
        </div>
        <div className="mb-7 rounded-lg bg-slate-100 p-4 text-base whitespace-pre-line text-slate-700">
          <div className="font-semibold text-indigo-600">Yêu cầu nhiệm vụ</div>
          <div className="text-slate-700">{task.description}</div>
        </div>

        {/* Khu vực nộp bài */}
        <FormSendResult />

        {/* Lịch sử nộp bài */}
        <section>
          <h2 className="mb-3 flex items-center text-xl font-bold text-indigo-800">
            <svg
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              className="mr-1.5"
            >
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
          <ul className="list-none p-0">
            {submissions.map((sub, idx) => (
              <li
                key={idx}
                className="relative mb-4 rounded-lg border border-indigo-200 bg-slate-50 p-4 shadow-lg shadow-indigo-200/20"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="mr-2 flex items-center gap-1">
                    {sub.status === "Đã chấm" ? (
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
                        sub.status === "Đã chấm"
                          ? "text-green-600"
                          : "text-amber-500"
                      }
                    >
                      {sub.status}
                    </b>
                  </span>

                  {sub.score !== null && (
                    <span className="ml-2.5 flex items-center gap-1 font-semibold text-indigo-600">
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="mr-0.5 align-middle"
                      >
                        <path
                          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                          fill="#facc15"
                        />
                      </svg>
                      Điểm: {sub.score}
                    </span>
                  )}
                </div>
                <div className="mb-1 text-sm text-slate-700">
                  <b>Thời gian:</b> {sub.time}
                </div>
                <div className="mb-1 text-sm text-slate-700">
                  <b>File đã nộp:</b> {sub.files.join(", ")}
                </div>
                {sub.comment && (
                  <div className="mt-2 rounded-md bg-indigo-50 p-2 text-indigo-600 italic">
                    <b>Nhận xét:</b> {sub.comment}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
