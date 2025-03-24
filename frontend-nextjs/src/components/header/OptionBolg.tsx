import React from "react";
import Link from "next/link";
export default function OptionBlog() {
  return (
    <div className="option-blog text-base  py-1 px-0 font-normal text-black opacity-100">
      <div className="courses  hover:text-[#1464cc] rounded-sm cursor-pointer pl-2 py-0.5">
        Công nghệ IoT
      </div>
      <hr />
      <div className="courses  hover:text-[#1464cc] rounded-sm cursor-pointer px-2 py-0.5 bg-transparent">
        Công nghệ AI
      </div>
      <hr />
      <Link href={"/product/prices"}>
        <div className="courses cursor-pointer px-2  hover:text-[#1464cc] rounded-sm py-0.5">
          Công nghệ 5G
        </div>
      </Link>
      <hr />
      <Link href={"/product/prices"}>
        <div className="courses cursor-pointer pl-2  hover:text-[#1464cc] rounded-sm py-0.5">
          Công nghệ Big Data
        </div>
      </Link>
      <hr />
      <Link href={"/product"}>
        <div className="courses cursor-pointer px-2  hover:text-[#1464cc] rounded-sm py-0.5">
          Công nghệ Blockchain
        </div>
      </Link>
    </div>
  );
}
