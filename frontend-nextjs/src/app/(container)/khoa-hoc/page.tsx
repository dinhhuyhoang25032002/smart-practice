"use client";
import { useUserContext } from "@/store/context/AuthContext";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import type { CourseInfor } from "@/types/CustomType";
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
import { useEffect, useState } from "react";
export default function CourseInfo() {
  const { user } = useUserContext();
  const _id = user._id;
  const { data } = useSWRPrivate<CourseInfor[]>(
    _id ? `course?userId=${_id}` : ""
  );
  const [courseActive, setCourseActive] = useState<CourseInfor[]>();
  const [isOpen, setOpen] = useState<boolean>(false);
  useEffect(() => {
    setCourseActive(data);
  }, [data]);
  return (
    <MainLayout>
      <div className=" min-h-screen h-screen flex justify-center items-center ">
        <div className="w-full h-full flex justify-start p-5 flex-wrap gap-10 flex-col ">
          <div className="w-full flex justify-end items-center">
            <Dialog open={isOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setOpen(true)}
                  className="rounded bg-[#D32F2F] hover:bg-[#1513be] active:bg-[#1513be] hover:text-white  active:text-white cursor-pointer text-base p-2 text-white font-medium flex items-center gap-2"
                >
                  Đăng kí khóa học mới
                </Button>
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
                  <ActiveCourse
                    _id={_id}
                    setOpen={setOpen}
                    setCourseActive={setCourseActive}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-full flex  p-5 flex-wrap gap-10 justify-start ">
            {courseActive?.length === 0 ? (
              <div className="w-full flex items-center justify-center">
                <div className="w-full text-center h-[200px] font-semibold text-2xl ">
                  Không có khóa học nào được đăng kí
                </div>
              </div>
            ) : (
              courseActive?.map((item, index) => (
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
