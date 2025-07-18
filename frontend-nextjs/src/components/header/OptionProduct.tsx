import React from "react";
import Link from "next/link";
import slugify from "slugify";

type LinkHeader = {
  nameLink: string;
};
const LinkSolutionHeader: LinkHeader[] = [
  { nameLink: "Giải pháp Lab thông minh: OpenLab" },
  { nameLink: "Giải pháp Trợ giảng số AI: OpenChat" },
  { nameLink: "Trục liên thông dữ liệu: LabLink" },
  { nameLink: "Giải pháp Thực hành từ xa: E-Lab" },
  { nameLink: "Giải pháp Quản lý thiết bị số: E-Chip" },
  { nameLink: "Giải pháp thi online: E-Exam" },
];
const LinkDevicesHeader: LinkHeader[] = [
  { nameLink: "Kít thực hành IoT mở rộng" },
  { nameLink: "Kít thực hành thông minh IoT" },
  { nameLink: "Kít thực hành lập trình nhúng C" },
  { nameLink: "Kít thực hành mạng cảm biến thông minh" },
  { nameLink: "Thiết bị điều khiển trung tâm phòng lab" },
];

const LinkCourseHeader: LinkHeader[] = [
  { nameLink: "Thực hành hệ thống IoT" },
  { nameLink: "Thực hành mạng di động 5G" },
  { nameLink: "Thực hành ChatBot AI" },
  { nameLink: "Thực hành phân tích dữ liệu" },
  { nameLink: "Thực hành điện toán đám mây" },
  { nameLink: "Thực hành ROBOTICS" },
];
const LinkPricesHeader: LinkHeader[] = [
  { nameLink: "Giải pháp/Phần mềm" },
  { nameLink: "Phần cứng/Kít thực hành thông minh" },
  { nameLink: "Khoá học thực hành" },
  { nameLink: "Báo giá tất cả sản phẩm" },
];

export default function OptionProduct() {
  return (
    <div className="option-product xs:h-[600px] xs:w-full xs:gap-0 xs:px-2 xs:py-2 flex flex-col gap-4 overflow-y-auto rounded px-5 py-5 text-base font-normal text-black shadow-xl sm:h-[600px] sm:w-full">
      <div className="xs:flex-col xs:gap-2 flex gap-4 sm:flex-col">
        <div className="courses xs:gap-2 flex cursor-pointer flex-col gap-4 rounded-sm py-0.5 pl-2">
          <span className="font-semibold hover:text-[#1464cc]">
            Giải pháp/Dịch vụ
          </span>
          <div className="xs:gap-2 flex flex-col gap-4">
            {LinkSolutionHeader.map((item, index) => {
              return (
                <Link
                  href={`/products/solutions/introduction/${slugify(
                    item.nameLink,
                    {
                      locale: "vi",
                      lower: true,
                    },
                  )}`}
                  key={index}
                >
                  <span className="hover:text-[#1464cc]">{item.nameLink}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="courses xs:gap-2 flex cursor-pointer flex-col gap-4 rounded-sm px-2 py-0.5">
          <span className="font-semibold hover:text-[#1464cc]">
            Thiết bị/Kít
          </span>
          <div className="xs:gap-2 flex flex-col gap-4">
            {LinkDevicesHeader.map((item, index) => {
              return (
                <Link
                  href={`/products/device-kits/introduction/${slugify(
                    item.nameLink,
                    {
                      locale: "vi",
                      lower: true,
                    },
                  )}`}
                  key={index}
                >
                  <span className="hover:text-[#1464cc]">{item.nameLink}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="courses xs:gap-2 flex cursor-pointer flex-col gap-4 rounded-sm px-2 py-0.5">
          <span className="font-semibold hover:text-[#1464cc]">
            Khoá học thực hành
          </span>
          <div className="xs:gap-2 flex flex-col gap-4">
            {LinkCourseHeader.map((item, index) => {
              return (
                <Link
                  href={`/products/courses/introduction/${slugify(
                    item.nameLink,
                    {
                      locale: "vi",
                      lower: true,
                    },
                  )}`}
                  key={index}
                >
                  <span className="hover:text-[#1464cc]">{item.nameLink}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="courses xs:gap-2 flex cursor-pointer flex-col gap-4 rounded-sm py-0.5 pl-2">
          <span className="font-semibold hover:text-[#1464cc]">Báo giá</span>
          <div className="xs:gap-2 flex flex-col gap-4">
            {LinkPricesHeader.map((item, index) => {
              return (
                <Link href={`/products/prices`} key={index}>
                  <span className="hover:text-[#1464cc]">{item.nameLink}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="xs:mt-2 flex justify-center rounded-md bg-gradient-to-r from-blue-900 from-0% via-cyan-800 via-58% to-sky-800 to-100%">
        <Link
          href={"/all-products"}
          className="flex w-full justify-center rounded-md py-3 duration-200 ease-out hover:bg-[#1513be] hover:transition-colors"
        >
          <div className="courses cursor-pointer rounded-sm text-xl text-white">
            Tất cả sản phẩm
          </div>
        </Link>
      </div>

      {/* <Link
        href={"/all-products"}
        className="w-full xs:flex pl-2 py-3 rounded-md hover:transition-colors duration-200 ease-out hidden xs:hover:text-[#1464cc]"
      >
        <div className="courses cursor-pointer  rounded-sm font-semibold">
          Tất cả sản phẩm
        </div>
      </Link> */}
    </div>
  );
}
