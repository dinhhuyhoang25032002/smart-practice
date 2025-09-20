"use client";
import { CiSettings } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { Headers, HttpStatus, UserRole } from "@/constant/constant";
import Loading from "@/app/loading";
import { useUserContext } from "@/store/context/AuthContext";
import ForbiddenResourceError from "@/components/custom/ForbiddenResourceError";
import { LuFolderPlus } from "react-icons/lu";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import CreateCourseForm from "@/components/course/form/CreateCourseForm";
import DeletedCourse from "@/components/course/course-list/DeletedCourse";
import slugify from "slugify";
import { toast } from "sonner";

export type Course = {
  _id: string;
  name: string;
  lessons: number;
  code: string;
};
export default function CreateACourse() {
  const { user } = useUserContext();
  const [isOpen, setOpen] = useState(false);
  const [isOpenDelete, setOpenDelete] = useState(false);

  const { data, isLoading, mutate } = useSWRPrivate<Array<Course>>(
    `/course/all-course`,
    {
      headers: Headers,
    }
  );

  if (user.role && user.role !== UserRole.TEACHER)
    return <ForbiddenResourceError />;
  if (isLoading) return <Loading />;

  const handleDeleteCourse = async (id: string) => {
    const res = await fetchPrivateData(`course?_id=${id}`, {
      method: "DELETE",
      headers: Headers,
    });
    if (res && res.status === HttpStatus.OK) {
      mutate();
      toast.success(res.message);
    }
  };
  const handleRestoreCourse = async (id: string) => {
    const res = await fetchPrivateData(`course/restore/${id}`, {
      method: "PATCH",
    });
    if (res.status === HttpStatus.OK) {
      toast.success(res.message);
      mutate();
    }
  };
  return (
    <div className="flex items-center justify-center p-24 w-screen max-w-full ">
      <div className="flex items-center justify-center flex-col  w-full gap-6">
        <span className="text-2xl font-semibold uppercase">
          Danh sách các khóa học
        </span>

        <div className="flex items-center justify-center w-full ">
          <Table className="">
            <TableCaption className="hidden">
              A list of your recent invoices.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="uppercase">Mã khóa học</TableHead>
                <TableHead className="uppercase">Tên khóa học</TableHead>
                <TableHead className="text-center uppercase">
                  Số bài học
                </TableHead>
                <TableHead className="text-center uppercase">
                  Chỉnh sửa
                </TableHead>
                <TableHead className="text-center uppercase">Xóa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow className=" h-[200px]">
                  <TableCell
                    className="font-medium text-center text-xl text-muted-foreground"
                    colSpan={5}
                  >
                    Không có khóa học nào.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-center">
                      {item.lessons}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center">
                        <Link
                          aria-label="setting"
                          href={`/khoa-hoc/danh-sach-tat-ca-khoa-hoc/${slugify(
                            item.name,
                            { lower: true, strict: true, locale: "vi" }
                          )}`}
                          className="bg-green-500 p-2 rounded-sm text-white hover:opacity-85 active:opacity-85"
                        >
                          <CiSettings className="text-2xl font-semibold" />
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="">
                      <div className=" flex justify-center items-center">
                        <div
                          aria-label="delete"
                          onClick={() => handleDeleteCourse(item._id)}
                          className="bg-red-500 cursor-pointer text-white p-2 rounded-sm hover:opacity-85 active:opacity-85"
                        >
                          <MdDeleteOutline className="text-2xl font-semibold" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end items-center w-full gap-2">
          <Button
            className="h-fit bg-[#05B51A]"
            onClick={() => setOpen(!isOpen)}
          >
            <span className="flex gap-2 items-center ">
              <LuFolderPlus />
              Thêm khóa học
            </span>
          </Button>
          <Button
            className="h-fit bg-[#E00707]"
            onClick={() => setOpenDelete(!isOpenDelete)}
          >
            <span className="flex gap-2 items-center ">
              <LuFolderPlus />
              Khóa học đã xóa
            </span>
          </Button>
        </div>
        {isOpen && (
          <div className="w-full">
            <CreateCourseForm />
          </div>
        )}
        {isOpenDelete && (
          <DeletedCourse handleRestoreCourse={handleRestoreCourse} />
        )}
      </div>
    </div>
  );
}
