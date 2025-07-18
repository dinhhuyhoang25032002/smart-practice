import React from "react";
import Link from "next/link";
export default function LogoHeader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Link href={"/"} className="flex cursor-pointer flex-col">
        <span
          className="text-center text-[30px] font-semibold tracking-widest text-[#D32F2F] text-shadow-lg sm:text-[26px] lg:text-4xl xl:text-4xl"
          style={{
            textShadow:
              "rgb(177, 181, 200) 3px 1px 0px, rgb(198 216 205) 7px 1px 10px, rgb(175 145 145) 3px 1px 2px, rgb(190 220 217) 5px 1px 30px",
          }}
        >
          OPENLAB
        </span>
        <span className="text-center text-base font-semibold tracking-wider text-[#D32F2F] sm:tracking-widest xl:text-[19px]">
          AI/IoT as a service
        </span>
      </Link>
    </div>
  );
}
