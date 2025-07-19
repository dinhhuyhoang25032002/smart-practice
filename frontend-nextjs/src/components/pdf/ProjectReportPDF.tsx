import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
  contributions: string[];
  strengths: string[];
  weaknesses: string[];
  score: number;
  grade: string;
  evaluation: string;
  recommendations: string;
}

interface ProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  totalScore: number;
  members: Member[];
}

interface ProjectReportPDFProps {
  projectData: ProjectData;
  onGeneratePDF: () => void;
}

const ProjectReportPDF: React.FC<ProjectReportPDFProps> = ({ projectData, onGeneratePDF }) => {
  const fullContentRef = useRef<HTMLDivElement>(null);

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

  const generatePDF = async () => {
    if (!fullContentRef.current) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // Chụp toàn bộ nội dung với chiều rộng A4
      const canvas = await html2canvas(fullContentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels (210mm * 3.78 = 794px)
        height: undefined, // Để tự động tính chiều cao
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Tính số trang cần thiết
      const pagesNeeded = Math.ceil(imgHeight / (pageHeight - (margin * 2)));
      
      for (let i = 0; i < pagesNeeded; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const sourceY = i * (pageHeight - (margin * 2)) * (canvas.width / imgWidth);
        const sourceHeight = Math.min(
          (pageHeight - (margin * 2)) * (canvas.width / imgWidth),
          canvas.height - sourceY
        );
        
        // Tạo canvas tạm cho từng trang
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        
        if (tempCtx) {
          tempCtx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceHeight,
            0, 0, canvas.width, sourceHeight
          );
          
          const tempImgData = tempCanvas.toDataURL('image/png');
          const tempImgHeight = (sourceHeight * imgWidth) / canvas.width;
          
          pdf.addImage(
            tempImgData, 
            'PNG', 
            margin, 
            margin, 
            imgWidth, 
            tempImgHeight
          );
        }
      }

      pdf.save(`bao-cao-thanh-tich-${projectData.name}.pdf`);
      onGeneratePDF();
    } catch (error) {
      console.error('Lỗi khi tạo PDF:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 w-full">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Xem Trước Báo Cáo PDF</h2>
          <div className="flex gap-4">
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tạo PDF
            </button>
            <button
              onClick={onGeneratePDF}
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>

        <div className="flex justify-center ">
          <div ref={fullContentRef} className="bg-white p-4 w-full">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-indigo-800 mb-4">
                BÁO CÁO THÀNH TÍCH DỰ ÁN
              </h1>
              <div className="bg-white rounded-lg p-4 shadow-lg border">
                <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
                  {projectData.name}
                </h2>
                <p className="text-gray-600 mb-3">{projectData.description}</p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {projectData.startDate} - {projectData.endDate}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {projectData.status}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Điểm tổng thể: {projectData.totalScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Table */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-indigo-800 mb-3">Tổng Quan Đánh Giá Thành Viên</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="border border-gray-300 p-2 text-left">Tên</th>
                      <th className="border border-gray-300 p-2 text-left">Vai trò</th>
                      <th className="border border-gray-300 p-2 text-left">Điểm</th>
                      <th className="border border-gray-300 p-2 text-left">Xếp loại</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectData.members.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">{member.name}</td>
                        <td className="border border-gray-300 p-2">{member.role}</td>
                        <td className="border border-gray-300 p-2">{member.score}</td>
                        <td className="border border-gray-300 p-2">
                          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getGradeColor(member.grade)}`}>
                            {member.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Member Details */}
            {projectData.members.map((member, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-xl font-bold text-indigo-800 mb-3">
                  Chi Tiết Đánh Giá: {member.name}
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {index + 1}. {member.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${getScoreColor(member.score)}`}>
                        {member.score}/100
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(member.grade)}`}>
                        {member.grade}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.email}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Đóng Góp Chính</h4>
                    <ul className="space-y-1">
                      {member.contributions.map((contribution, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <svg className="mt-1 h-4 w-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-700">{contribution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="text-lg font-semibold text-blue-800 mb-2">Điểm Mạnh</h4>
                    <ul className="space-y-1">
                      {member.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <svg className="mt-1 h-4 w-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-blue-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-3 mt-4">
                  <h4 className="text-lg font-semibold text-orange-800 mb-2">Cần Cải Thiện</h4>
                  <ul className="space-y-1">
                    {member.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg className="mt-1 h-4 w-4 text-orange-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-orange-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-indigo-50 rounded-lg p-3 mt-4">
                  <h4 className="text-lg font-semibold text-indigo-800 mb-2">Đánh Giá Tổng Quan</h4>
                  <p className="text-indigo-700 leading-relaxed">{member.evaluation}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 mt-4">
                  <h4 className="text-lg font-semibold text-purple-800 mb-2">Khuyến Nghị</h4>
                  <p className="text-purple-700 leading-relaxed">{member.recommendations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectReportPDF; 