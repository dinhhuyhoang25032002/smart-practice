"use client";
import { useUserContext } from "@/store/context/AuthContext";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import type { CourseInfor } from "@/types/CustomType";
import Image from "next/image";
import slugify from "slugify";
import Link from "next/link";
import MainLayout from "@/components/main-layout";
export default function CourseInfo() {
  const { user } = useUserContext();
  const _id = user._id;
  const { data } = useSWRPrivate<CourseInfor[]>(
    _id ? `course?userId=${_id}` : ""
  );
  console.log(data);

  return (
    <MainLayout >
      <div className="h-screen min-h-screen  flex justify-center items-center">
        <div className="w-full h-full flex justify-center items-center ">
          {data?.map((item, index) => (
            <div
              key={index}
              className="border border-gray-500 shadow-xl p-3 rounded-md flex flex-col space-y-4 items-center"
            >
              {item?.productionId?.image ? (
                <Image
                  src={item?.productionId?.image}
                  alt="image-course"
                  width={300}
                  height={300}
                />
              ) : null}

              <Link
                href={`/khoa-hoc/${slugify(item.productionId.name, {
                  locale: "vi",
                  lower: true,
                })}?id=${item.productionId.lessons[0]}`}
                className="hover:underline hover:text-blue-600 text-xl"
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
