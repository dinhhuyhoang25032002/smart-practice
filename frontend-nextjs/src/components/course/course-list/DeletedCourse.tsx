import React, { useEffect, useState } from "react";
import { LuArchiveRestore } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { Course } from "@/app/(container)/khoa-hoc/danh-sach-tat-ca-khoa-hoc/page";

import Loading from "@/app/loading";
import { toastNotiFail } from "@/components/custom/ToastNotification";

type CourseDeleted = {
  status: number;
  message: string;
  data: Array<Course>;
};
type DeletedCourseProps = {
  handleRestoreCourse: (id: string) => Promise<void>;
  
};
export default function DeletedCourse({
  handleRestoreCourse,
  
}: DeletedCourseProps) {
  const { data, isLoading } = useSWRPrivate<CourseDeleted>(
    `course/all-course-deleted`
  );
  const [courseDeleted, setCourseDeleted] = useState<Array<Course>>();
  useEffect(() => {
    setCourseDeleted(data?.data);
  }, [data]);
  const handleRestoreCourseAndSetState = async (id: string) => {
    try {
      await handleRestoreCourse(id);
      setCourseDeleted(courseDeleted?.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
      toastNotiFail("Đã có lỗi xảy ra khi khôi phục lại khóa học");
    }
  };
  return (
    <div className="flex items-center justify-center w-full flex-col gap-2">
      <span className="text-2xl font-semibold uppercase">
        Danh sách các khóa học đã xóa
      </span>
      <Table className="">
        <TableCaption className="hidden">
          A list of your recent invoices.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="uppercase">Mã khóa học</TableHead>
            <TableHead className="uppercase">Tên khóa học</TableHead>
            <TableHead className="text-center uppercase">Số bài học</TableHead>
            <TableHead className="text-center uppercase">Khôi phục</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <Loading />
          ) : courseDeleted?.length === 0 ? (
            <TableRow className=" h-[200px]">
              <TableCell
                className="font-medium text-center text-xl text-muted-foreground"
                colSpan={4}
              >
                Không có khóa học nào.
              </TableCell>
            </TableRow>
          ) : (
            courseDeleted?.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-center">{item.lessons}</TableCell>
                <TableCell>
                  <div className="flex justify-center items-center">
                    <div
                      aria-label="setting"
                      onClick={() => handleRestoreCourseAndSetState(item._id)}
                      className="bg-green-500 p-2 rounded-sm text-white hover:opacity-85 active:opacity-85"
                    >
                      <LuArchiveRestore className="text-2xl font-semibold" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
