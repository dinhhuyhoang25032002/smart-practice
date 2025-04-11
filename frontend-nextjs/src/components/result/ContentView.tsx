"use client";

import Image from "next/image";

type PdfViewProps = {
  url: string | undefined;
};

export default function ContentView({ url }: PdfViewProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center border-2 border-gray-300 shadow rounded-md p-5 space-y-5">
      {url && (
        <div className=" flex justify-center items-center ">
          <Image
            priority
            src={url}
            alt="ContentView-image"
            width={900}
            height={900}
            className="object-contain object-center w-[90%] h-fit"
          />
        </div>
      )}
    </div>
  );
}
