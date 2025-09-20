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
import { toast } from "sonner";

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
  const { data, isLoading, mutate } = useSWRPrivate<CourseDeleted>(
    `course/all-course-deleted`
  );

  const handleRestoreCourseAndSetState = async (id: string) => {
    try {
      await handleRestoreCourse(id);
      mutate();
    } catch (error) {
      console.log(error);
      toast.error("Đã có lỗi xảy ra khi khôi phục lại khóa học");
    }
  };
  if (isLoading) {
    return <Loading />;
  }
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
          {data?.data.length === 0 ? (
            <TableRow className=" h-[200px]">
              <TableCell
                className="font-medium text-center text-xl text-muted-foreground"
                colSpan={4}
              >
                Không có khóa học nào.
              </TableCell>
            </TableRow>
          ) : (
            data?.data?.map((item) => (
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
