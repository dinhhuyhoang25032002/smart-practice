"use client";
import InputSearchCourse from "@/components/custom/InputSearchCourse";
import { IoIosSearch } from "react-icons/io";
// import { GoHome } from "react-icons/go";
import { LuClipboardPen } from "react-icons/lu";
// import { IoRibbonOutline } from "react-icons/io5";
import { IoBookmarksOutline } from "react-icons/io5";
// import { FaAngleDown } from "react-icons/fa6";
// import { FiMenu } from "react-icons/fi";
// import { useState } from "react";
// import { HiXMark } from "react-icons/hi2";
import Link from "next/link";
import { BsRobot } from "react-icons/bs";
import { useCallback, useState, MouseEvent } from "react";
import { CiMenuBurger } from "react-icons/ci";
import LogoHeader from "@/components/header/LogoHeader";
import { LuCopyright } from "react-icons/lu";
// import { SlEarphonesAlt } from "react-icons/sl";
import { FaArrowLeft } from "react-icons/fa6";
import { useUserContext } from "@/store/context/AuthContext";
import TooltipChatbot from "../custom/TooltipChatbot";
import { useRouter } from "next/navigation";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import OptionProduct from "@/components/header/OptionProduct";
// import OptionBlog from "@/components/header/OptionBolg";
// import { usePathname } from "next/navigation";

export default function LeftContentHeader() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  // const [isOpenAllProduct, setOpenAllProduct] = useState(false);
  const [isOpenSearch, setOpenSearch] = useState(false);

  // const pathname = usePathname();
  const { user, setOpenSheet } = useUserContext();
  const router = useRouter();
  const _id = user?._id;
  const handleRedirect = useCallback(
    (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, link: string) => {
      e.preventDefault();
      if (!_id) {
        setOpenSheet(true);
        return;
      }
      router.push(link);
    },
    [_id, router, setOpenSheet],
  );
  return (
    <div className="content-left flex h-full w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className={`cursor-pointer rounded-full p-2 text-xl font-light hover:bg-[#eee] active:bg-[#eee] lg:hidden ${
            isOpenMenu ? "pointer-events-none" : " "
          }`}
        >
          <CiMenuBurger />
        </div>

        <div>
          <LogoHeader />
        </div>
      </div>

      {isOpenMenu && (
        <div
          className="fixed inset-0 lg:hidden"
          style={{ background: "rgba(88, 82, 85, 0.28)" }}
          onClick={() => setIsOpenMenu(false)}
        ></div>
      )}

      <div
        className={`fixed inset-0 z-20 flex w-[68%] flex-col justify-between gap-2 bg-white p-5 transition-all duration-200 ease-linear lg:hidden ${
          isOpenMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center gap-3 pb-5">
            <div
              onClick={() => setIsOpenMenu(!isOpenMenu)}
              className={`cursor-pointer rounded-full p-2 text-xl font-light hover:bg-[#eee] active:bg-[#eee]`}
            >
              <CiMenuBurger />
            </div>

            <div>
              <LogoHeader />
            </div>
          </div>
          <div className="flex flex-col font-medium">
            {/* <Link
              href="/about"
              className="cursor-pointer hover:bg-[#eee] active:bg-[#eee] rounded"
            >
              <span className=" flex items-center  w-full gap-3  p-2  hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
                <GoHome /> Giới Thiệu
              </span>
            </Link> */}
            <Link
              href=""
              onClick={(e) => handleRedirect(e, "/khoa-hoc")}
              className="cursor-pointer rounded hover:bg-[#eee] active:bg-[#eee]"
            >
              <span className="flex w-full items-center gap-3 p-2 hover:text-[#1464cc] focus:text-[#1464cc] active:text-[#5ea0f5]">
                <LuClipboardPen /> Khóa học của tôi
              </span>
            </Link>
            {/* <Link
              href="/new"
              className="cursor-pointer hover:bg-[#eee] active:bg-[#eee] rounded"
            >
              <span className=" flex items-center  w-full gap-3  p-2 hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
                <IoRibbonOutline /> Thông Báo
              </span>
            </Link> */}
            {/* <Link
              href="/about"
              className="cursor-pointer hover:bg-[#eee]  rounded"
            >
              <span className=" flex items-center  w-full gap-3 active:bg-[#eee]  p-2 hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
                <SlEarphonesAlt /> Hỗ trợ
              </span>
            </Link> */}
            <div
              className="cursor-pointer rounded hover:bg-[#eee] active:bg-[#eee] sm:hidden"
              onClick={() => setOpenSearch(true)}
            >
              <span className="flex w-full items-center gap-3 p-2 hover:text-[#1464cc] focus:text-[#1464cc] active:text-[#5ea0f5]">
                <IoIosSearch /> Tìm kiếm
              </span>
            </div>
            <Link
              href=""
              onClick={(e) =>
                handleRedirect(
                  e,
                  `/danh-sach-bai-thi-cua-sinh-vien?studentId=${user._id}`,
                )
              }
              className="cursor-pointer rounded hover:bg-[#eee] active:bg-[#eee]"
            >
              <span className="flex w-full items-center gap-3 p-2 hover:text-[#1464cc] focus:text-[#1464cc] active:text-[#5ea0f5]">
                <IoBookmarksOutline /> Xem điểm
              </span>
            </Link>
            <Link
              href=""
              onClick={(e) =>
                handleRedirect(
                  e,
                  `/danh-sach-bai-thi-cua-sinh-vien?studentId=${user._id}`,
                )
              }
              className="cursor-pointer rounded hover:bg-[#eee] active:bg-[#eee]"
            >
              <span className="flex w-full items-center gap-3 p-2 hover:text-[#1464cc] focus:text-[#1464cc] active:text-[#5ea0f5]">
                <BsRobot /> Chatbot AI
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-justify text-sm">
            Dữ liệu và thông tin trên website là tài sản riêng của công ty
            <span className="font-semibold"> OPENLAB</span> , cấm sao chép dưới
            mọi hình thức.
          </span>
          <span className="flex flex-col items-center text-center text-sm font-normal sm:justify-center">
            <span className="inline-flex items-center gap-1">
              <LuCopyright />
              <span className="mr-1 text-sm font-normal sm:text-base">
                2025 Bản quyền thuộc về
              </span>
            </span>
            <span className="text-sm font-semibold lg:text-base">OPENLAB</span>
          </span>
        </div>
      </div>

      <div className="hidden flex-1 items-center justify-around text-xl lg:flex">
        <Link
          href=""
          className="cursor-pointer"
          onClick={(e) => handleRedirect(e, "/khoa-hoc")}
        >
          <span className="font-medium hover:text-[#1464cc] focus:text-[#1464cc] active:text-[#5ea0f5]">
            Khoá học Steam
          </span>
        </Link>
        <Link
          href=""
          className="cursor-pointer"
          onClick={(e) => handleRedirect(e, "/du-an-steam")}
        >
          <span className="font-medium hover:text-[#1464cc] focus:text-[#1464cc] active:text-[#5ea0f5]">
            Dự án Steam
          </span>
        </Link>
        <Link
          href=""
          className="cursor-pointer"
          onClick={(e) => handleRedirect(e, "/khoa-hoc")}
        >
          <span className="font-medium hover:text-[#1464cc] focus:text-[#1464cc] active:text-[#5ea0f5]">
            Học bổng Steam
          </span>
        </Link>
        <Link
          href={""}
          className="cursor-pointer"
          onClick={(e) =>
            handleRedirect(
              e,
              `/danh-sach-bai-thi-cua-sinh-vien?studentId=${user._id}`,
            )
          }
        >
          <span className="font-medium hover:text-[#1464cc] focus:text-[#1464cc] active:text-[#5ea0f5]">
            Kết quả
          </span>
        </Link>
        <div>
          <TooltipChatbot />
        </div>
        {/* <Link href="/new" className="cursor-pointer">
          <span className=" font-semibold  hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
            Thông Báo
          </span>
        </Link>
        <Link href="/about" className="cursor-pointer">
          <span className=" font-semibold  hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
            Chính Sách
          </span>
        </Link> */}
      </div>

      <div
        className="hidden rounded-full p-2 text-xl hover:bg-[#eee] active:bg-[#eee] sm:hidden lg:hidden"
        onClick={() => setOpenSearch(true)}
      >
        <IoIosSearch />
      </div>
      {isOpenSearch && (
        <div className="absolute inset-0 z-20 flex items-center justify-between bg-white px-5">
          <div className="text-xl" onClick={() => setOpenSearch(false)}>
            <FaArrowLeft />
          </div>
          <div className="items-center justify-center xl:flex">
            <InputSearchCourse />
          </div>
        </div>
      )}
      {/* <div className="hidden items-center justify-center sm:flex lg:flex">
        <InputSearchCourse />
      </div> */}
    </div>
  );
}
