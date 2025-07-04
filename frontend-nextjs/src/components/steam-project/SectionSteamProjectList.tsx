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
export default function SectionSteamProjectList() {
  return (
    <div className="w-full bg-red-50 px-10">
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
          <TableRow>
            <TableCell className="font-medium">Dự án Steam 1</TableCell>
            <TableCell>Chưa hoàn thành</TableCell>
            <TableCell className="">6/6/2025</TableCell>
            <TableCell>6/11/2025</TableCell>
            <TableCell className="text-center">25</TableCell>
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
          <TableRow>
            <TableCell className="font-medium">Dự án Steam 1</TableCell>
            <TableCell>Chưa hoàn thành</TableCell>
            <TableCell className="">6/6/2025</TableCell>
            <TableCell>6/11/2025</TableCell>
            <TableCell className="text-center">25</TableCell>
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
        </TableBody>
      </Table>
    </div>
  );
}
