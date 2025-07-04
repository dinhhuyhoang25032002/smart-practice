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
    <div className="option-product text-base sm:w-full xs:h-[600px] sm:h-[600px] overflow-y-auto  xs:w-full rounded shadow-xl px-5 py-5 font-normal text-black flex xs:gap-0 gap-4 flex-col xs:px-2 xs:py-2">
      <div className="flex gap-4 xs:flex-col xs:gap-2 sm:flex-col ">
        <div className="courses rounded-sm cursor-pointer pl-2 py-0.5 flex flex-col gap-4 xs:gap-2">
          <span className=" hover:text-[#1464cc] font-semibold">
            Giải pháp/Dịch vụ
          </span>
          <div className=" flex flex-col gap-4 xs:gap-2">
            {LinkSolutionHeader.map((item, index) => {
              return (
                <Link
                  href={`/products/solutions/introduction/${slugify(
                    item.nameLink,
                    {
                      locale: "vi",
                      lower: true,
                    }
                  )}`}
                  key={index}
                >
                  <span className=" hover:text-[#1464cc]">{item.nameLink}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="courses rounded-sm cursor-pointer px-2 py-0.5 flex flex-col gap-4 xs:gap-2">
          <span className=" hover:text-[#1464cc] font-semibold">
            Thiết bị/Kít
          </span>
          <div className=" flex flex-col gap-4 xs:gap-2">
            {LinkDevicesHeader.map((item, index) => {
              return (
                <Link
                  href={`/products/device-kits/introduction/${slugify(
                    item.nameLink,
                    {
                      locale: "vi",
                      lower: true,
                    }
                  )}`}
                  key={index}
                >
                  <span className=" hover:text-[#1464cc]">{item.nameLink}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="courses cursor-pointer px-2  rounded-sm py-0.5 gap-4 flex flex-col xs:gap-2">
          <span className=" hover:text-[#1464cc] font-semibold">
            Khoá học thực hành
          </span>
          <div className="flex flex-col gap-4 xs:gap-2">
            {LinkCourseHeader.map((item, index) => {
              return (
                <Link
                  href={`/products/courses/introduction/${slugify(
                    item.nameLink,
                    {
                      locale: "vi",
                      lower: true,
                    }
                  )}`}
                  key={index}
                >
                  <span className=" hover:text-[#1464cc]">{item.nameLink}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="courses cursor-pointer pl-2 rounded-sm py-0.5 gap-4 xs:gap-2 flex flex-col">
          <span className="font-semibold hover:text-[#1464cc]">Báo giá</span>
          <div className="flex flex-col gap-4 xs:gap-2">
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
      <div className="bg-gradient-to-r from-blue-900 from-0% via-cyan-800 via-58% to-sky-800 to-100% flex justify-center rounded-md xs:mt-2">
        <Link
          href={"/all-products"}
          className="w-full flex justify-center hover:bg-[#1513be] py-3 rounded-md hover:transition-colors duration-200 ease-out "
        >
          <div className="courses cursor-pointer rounded-sm text-white text-xl">
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
