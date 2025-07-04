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
    [_id, router, setOpenSheet]
  );
  return (
    <div className="content-left w-full flex justify-between items-center h-full  ">
      <div className="flex items-center gap-3">
        <div
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className={`text-xl font-light lg:hidden rounded-full hover:bg-[#eee] p-2 cursor-pointer active:bg-[#eee] ${
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
          className="fixed inset-0  lg:hidden"
          style={{ background: "rgba(88, 82, 85, 0.28)" }}
          onClick={() => setIsOpenMenu(false)}
        ></div>
      )}

      <div
        className={`fixed inset-0 flex bg-white justify-between lg:hidden flex-col gap-2 w-[68%] z-20 p-5 transition-all duration-200 ease-linear ${
          isOpenMenu ? "translate-x-0" : " -translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center gap-3 pb-5">
            <div
              onClick={() => setIsOpenMenu(!isOpenMenu)}
              className={`p-2 font-light rounded-full hover:bg-[#eee] active:bg-[#eee] cursor-pointer text-xl `}
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
              className="cursor-pointer hover:bg-[#eee] active:bg-[#eee] rounded"
            >
              <span className=" flex items-center  w-full gap-3  p-2 hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
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
              className="cursor-pointer hover:bg-[#eee] active:bg-[#eee] rounded sm:hidden"
              onClick={() => setOpenSearch(true)}
            >
              <span className="flex items-center w-full gap-3 p-2  hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
                <IoIosSearch /> Tìm kiếm
              </span>
            </div>
            <Link
              href=""
              onClick={(e) =>
                handleRedirect(
                  e,
                  `/danh-sach-bai-thi-cua-sinh-vien?studentId=${user._id}`
                )
              }
              className="cursor-pointer hover:bg-[#eee] active:bg-[#eee] rounded"
            >
              <span className=" flex items-center w-full gap-3 p-2  hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
                <IoBookmarksOutline /> Xem điểm
              </span>
            </Link>
            <Link
              href=""
              onClick={(e) =>
                handleRedirect(
                  e,
                  `/danh-sach-bai-thi-cua-sinh-vien?studentId=${user._id}`
                )
              }
              className="cursor-pointer hover:bg-[#eee] active:bg-[#eee] rounded"
            >
              <span className=" flex items-center w-full gap-3 p-2  hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
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
          <span className="flex flex-col items-center text-center text-sm font-normal sm:justify-center ">
            <span className="inline-flex items-center gap-1">
              <LuCopyright />
              <span className="text-sm sm:text-base font-normal mr-1">
                2025 Bản quyền thuộc về
              </span>
            </span>
            <span className="text-sm lg:text-base font-semibold ">OPENLAB</span>
          </span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-20 text-xl">
        <Link
          href=""
          className="cursor-pointer"
          onClick={(e) => handleRedirect(e, "/khoa-hoc")}
        >
          <span className=" font-semibold  hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
           Khoá học
          </span>
        </Link>
        <Link
          href={""}
          className="cursor-pointer"
          onClick={(e) =>
            handleRedirect(
              e,
              `/danh-sach-bai-thi-cua-sinh-vien?studentId=${user._id}`
            )
          }
        >
          <span className=" font-semibold  hover:text-[#1464cc] active:text-[#5ea0f5] focus:text-[#1464cc]">
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
        className="text-xl p-2  hover:bg-[#eee] active:bg-[#eee] rounded-full hidden sm:hidden lg:hidden"
        onClick={() => setOpenSearch(true)}
      >
        <IoIosSearch />
      </div>
      {isOpenSearch && (
        <div className="absolute inset-0 bg-white flex items-center px-5 justify-between z-20">
          <div className="text-xl" onClick={() => setOpenSearch(false)}>
            <FaArrowLeft />
          </div>
          <div className="xl:flex items-center justify-center ">
            <InputSearchCourse />
          </div>
        </div>
      )}
      <div className=" sm:flex items-center justify-center hidden lg:flex">
        <InputSearchCourse />
      </div>
    </div>
  );
}
