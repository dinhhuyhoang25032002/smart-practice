"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsHouseDoor, BsBoxArrowRight } from "react-icons/bs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
          <h2>Something went wrong! {error.message}</h2>
          <Button onClick={() => reset()}>Try again</Button>
          <Link
            href={"/"}
            className="text-xl mt-4 underline flex items-center gap-1 bg-[#228d2c] p-3 rounded-lg text-white"
          >
            <BsHouseDoor className="text-xl font-semibold" /> Quay lại trang chủ
            <BsBoxArrowRight className="text-xl font-semibold ml-4" />
          </Link>
        </div>
      </body>
    </html>
  );
}
