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

import { useEffect, useState } from "react";
import { toastNotiSuccess } from "@/components/custom/ToastNotification";
import { Button } from "@/components/ui/button";
import CreateCourseForm from "@/components/course/form/CreateCourseForm";

type Course = {
  _id: string;
  name: string;
  lessons: number;
  code: string;
};
export default function CreateACourse() {
  // const form = useForm<CourseContent>({
  //   resolver: zodResolver(),
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //   },
  // });
  const { user } = useUserContext();
  const [isOpen, setOpen] = useState(false);
  const { data, isLoading } = useSWRPrivate<Array<Course>>(
    `/course/all-course`,
    {
      headers: Headers,
    }
  );
  const [courses, setCourses] = useState<Array<Course>>();
  useEffect(() => {
    setCourses(data);
  }, [data]);
  if (user.role && user.role !== UserRole.TEACHER)
    return <ForbiddenResourceError />;
  if (isLoading) return <Loading />;
  console.log("data", data);
  const handleDeleteCourse = async (id: string) => {
    setCourses(courses?.filter((item) => item._id !== id));
    const res = await fetchPrivateData(`course?_id=${id}`, {
      method: "DELETE",
      headers: Headers,
    });
    if (res && res.status === HttpStatus.OK) {
      toastNotiSuccess(res.message);
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
              {courses?.length === 0 ? (
                <TableRow className=" h-[200px]">
                  <TableCell
                    className="font-medium text-center text-xl text-muted-foreground"
                    colSpan={5}
                  >
                    Không có khóa học nào.
                  </TableCell>
                </TableRow>
              ) : (
                courses?.map((item) => (
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
                          href={`/khoa-hoc/danh-sach-tat-ca-khoa-hoc/${item._id}`}
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
        <div className="flex justify-end items-center w-full">
          <Button className="h-fit" onClick={() => setOpen(!isOpen)}>
            <span className="flex gap-2 items-center ">
              <LuFolderPlus />
              Thêm khóa học
            </span>
          </Button>
        </div>
        {isOpen && (
          <div className="w-full">
            <CreateCourseForm />
          </div>
        )}
      </div>
     
    </div>
  );
}
