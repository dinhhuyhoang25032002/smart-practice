"use client";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { SteamProjectInfo, SteamTaskInfo } from "@/types/CustomType";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useUserContext } from "@/store/context/AuthContext";
import { useRef, useState } from "react";

interface ProjectReportPDFProps {
  projectData: SteamProjectInfo;
  tasksData?: SteamTaskInfo[];
  onGeneratePDF: () => void;
}

const ProjectReportPDF: React.FC<ProjectReportPDFProps> = ({
  projectData,
  tasksData = [],
  onGeneratePDF,
}) => {
  const fullContentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUserContext();

  // Kiểm tra xem người dùng hiện tại có phải là trưởng dự án không
  const isProjectLeader = user._id === projectData.leader?._id;

  // Tìm thông tin thành viên hiện tại trong dự án
  const currentMember = projectData.listMember?.find(
    (member) => member.memberId._id === user._id,
  );

  // Lọc nhiệm vụ của thành viên hiện tại (nếu không phải trưởng dự án)
  const currentUserTasks = isProjectLeader
    ? tasksData
    : tasksData.filter((task) => task.implementer?._id === user._id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "IN_PROGRESS":
        return "text-blue-600 bg-blue-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Hoàn thành";
      case "IN_PROGRESS":
        return "Đang thực hiện";
      case "PENDING":
        return "Chờ thực hiện";
      default:
        return "Không xác định";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "LEADER_TEAM":
        return "Trưởng nhóm";
      case "MEMBER":
        return "Thành viên";
      default:
        return role;
    }
  };

  const calculateCompletionRate = () => {
    if (projectData.totalProjectTasks === 0) return 0;
    return Math.round(
      (projectData.completedProjectTasks / projectData.totalProjectTasks) * 100,
    );
  };

  const calculatePersonalCompletionRate = () => {
    if (!currentMember) return 0;
    const totalTasks =
      currentMember.completedTasksCount + currentMember.inProgressTasksCount;
    if (totalTasks === 0) return 0;
    return Math.round((currentMember.completedTasksCount / totalTasks) * 100);
  };

  const generatePDF = async () => {
    if (!fullContentRef.current) return;

    setIsGenerating(true);

    try {
      const pdf = new jsPDF();
      const margin = 15;
      const pageWidth = pdf.internal.pageSize.getWidth();
      //const pageHeight = pdf.internal.pageSize.getHeight();

      // Helper function để render section lên PDF
      const renderSectionToPDF = async (
        element: HTMLElement,
        isFirstPage = false,
      ) => {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          allowTaint: true,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const imgWidth = pageWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (!isFirstPage) pdf.addPage();
        pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight);
      };

      // 1. Header và Overview
      const overview = fullContentRef.current.querySelector(
        ".pdf-overview-section",
      ) as HTMLElement;
      if (overview) await renderSectionToPDF(overview, true);

      // 2. Member Performance (chỉ hiển thị cho trưởng dự án hoặc thành viên cá nhân)
      const memberPerformance = fullContentRef.current.querySelector(
        ".pdf-member-performance",
      ) as HTMLElement;
      if (memberPerformance) await renderSectionToPDF(memberPerformance);

      // 3. Task Details
      const taskDetails = fullContentRef.current.querySelector(
        ".pdf-task-details",
      ) as HTMLElement;
      if (taskDetails) await renderSectionToPDF(taskDetails);

      // 4. Summary
      const summary = fullContentRef.current.querySelector(
        ".pdf-summary",
      ) as HTMLElement;
      if (summary) await renderSectionToPDF(summary);

      const reportType = isProjectLeader ? "du-an" : "ca-nhan";
      pdf.save(
        `bao-cao-thanh-tich-${reportType}-${projectData.name.replace(/\s+/g, "-")}.pdf`,
      );
      onGeneratePDF();
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
      alert("Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex w-full items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Xem Trước Báo Cáo Thành Tích
            {!isProjectLeader && (
              <span className="ml-2 text-sm font-normal text-indigo-600">
                (Báo cáo cá nhân)
              </span>
            )}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang tạo PDF...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
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
                  Tạo PDF
                </>
              )}
            </button>
            <button
              onClick={onGeneratePDF}
              disabled={isGenerating}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Đóng
            </button>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <div ref={fullContentRef} className="w-full bg-white p-4">
            {/* Header và Overview */}
            <div className="pdf-overview-section mb-8">
              <div className="mb-8 text-center">
                <div className="mb-4">
                  <h1 className="mb-2 text-4xl font-bold text-indigo-800">
                    {isProjectLeader
                      ? "BÁO CÁO THÀNH TÍCH DỰ ÁN"
                      : "BÁO CÁO THÀNH TÍCH CÁ NHÂN"}
                  </h1>
                  <div className="mx-auto h-1 w-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                </div>

                <div className="rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-lg">
                  <h2 className="mb-4 text-3xl font-bold text-indigo-700">
                    {projectData.name}
                  </h2>
                  <p className="mb-6 text-lg leading-relaxed text-gray-600">
                    {projectData.description}
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="text-center">
                      <div className="mb-1 text-2xl font-bold text-indigo-600">
                        {isProjectLeader
                          ? projectData.leader?.fullname
                          : user.fullname}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isProjectLeader ? "Trưởng dự án" : "Thành viên"}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="mb-1 text-2xl font-bold text-green-600">
                        {isProjectLeader
                          ? projectData.listMember?.length || 0
                          : currentMember?.completedTasksCount || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isProjectLeader ? "Thành viên" : "Nhiệm vụ hoàn thành"}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="mb-1 text-2xl font-bold text-blue-600">
                        {isProjectLeader
                          ? projectData.totalProjectTasks
                          : currentMember?.inProgressTasksCount || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        {isProjectLeader ? "Tổng nhiệm vụ" : "Đang thực hiện"}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="mb-1 text-2xl font-bold text-purple-600">
                        {isProjectLeader
                          ? calculateCompletionRate()
                          : calculatePersonalCompletionRate()}
                        %
                      </div>
                      <div className="text-sm text-gray-500">
                        {isProjectLeader ? "Tỷ lệ hoàn thành" : "Tỷ lệ cá nhân"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-indigo-600"
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
                      <span>
                        {projectData.startDate &&
                          format(
                            new Date(projectData.startDate),
                            "dd/MM/yyyy",
                            { locale: vi },
                          )}
                        {projectData.endDate &&
                          ` - ${format(new Date(projectData.endDate), "dd/MM/yyyy", { locale: vi })}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Performance */}
            <div className="pdf-member-performance mb-8">
              <h2 className="mb-6 text-center text-2xl font-bold text-indigo-800">
                {isProjectLeader
                  ? "THÀNH TÍCH THÀNH VIÊN"
                  : "THÀNH TÍCH CÁ NHÂN"}
              </h2>

              <div className="grid gap-6">
                {isProjectLeader
                  ? // Hiển thị tất cả thành viên cho trưởng dự án
                    projectData.listMember?.map((member, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-md"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                              {member.memberId.fullname.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                {member.memberId.fullname}
                              </h3>
                              <p className="text-gray-600">
                                {getRoleText(member.role)}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">
                              {member.completedTasksCount}/
                              {member.completedTasksCount +
                                member.inProgressTasksCount}
                            </div>
                            <div className="text-sm text-gray-500">
                              Nhiệm vụ hoàn thành
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div className="rounded-lg bg-green-50 p-4">
                            <div className="mb-1 text-lg font-semibold text-green-700">
                              Hoàn thành
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              {member.completedTasksCount}
                            </div>
                          </div>

                          <div className="rounded-lg bg-blue-50 p-4">
                            <div className="mb-1 text-lg font-semibold text-blue-700">
                              Đang thực hiện
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {member.inProgressTasksCount}
                            </div>
                          </div>

                          <div className="rounded-lg bg-purple-50 p-4">
                            <div className="mb-1 text-lg font-semibold text-purple-700">
                              Tỷ lệ hoàn thành
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                              {member.completedTasksCount +
                                member.inProgressTasksCount >
                              0
                                ? Math.round(
                                    (member.completedTasksCount /
                                      (member.completedTasksCount +
                                        member.inProgressTasksCount)) *
                                      100,
                                  )
                                : 0}
                              %
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : // Hiển thị chỉ thành viên hiện tại
                    currentMember && (
                      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                              {user.fullname.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">
                                {user.fullname}
                              </h3>
                              <p className="text-gray-600">
                                {getRoleText(currentMember.role)}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">
                              {currentMember.completedTasksCount}/
                              {currentMember.completedTasksCount +
                                currentMember.inProgressTasksCount}
                            </div>
                            <div className="text-sm text-gray-500">
                              Nhiệm vụ hoàn thành
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div className="rounded-lg bg-green-50 p-4">
                            <div className="mb-1 text-lg font-semibold text-green-700">
                              Hoàn thành
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              {currentMember.completedTasksCount}
                            </div>
                          </div>

                          <div className="rounded-lg bg-blue-50 p-4">
                            <div className="mb-1 text-lg font-semibold text-blue-700">
                              Đang thực hiện
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {currentMember.inProgressTasksCount}
                            </div>
                          </div>

                          <div className="rounded-lg bg-purple-50 p-4">
                            <div className="mb-1 text-lg font-semibold text-purple-700">
                              Tỷ lệ hoàn thành
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                              {calculatePersonalCompletionRate()}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
              </div>
            </div>

            {/* Task Details */}
            {currentUserTasks.length > 0 && (
              <div className="pdf-task-details mb-8">
                <h2 className="mb-6 text-center text-2xl font-bold text-indigo-800">
                  {isProjectLeader ? "CHI TIẾT NHIỆM VỤ" : "NHIỆM VỤ CỦA TÔI"}
                </h2>

                <div className="space-y-4">
                  {currentUserTasks.map((task, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-white p-6 shadow-md"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-2 text-xl font-semibold text-gray-800">
                            {index + 1}. {task.name}
                          </h3>
                          <p className="mb-3 text-gray-600">
                            {task.description}
                          </p>

                          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                              <span className="font-semibold text-gray-700">
                                Người thực hiện:
                              </span>
                              <span className="ml-2 text-gray-600">
                                {task.implementer?.fullname || "Chưa phân công"}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">
                                Deadline:
                              </span>
                              <span className="ml-2 text-gray-600">
                                {task.deadline &&
                                  format(
                                    new Date(task.deadline),
                                    "dd/MM/yyyy",
                                    { locale: vi },
                                  )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(task.status)}`}
                          >
                            {getStatusText(task.status)}
                          </span>
                        </div>
                      </div>

                      {task.completeTime && (
                        <div className="mt-3 rounded-lg bg-green-50 p-3">
                          <div className="flex items-center gap-2 text-green-700">
                            <svg
                              className="h-4 w-4"
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
                            <span className="font-semibold">
                              Hoàn thành lúc:
                            </span>
                            <span>
                              {format(
                                new Date(task.completeTime),
                                "dd/MM/yyyy HH:mm",
                                { locale: vi },
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="pdf-summary">
              <h2 className="mb-6 text-center text-2xl font-bold text-indigo-800">
                TỔNG KẾT
              </h2>

              <div className="rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-indigo-700">
                      {isProjectLeader
                        ? "Thành tích chung"
                        : "Thành tích cá nhân"}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {isProjectLeader
                            ? "Tổng nhiệm vụ:"
                            : "Nhiệm vụ được giao:"}
                        </span>
                        <span className="font-semibold">
                          {isProjectLeader
                            ? projectData.totalProjectTasks
                            : (currentMember?.completedTasksCount || 0) +
                              (currentMember?.inProgressTasksCount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Đã hoàn thành:</span>
                        <span className="font-semibold text-green-600">
                          {isProjectLeader
                            ? projectData.completedProjectTasks
                            : currentMember?.completedTasksCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tỷ lệ hoàn thành:</span>
                        <span className="font-semibold text-indigo-600">
                          {isProjectLeader
                            ? calculateCompletionRate()
                            : calculatePersonalCompletionRate()}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-indigo-700">
                      Đánh giá
                    </h3>
                    <div className="space-y-2">
                      {(() => {
                        const rate = isProjectLeader
                          ? calculateCompletionRate()
                          : calculatePersonalCompletionRate();
                        if (rate >= 80) {
                          return (
                            <div className="flex items-center gap-2 text-green-600">
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
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>
                                Xuất sắc -{" "}
                                {isProjectLeader
                                  ? "Dự án đạt tiến độ tốt"
                                  : "Bạn hoàn thành xuất sắc các nhiệm vụ"}
                              </span>
                            </div>
                          );
                        } else if (rate >= 60) {
                          return (
                            <div className="flex items-center gap-2 text-blue-600">
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
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              <span>
                                Tốt -{" "}
                                {isProjectLeader
                                  ? "Cần tăng tốc độ hoàn thành"
                                  : "Bạn cần tăng tốc độ hoàn thành nhiệm vụ"}
                              </span>
                            </div>
                          );
                        } else {
                          return (
                            <div className="flex items-center gap-2 text-orange-600">
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
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                              <span>
                                Cần cải thiện -{" "}
                                {isProjectLeader
                                  ? "Tiến độ chậm"
                                  : "Bạn cần cải thiện tiến độ làm việc"}
                              </span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Báo cáo được tạo vào:{" "}
                    {format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {isProjectLeader ? "Báo cáo toàn dự án" : "Báo cáo cá nhân"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReportPDF;
