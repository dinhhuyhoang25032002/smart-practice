"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useState } from "react";
import { FaAngleUp } from "react-icons/fa6";
export default function ButtonGoToTop() {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = document.documentElement.scrollTop;
      // console.log("check scrolled: ", scrolled);
      if (scrolled > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className="flex flex-col fixed right-0 bottom-11 w-[44px] rounded-tl-sm rounded-bl-sm 
overflow-hidden bg-[#080541] items-end hover:duration-300 delay-150 hover:transition-all hover:w-36 active:w-36 z-50"
    >
      <Button
        className={
          showButton === true
            ? "flex justify-end items-center rounded-none rounded-tl-sm rounded-bl-sm  pr-3 gap-4  w-36 h-12 hover:transition hover:bg-[#ddc320] hover:text-white active:bg-[#ddc320] active:text-white"
            : "hidden"
        }
        onClick={() => {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
      >
        <div>Đầu trang</div>
        <FaAngleUp className="text-[25px] font-light opacity-85 text-white" />
      </Button>
    </div>
  );
}
