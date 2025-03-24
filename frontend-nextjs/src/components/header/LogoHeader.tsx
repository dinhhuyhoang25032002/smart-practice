import React from "react";
import Link from "next/link";
export default function LogoHeader() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Link href={"/"} className="cursor-pointer flex flex-col">
        <span
          className="text-[22px] tracking-widest font-semibold text-center text-[#0c801b] text-shadow-lg sm:text-[26px] xl:text-3xl"
          style={{
            textShadow:
              "rgb(177, 181, 200) 3px 1px 0px, rgb(198 216 205) 7px 1px 10px, rgb(175 145 145) 3px 1px 2px, rgb(190 220 217) 5px 1px 30px",
          }}
        >
          SmartPractice
        </span>
        <span className="text-[#0c801b] font-semibold text-base text-center tracking-wider sm:tracking-widest xl:text-[19px] ">
          Knowledge is Power
        </span>
      </Link>
    </div>
  );
}
