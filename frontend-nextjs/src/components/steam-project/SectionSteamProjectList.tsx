import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { SteamProjectInfo } from "@/types/CustomType";
import { format } from "date-fns";
type SectionSteamProjectListProps = {
  data: Array<SteamProjectInfo> | undefined;
};
export default function SectionSteamProjectList({
  data,
}: SectionSteamProjectListProps) {
  return (
    <div className="w-full bg-red-50 px-10 rounded ">
      <Table className="table-auto">
        <TableCaption className="caption-top text-xl font-semibold mb-4 text-black">
          Những dự án đã khởi tạo.
        </TableCaption>
        <TableHeader>
          <TableRow className="text-lg font-semibold">
            <TableHead className="">Tên dự án</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày khởi tạo</TableHead>
            <TableHead>Ngày kết thúc</TableHead>
            <TableHead className="text-center">Số thành viên</TableHead>
            <TableHead className="text-center">Tiến độ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="font-medium">
                <Link href={`/du-an-steam/du-an-1?q=${item._id}`}>
                  {item.name}
                </Link>
              </TableCell>
              <TableCell>Chưa hoàn thành</TableCell>
              <TableCell className="">
                {format(new Date(item.startDate), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(item.endDate), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="text-center">
                {item.listMember.length}
              </TableCell>
              <TableCell className=" flex flex-col justify-center items-center">
                <span className="inline-block ">
                  {14} / {24} bài đã nộp.
                </span>
                <div className="flex items-center gap-2 w-full justify-center">
                  <Progress
                    className=" w-[60%] h-2 rounded-full  "
                    value={Math.round((14 / 24) * 100)}
                  />
                  <span> {Math.round((14 / 24) * 100)}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
