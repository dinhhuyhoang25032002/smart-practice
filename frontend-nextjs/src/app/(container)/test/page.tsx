"use client";

import { Progress } from "@/components/ui/progress";
import React from "react";

console.log((1 / 13) * 100);

export default function page() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative flex items-center justify-center ">
        <span className="block">
          {1} / {13} bài đã nộp.
        </span>
        <Progress
          className="absolute bottom-0 left-0 w-full h-1 rounded-full" 
          value={(1 / 13) * 100}
        />
      </div>
    </div>
  );
}
