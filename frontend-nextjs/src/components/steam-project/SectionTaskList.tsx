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
import { format } from "date-fns";
import { MdAssignmentAdd } from "react-icons/md";
export type ResSteamTask = {
  status: number;
  message: string;
  data: Array<SteamTaskInfo>;
};
export default function SectionTaskList() {
  const projectId = useSearchParams().get("q");
  const { data, isLoading, mutate } = useSWRPrivate<ResSteamTask>(
    `steam/get-steam-tasks?projectId=${projectId}`
  );
  if (isLoading) return <div>Loading...</div>;

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
        <CreateSteamTask mutate={mutate} />
      </div>
      <div className="w-full">
        <Table className="table-auto">
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
              <TableHead className="text-center">Phân công</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.length !== 0 ? (
              data?.data.map((item) => (
                <TableRow
                  // className={index + 1 > 10 ? "bg-green-100 " : "bg-amber-100"}
                  key={item._id}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{format(item.createdAt, "dd/MM/yyyy")}</TableCell>
                  {item.implementer ? (
                    <TableCell>{item.implementer}</TableCell>
                  ) : (
                    <TableCell>Chưa có thông tin</TableCell>
                  )}
                  {item.startTime ? (
                    <TableCell>{item.startTime}</TableCell>
                  ) : (
                    <TableCell>Chưa có thông tin</TableCell>
                  )}
                  {item.submitTime ? (
                    <TableCell>{item.submitTime}</TableCell>
                  ) : (
                    <TableCell>Chưa có thông tin</TableCell>
                  )}
                  <TableCell>{format(item.deadline, "dd/MM/yyyy")}</TableCell>
                  <TableCell className="flex justify-center items-center">
                    <MdAssignmentAdd />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center font-semibold text-gray-700 h-[200px]"
                >
                  Không có nhiệm vụ nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
