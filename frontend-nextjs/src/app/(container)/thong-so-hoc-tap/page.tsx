"use client";
import NoDataAvailable from "@/components/custom/NoDataAvailable";
import MainLayout from "@/components/main-layout";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { CourseInfor } from "@/types/CustomType";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
import slugify from "slugify";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const query = use(searchParams).studentId;
  console.log(query);

  const { data } = useSWRPrivate<CourseInfor[]>(
    query ? `course?userId=${query}` : ""
  );
  if (
    (data && "status" in data && data?.status === 400) ||
    data?.length === 0
  ) {
    return <NoDataAvailable />;
  }

  return (
    <MainLayout>
      <div className="p-10 xl:p-16 xl:flex-row ">
        <span className="block text-center text-2xl uppercase mb-12">
          Danh sách khóa học sinh viên đã đăng kí
        </span>
        <div className=" flex justify-center items-center gap-10">
          {data &&
            data.length !== 0 &&
            data?.map((item, index) => (
              <div
                key={index}
                className="border w-[28%] h-[300px] border-green-500  shadow-xl p-3 rounded-md flex flex-col space-y-4 items-center "
              >
                {item?.productionId?.image && (
                  <Image
                    src={item?.productionId?.image}
                    alt="image-course"
                    width={300}
                    height={300}
                    className=" p-1 rounded-md object-contain aspect-3/2 border border-gray-400"
                  />
                )}

                <Link
                  href={`/thong-so-hoc-tap/${slugify(item.productionId.name, {
                    locale: "vi",
                    lower: true,
                  })}?studentId=${query}&q=${item.productionId.lessons[0]}`}
                  className="hover:underline hover:text-blue-600 text-xl active:text-blue-600"
                >
                  {item?.productionId?.name}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </MainLayout>
  );
}
