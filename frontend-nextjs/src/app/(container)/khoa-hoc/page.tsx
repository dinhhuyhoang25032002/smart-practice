"use client";
import { useUserContext } from "@/store/context/AuthContext";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import type { CourseInfor, ResponseException } from "@/types/CustomType";
import Image from "next/image";
import slugify from "slugify";
import Link from "next/link";
import MainLayout from "@/components/main-layout";
import ActiveCourse from "@/components/course/form/ActiveCourse";
export default function CourseInfo() {
  const { user } = useUserContext();
  const _id = user._id;
  const { data } = useSWRPrivate<CourseInfor[] | ResponseException>(
    _id ? `course?userId=${_id}` : ""
  );
  console.log(data);

  return (
    <MainLayout>
      <div className=" min-h-screen h-screen flex justify-center items-center">
        <div className="w-full h-full flex justify-center p-5 flex-wrap gap-5 ">
          {data &&
          "status" in data &&
          data?.status === 400 &&
          data.name === "BadRequestException" ? (
            <div className="w-full flex items-center justify-center">
              <ActiveCourse />
            </div>
          ) : (
            (data as CourseInfor[])?.map((item, index) => (
              <div
                key={index}
                className="border w-[28%] h-[300px] border-gray-500 shadow-xl p-3 rounded-md flex flex-col space-y-4 items-center"
              >
                {item?.productionId?.image && (
                  <Image
                    src={item?.productionId?.image}
                    alt="image-course"
                    width={300}
                    height={300}
                    className="aspect-3/2"
                  />
                )}

                <Link
                  href={`/khoa-hoc/${slugify(item.productionId.name, {
                    locale: "vi",
                    lower: true,
                  })}?id=${item.productionId.lessons[0]}`}
                  className="hover:underline hover:text-blue-600 text-xl active:text-blue-600"
                >
                  {item?.productionId?.name}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
