// import path from "path";
// import TestPageComponent from "./path";

// export default function TestPage() {
//   // Logic này chạy an toàn trên server
//   const hexFilePath = path.join(
//     process.cwd(),
//     "sketch_d99ce797-7af4-4945-993d-77b8d6d58295.ino.hex"
//   );

//   // Truyền đường dẫn đã được xử lý xuống client component dưới dạng prop
//   return <TestPageComponent serverCalculatedPath={hexFilePath} />;
// }
"use client";
import Notification from "@/components/notification/Notification";
import React from "react";

export default function Page() {
  return (
    <div>
      <Notification />
    </div>
  );
}
