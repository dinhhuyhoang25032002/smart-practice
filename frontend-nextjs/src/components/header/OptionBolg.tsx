import React from "react";
import Link from "next/link";
export default function OptionBlog() {
  return (
    <div className="option-blog px-0 py-1 text-base font-normal text-black opacity-100">
      <div className="courses cursor-pointer rounded-sm py-0.5 pl-2 hover:text-[#1464cc]">
        Công nghệ IoT
      </div>
      <hr />
      <div className="courses cursor-pointer rounded-sm bg-transparent px-2 py-0.5 hover:text-[#1464cc]">
        Công nghệ AI
      </div>
      <hr />
      <Link href={"/product/prices"}>
        <div className="courses cursor-pointer rounded-sm px-2 py-0.5 hover:text-[#1464cc]">
          Công nghệ 5G
        </div>
      </Link>
      <hr />
      <Link href={"/product/prices"}>
        <div className="courses cursor-pointer rounded-sm py-0.5 pl-2 hover:text-[#1464cc]">
          Công nghệ Big Data
        </div>
      </Link>
      <hr />
      <Link href={"/product"}>
        <div className="courses cursor-pointer rounded-sm px-2 py-0.5 hover:text-[#1464cc]">
          Công nghệ Blockchain
        </div>
      </Link>
    </div>
  );
}
