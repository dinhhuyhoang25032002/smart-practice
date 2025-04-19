"use client";
import { useUserContext } from "@/store/context/AuthContext";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import type { CourseInfor, ResponseException } from "@/types/CustomType";
import Image from "next/image";
import slugify from "slugify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Link from "next/link";
import MainLayout from "@/components/main-layout";
import ActiveCourse from "@/components/course/form/ActiveCourse";
import { Button } from "@/components/ui/button";
export default function CourseInfo() {
  const { user } = useUserContext();
  const _id = user._id;
  const { data } = useSWRPrivate<CourseInfor[] | ResponseException>(
    _id ? `course?userId=${_id}` : ""
  );
  console.log(data);

  return (
    <MainLayout>
      <div className=" min-h-screen h-screen flex justify-center items-center ">
        <div className="w-full h-full flex justify-start p-5 flex-wrap gap-10 flex-col ">
          <div className="w-full flex justify-end items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Đăng kí khóa học mới</Button>
              </DialogTrigger>
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle className="hidden">
                    Are you absolutely sure?
                  </DialogTitle>
                  <DialogDescription className="hidden">
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full flex items-center justify-center ">
                  <ActiveCourse />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-full flex  p-5 flex-wrap gap-10 justify-start ">
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
      </div>
    </MainLayout>
  );
}
