"use client";
import React, { useState } from "react";
import ProjectReportPDF from "@/components/pdf/ProjectReportPDF";

// Dữ liệu mẫu cho báo cáo thành tích
const projectData = {
  name: "Dự án IoT Smart Home",
  description:
    "Xây dựng hệ thống nhà thông minh sử dụng ESP8266 và các cảm biến",
  startDate: "2024-01-15",
  endDate: "2024-06-30",
  status: "Hoàn thành",
  totalScore: 85,
  members: [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Team Leader",
      email: "nguyenvana@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
      contributions: [
        "Thiết kế kiến trúc hệ thống",
        "Quản lý dự án và phân công công việc",
        "Lập trình backend API",
        "Viết tài liệu kỹ thuật",
      ],
      strengths: [
        "Kỹ năng lãnh đạo tốt",
        "Kiến thức chuyên môn vững",
        "Khả năng giải quyết vấn đề",
      ],
      weaknesses: [
        "Cần cải thiện kỹ năng giao tiếp",
        "Đôi khi quá tập trung vào chi tiết",
      ],
      score: 92,
      grade: "A+",
      evaluation:
        "Thành viên xuất sắc, đóng góp quan trọng cho sự thành công của dự án. Có khả năng lãnh đạo tốt và kiến thức chuyên môn vững chắc.",
      recommendations:
        "Nên tham gia các khóa học về kỹ năng mềm để phát triển toàn diện hơn.",
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Frontend Developer",
      email: "tranthib@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
      contributions: [
        "Thiết kế giao diện người dùng",
        "Phát triển ứng dụng web",
        "Tối ưu hóa trải nghiệm người dùng",
        "Testing và debug",
      ],
      strengths: [
        "Kỹ năng thiết kế UI/UX tốt",
        "Làm việc nhóm hiệu quả",
        "Sáng tạo trong giải pháp",
      ],
      weaknesses: ["Cần học thêm về backend", "Đôi khi thiếu kiên nhẫn"],
      score: 88,
      grade: "A",
      evaluation:
        "Thành viên có năng lực tốt trong lĩnh vực frontend, sáng tạo và có tinh thần làm việc nhóm cao.",
      recommendations:
        "Nên mở rộng kiến thức về backend để trở thành fullstack developer.",
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Hardware Engineer",
      email: "levanc@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
      contributions: [
        "Thiết kế mạch điện",
        "Lắp ráp và kết nối cảm biến",
        "Tối ưu hóa hiệu suất hệ thống",
        "Bảo trì và sửa chữa",
      ],
      strengths: [
        "Kiến thức phần cứng vững chắc",
        "Tỉ mỉ và cẩn thận",
        "Khả năng xử lý sự cố tốt",
      ],
      weaknesses: [
        "Cần cải thiện kỹ năng lập trình",
        "Đôi khi chậm trong việc thích ứng",
      ],
      score: 85,
      grade: "A",
      evaluation:
        "Thành viên có kiến thức chuyên sâu về phần cứng, đóng góp quan trọng cho việc xây dựng hệ thống IoT.",
      recommendations:
        "Nên học thêm về lập trình để có thể tự động hóa các quy trình.",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      role: "Data Analyst",
      email: "phamthid@email.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
      contributions: [
        "Phân tích dữ liệu cảm biến",
        "Tạo báo cáo và biểu đồ",
        "Tối ưu hóa thuật toán",
        "Đánh giá hiệu suất hệ thống",
      ],
      strengths: [
        "Kỹ năng phân tích dữ liệu tốt",
        "Tư duy logic mạnh",
        "Khả năng trình bày rõ ràng",
      ],
      weaknesses: [
        "Cần cải thiện kỹ năng giao tiếp",
        "Đôi khi quá tập trung vào số liệu",
      ],
      score: 82,
      grade: "B+",
      evaluation:
        "Thành viên có khả năng phân tích dữ liệu tốt, đóng góp quan trọng cho việc đánh giá hiệu suất hệ thống.",
      recommendations:
        "Nên tham gia các khóa học về kỹ năng giao tiếp và thuyết trình.",
    },
  ],
};

export default function Page() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  const handleGeneratePDF = () => {
    setShowPDFModal(false);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "text-green-600 bg-green-100";
      case "A":
        return "text-blue-600 bg-blue-100";
      case "B+":
        return "text-yellow-600 bg-yellow-100";
      case "B":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-red-600 bg-red-100";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-indigo-800">
            Báo Cáo Thành Tích Dự Án
          </h1>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold text-indigo-700">
              {projectData.name}
            </h2>
            <p className="mb-4 text-gray-600">{projectData.description}</p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {projectData.startDate} - {projectData.endDate}
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {projectData.status}
              </span>
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Điểm tổng thể: {projectData.totalScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowPDFModal(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-indigo-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Xuất PDF
          </button>
        </div>

        {/* Members Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectData.members.map((member) => (
            <div
              key={member.id}
              className="cursor-pointer rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
              onClick={() => setSelectedMember(member.id)}
            >
              <div className="mb-4 flex items-center gap-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-16 w-16 rounded-full border-4 border-indigo-100"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${getGradeColor(member.grade)}`}
                >
                  {member.grade}
                </span>
                <span
                  className={`text-2xl font-bold ${getScoreColor(member.score)}`}
                >
                  {member.score}
                </span>
              </div>

              <p className="line-clamp-3 text-sm text-gray-600">
                {member.evaluation}
              </p>
            </div>
          ))}
        </div>

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chi Tiết Đánh Giá
                </h2>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {(() => {
                const member = projectData.members.find(
                  (m) => m.id === selectedMember,
                );
                if (!member) return null;

                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-6 rounded-lg bg-indigo-50 p-6">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-20 w-20 rounded-full border-4 border-white"
                      />
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {member.name}
                        </h3>
                        <p className="text-lg text-indigo-600">{member.role}</p>
                        <p className="text-gray-600">{member.email}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <div
                          className={`inline-block rounded-full px-4 py-2 text-lg font-bold ${getGradeColor(member.grade)}`}
                        >
                          {member.grade}
                        </div>
                        <div
                          className={`mt-2 text-3xl font-bold ${getScoreColor(member.score)}`}
                        >
                          {member.score}/100
                        </div>
                      </div>
                    </div>

                    {/* Contributions */}
                    <div className="rounded-lg bg-green-50 p-6">
                      <h4 className="mb-4 text-lg font-semibold text-green-800">
                        Đóng Góp Chính
                      </h4>
                      <ul className="space-y-2">
                        {member.contributions.map((contribution, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <svg
                              className="mt-1 h-5 w-5 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-green-700">
                              {contribution}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-lg bg-blue-50 p-6">
                        <h4 className="mb-4 text-lg font-semibold text-blue-800">
                          Điểm Mạnh
                        </h4>
                        <ul className="space-y-2">
                          {member.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <svg
                                className="mt-1 h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span className="text-blue-700">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-lg bg-orange-50 p-6">
                        <h4 className="mb-4 text-lg font-semibold text-orange-800">
                          Cần Cải Thiện
                        </h4>
                        <ul className="space-y-2">
                          {member.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <svg
                                className="mt-1 h-5 w-5 text-orange-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              <span className="text-orange-700">
                                {weakness}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Evaluation */}
                    <div className="rounded-lg bg-indigo-50 p-6">
                      <h4 className="mb-4 text-lg font-semibold text-indigo-800">
                        Đánh Giá Tổng Quan
                      </h4>
                      <p className="leading-relaxed text-indigo-700">
                        {member.evaluation}
                      </p>
                    </div>

                    {/* Recommendations */}
                    <div className="rounded-lg bg-purple-50 p-6">
                      <h4 className="mb-4 text-lg font-semibold text-purple-800">
                        Khuyến Nghị
                      </h4>
                      <p className="leading-relaxed text-purple-700">
                        {member.recommendations}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* PDF Modal */}
        {showPDFModal && (
          <ProjectReportPDF 
            projectData={projectData} 
            onGeneratePDF={handleGeneratePDF}
          />
        )}
      </div>
    </div>
  );
}
