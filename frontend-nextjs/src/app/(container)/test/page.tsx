"use client";
import React from "react";
import { MdOutlineMail, MdOutlineLocalPhone } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaFacebook } from "react-icons/fa";
import { AiOutlineGithub } from "react-icons/ai";
import html2canvas from 'html2canvas-pro';
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

const myInfo = [
  {
    title: "email",
    content: "hoangdinh2503@gmail.com",
    icon: <MdOutlineMail />,
  },
  {
    title: "numberphone",
    content: "0374140955",
    icon: <MdOutlineLocalPhone />,
  },
  {
    title: "location",
    content: "Hà Đông-Hà Nội",
    icon: <HiOutlineLocationMarker />,
  },
  {
    title: "facebook",
    content: "https://www.facebook.com/share/17Tfv2nkYy/",
    icon: <FaFacebook />,
  },
  {
    title: "github",
    content: "https://github.com/dinhhuyhoang25032002",
    icon: <AiOutlineGithub />,
  },
];
const skills = [
  {
    title: "FrontEnd",
    skillsArr: [
      "Có 1-2 năm kinh nghiệm làm việc, sử dụng thư viện Reactjs, Nextjs, HTML, CSS để xây dựng UX/UI.",
      "Có hiểu biết về react-native.",
      "Có khả năng thiết kế responsive Web Design, có kinh nghiệm làm việc với RESTful APIs.",
      "Sử dụng các thư viện, framework UI: TailwindCss, Bootstrap, ShacdUi,...",
      "Có kinh nghiệm sử dụng state management: Redux, Zustand,... ",
      "Tối ưu Search Engine.",
      "Có kiến thức tốt về lập trình và thiết kế hướng đối tượng (OOP), sử dụng thành thạo Typescript.",
    ],
  },
  {
    title: "BackEnd",
    skillsArr: [
      "Có 1-2 năm kinh nghiệm làm việc, sử dụng Nodejs, Nestjs xây dựng RESTful APIs.",
      "Có kinh nghiệm sử dụng các databases: MySQL, MongoDB.",
      "Tích hợp các bên thứ ba như momo, zalopay, payos, google-cloud, firebase, facebook,...",
      "Có kinh nghiệm triển khai mô hình microservice.",
      "System Security: Authentication, Authorization, JWT, OAuth2, Gaurd...",
      "Có kinh nghiệm trong môi trường production, sử dụng Doker, CI/CD.",
    ],
  },
  {
    title: "KĨ NĂNG KHÁC",
    skillsArr: [
      "Có khả năng làm việc độc lập và làm việc nhóm tốt.",
      "Chăm chỉ, nhiệt tình, hoà đồng, đam mê tìm hiểu các công nghệ mới. Sẵn sàng tham gia vào quá trình đào tạo và học hỏi để cập nhật kiến thức và kỹ năng mới trong lĩnh vực DevOps.",
      "Tiếng anh đọc hiểu những tài liệu kĩ thuật.",
      "Có kỹ năng giải quyết vấn đề tốt, khả năng chịu áp lực cao.",
    ],
  },
];

const experience = [
  {
    company: "OPENLAB",
    time: "9/2023 - 3/2024",
    nameproject: ["Website cung cấp các khóa học, giải pháp và thiết bị IoT."],
    description: [
      "Tham gia thiết kế và xây dựng UX/UI.",
      "Tối ưu SEO.",
      "Xây dựng APIs.",
      "Xây dựng hệ thống theo mô hình microsercice.",
      "Tham gia thiết kế và xây dựng Cơ sở dữ liệu",
      "Tích hợp cổng thanh toán, Authentication, Authorization, JWT...",
      "Triển khai hệ thống trong môi trường production: build image, cấu hình SSL, reverse proxy,...",
      "Tích hợp AI và hệ thống.",
    ],
  },
  {
    company: "TinaSoft",
    time: "5/2024 - 11/2024",
    nameproject: [
      "Giải pháp quản trị mục tiêu, công việc cho doanh nghiệp.",
      "Cung cấp các sản phẩm thời trang và mĩ phẩm.",
    ],
    description: [
      "Tham gia thiết kế và xây dựng UX/UI, tích hợp APIs từ server.",
      "Build image",
      "System Security: Authentication, Authorization, JWT, OAuth2, Gaurd...",
    ],
  },
  {
    company: "LabIoT",
    time: "2023 - 2025",
    nameproject: [
      "Website giúp học tập và thực hành thông minh cho sinh viên chuyên ngành IoT. Được triển khai nội bộ phòng lab.",
    ],
    description: [
      "Tham gia thiết kế và xây dựng UX/UI.",
      "Xây dựng APIs.",
      "Sử dụng firebase, triển khai mqtt server để lưu trữ dữ liệu realtime từ các thiết bị IoT.",
      "Triển khai hệ thống trong môi trường production trong mạng LAN.",
      "Quản lí số giờ học và thời gian điểm danh của sinh viên.",
    ],
  },
];

export default function page() {
  const handleDownloadPDF = () => {
    console.log('abc');
    
    const input = document.getElementById("pdf-content") as HTMLElement;
  
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save("Dinh-Huy-Hoang-Profile.pdf");
    });
  };
  
  return (
    <div>
      <div
        className="w-screen max-w-full py-14 px-16 flex flex-col space-y-10"
        id="pdf-content"
      >
        <div className="space-y-4 flex flex-col w-full">
          <span className="text-4xl font-semibold text-[#00c951]">
            Đinh Huy Hoàng
          </span>
          <div className="">
            <span className="text-xl">
              Vị trí ứng tuyển: Fullstack Web Developer.
            </span>
            <hr className="border-[#00c951] border-t-2 w-full my-2" />
            <span className="text-lg">
              <span className="font-semibold">Mục tiêu nghề nghiệp:</span>
              <span>
                {" "}
                Trở thành người phát triển website và ứng dụng trên di động.
              </span>
            </span>
          </div>
        </div>
        <div className="flex gap-10 w-full">
          <div className=" flex w-1/2 gap-10 flex-col">
            <div className=" flex w-full flex-col gap-5 ">
              <div className="border-t-[#00c951] border-b-[#00c951] border-t-2 border-b-2 w-full py-1 pl-2 flex flex-col">
                <div className="uppercase font-semibold">Thông tin cá nhân</div>
              </div>
              <div className="pl-2">
                <ul className="flex flex-col gap-2 font-semibold">
                  {myInfo.map((item, index) => (
                    <li key={index} className="inline-flex items-center gap-3">
                      <div className="p-1 bg-[#00c951] rounded-sm text-white">
                        {item.icon}
                      </div>
                      {item.content}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className=" flex w-full flex-col gap-5">
              <div className="border-t-[#00c951] border-b-[#00c951] border-t-2 border-b-2 w-full py-1 pl-2">
                <div className="uppercase font-semibold">Học vấn</div>
              </div>
              <div className="pl-2 font-semibold flex flex-col gap-1">
                <span className="text-xl">
                  Học Viện Công Nghệ Bưu Chính Viễn Thông{" "}
                </span>
                <span className="font-light">
                  Ngành: Điện Tử Viễn Thông (2020 - 2025)
                </span>
                <div className="flex justify-between w-[55%]">
                  <span className="font-light">Chuyên ngành: IoT</span>
                  <span className="font-light">Trình độ Đại học</span>
                </div>
                <div className="flex flex-col">
                  <span>Quá trình học tập: </span>
                  <span className="inline-flex items-center pl-2 font-light ">
                    Tham gia các câu lạc bộ, phòng lab tại trường học để tìm
                    hiểu, học hỏi phát triển bản thân.
                  </span>
                  <span className="inline-flex items-center pl-2 font-light">
                    Tham gia phát triển website hỗ trợ sinh viên học tập và
                    thực. hành.
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col gap-5">
              <div className="border-t-[#00c951] border-b-[#00c951] border-t-2 border-b-2 w-full py-1 pl-2">
                <div className="uppercase font-semibold">Các kĩ năng</div>
              </div>
              <div className="space-y-5 pl-2">
                {skills.map((item, index) => (
                  <div key={index}>
                    <span className="uppercase font-semibold">
                      {item.title}
                    </span>
                    <ul className="">
                      {item.skillsArr.map((item, index) => (
                        <li key={index} className="pl-2 font-light">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="border-t-[#00c951] border-b-[#00c951] border-t-2 border-b-2 w-full py-1 pl-2 flex flex-col">
            <div className="uppercase font-semibold">Kinh nghiệm làm việc</div>
          </div>
          <div className="px-2 space-y-4">
            {experience.map((item, index) => (
              <div
                className="flex gap-10 border-gray-400 border-2 rounded-lg p-4 shadow-xs"
                key={index}
              >
                <div className="w-1/2 border-r-2 border-gray-300">
                  <div>
                    <div className="relative space-x-1">
                      <span className="text-xl font-semibold ">
                        {item.company}
                      </span>
                      <span className="ordinal absolute text-xs bg-[#99a1af] text-white px-2 rounded-lg ">
                        {item.time}
                      </span>
                    </div>
                    <span>Dự án tham gia:</span>
                    <ul>
                      {item.nameproject.map((item, index) => (
                        <li key={index} className="px-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="font-semibold">Công việc đảm nhiệm:</div>
                  <ul>
                    {item.description.map((item, index) => (
                      <li key={index} className="pl-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={handleDownloadPDF}>Save</Button>
    </div>
  );
}
