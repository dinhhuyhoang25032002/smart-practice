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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IoCode } from "react-icons/io5";
import Link from "next/link";
import { CiFilter } from "react-icons/ci";
import CreateSteamTask from "./form/CreateSteamTask";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { useSearchParams } from "next/navigation";
import { MemberInfor, SteamTaskInfo } from "@/types/CustomType";
import { format } from "date-fns";
import { MdAssignmentAdd } from "react-icons/md";
import { Headers, STATUS_TASK } from "@/constant/constant";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { KeyedMutator } from "swr";
import { ResSteamProjectDetail } from "@/app/(container)/du-an-steam/[slug]/page";
import slugify from "slugify";
export type ResSteamTask = {
  status: number;
  message: string;
  data: Array<SteamTaskInfo>;
};
type SectionTaskListProps = {
  members?: Array<MemberInfor>;
};
const MapStatus = {
  [STATUS_TASK.TO_DO]: "Chưa bắt đầu",
  [STATUS_TASK.IN_PROGRESS]: "Đang thực hiện",
  [STATUS_TASK.COMPLETED]: "Đã hoàn thành",
  [STATUS_TASK.CANCELLED]: "Đã hủy",
};
export default function SectionTaskList({ members }: SectionTaskListProps) {
  const projectId = useSearchParams().get("q");
  const { data, isLoading, mutate } = useSWRPrivate<ResSteamTask>(
    `steam/get-steam-tasks?projectId=${projectId}`,
  );
  if (isLoading) return <div>Loading...</div>;
  const handleOnSubmit = async (value: string, taskId?: string) => {
    if (!value) return;
    try {
      const response = await fetchPrivateData(`steam/assign-steam-task`, {
        method: "POST",
        body: JSON.stringify({
          projectId: projectId,
          taskId: taskId,
          memberId: value,
        }),
        headers: Headers,
      });

      if (response.status === 200) {
        mutate();
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 rounded bg-white p-10">
      <span className="text-xl font-semibold">Danh sách nhiệm vụ</span>
      <div className="flex w-full items-center justify-end gap-5">
        <Button className="rounded border border-gray-500 bg-white text-black hover:bg-[#041ec4] hover:text-white">
          <CiFilter /> Bộ lọc
        </Button>
        <Button className="rounded border border-gray-500 bg-white text-black hover:bg-[#041ec4] hover:text-white">
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
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead>Ngày tạo mới</TableHead>
              <TableHead>Người đảm nhiệm</TableHead>
              <TableHead>Thời gian phân công</TableHead>
              <TableHead>Thời gian hoàn thành</TableHead>
              <TableHead className="text-center">Thời hạn</TableHead>
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
                  <TableCell>
                    <Link
                      href={`/du-an-steam/nhiem-vu/${slugify(item.name, { lower: true, locale: "vi" })}`}
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    {MapStatus[item.status]}
                  </TableCell>
                  <TableCell>{format(item.createdAt, "dd/MM/yyyy")}</TableCell>
                  {item.implementer ? (
                    <TableCell>{item.implementer.fullname}</TableCell>
                  ) : (
                    <TableCell>Chưa có thông tin</TableCell>
                  )}
                  {item.startTime ? (
                    <TableCell>
                      {format(item.startTime, "dd/MM/yyyy")}
                    </TableCell>
                  ) : (
                    <TableCell>Chưa có thông tin</TableCell>
                  )}
                  {item.submitTime ? (
                    <TableCell>{item.submitTime}</TableCell>
                  ) : (
                    <TableCell>Chưa có thông tin</TableCell>
                  )}
                  <TableCell className="text-center">
                    {format(item.deadline, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="flex items-center justify-center">
                    {/* <MdAssignmentAdd /> */}
                    {item.implementer?._id ? (
                      <span>Đã phân công </span>
                    ) : (
                      <Select
                        onValueChange={(value: string) =>
                          handleOnSubmit(value, item._id)
                        }
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Chọn thành viên" />
                        </SelectTrigger>
                        <SelectContent>
                          {members?.map((member) => (
                            <SelectItem
                              key={member.memberId._id}
                              value={member.memberId._id}
                            >
                              {member.memberId.fullname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-[200px] text-center font-semibold text-gray-700"
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
