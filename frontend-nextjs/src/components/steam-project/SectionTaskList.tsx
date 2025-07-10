"use client";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IoCode } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";
import CreateSteamTask from "./form/CreateSteamTask";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { useSearchParams } from "next/navigation";
import { SteamTaskInfo } from "@/types/CustomType";
type ResSteamTask = {
  status: number;
  message: string;
  data: Array<SteamTaskInfo>;
};
export default function SectionTaskList() {
  const projectId = useSearchParams().get("q");
  const { data, isLoading, mutate } = useSWRPrivate<ResSteamTask>(
    `steam/get-steam-tasks?projectId=${projectId}`
  );
  console.log(data);
  const [name, status, createdDate, implementer,, submitTime] = useMemo(() => {
    return [];
  }, [data]);
  return (
    <div className="bg-white  rounded w-full flex flex-col gap-5 justify-center items-center p-10 ">
      <span className="text-xl font-semibold">Danh sách nhiệm vụ</span>
      <div className="flex gap-5 items-center w-full justify-end ">
        <Button className="bg-white text-black border border-gray-500 rounded hover:bg-[#041ec4] hover:text-white ">
          <CiFilter /> Bộ lọc
        </Button>
        <Button className="bg-white text-black border border-gray-500 rounded hover:bg-[#041ec4] hover:text-white">
          <IoCode className="rotate-z-90" /> Xem
        </Button>
        <CreateSteamTask />
      </div>
      <div className="w-full">
        <Table className="table-fixed">
          <TableCaption className="hidden">
            A list of your recent invoices.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tên nhiệm vụ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo mới</TableHead>
              <TableHead>Người đảm nhiệm</TableHead>
              <TableHead>Thời gian nhận</TableHead>
              <TableHead>Thời gian hoàn thành</TableHead>
              <TableHead>Thời hạn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 24 }).map((item, index) => (
              <TableRow
                className={index + 1 > 10 ? "bg-green-100 " : "bg-amber-100"}
                key={index}
              >
                <TableCell>Tạo tài liệu {index + 1}</TableCell>
                <TableCell>Hoàn thành</TableCell>
                <TableCell>25/07/25</TableCell>
                <TableCell>Trần Tuấn Trường</TableCell>
                <TableCell>26/07/2025</TableCell>
                <TableCell>29/07/2025</TableCell>
                <TableCell>30/07/2025</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
