"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import { Headers, STATUS_TASK } from "@/constant/constant";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { KeyedMutator } from "swr";
import {
  ResSteamProjectDetail,
  ResSteamTask,
} from "@/app/(container)/du-an-steam/[slug]/page";
import slugify from "slugify";
import { useUserContext } from "@/store/context/AuthContext";
import { toast } from "sonner";

type SectionTaskListProps = {
  members?: Array<MemberInfor>;
  leader?: {
    _id: string;
    fullname: string;
  };
  mutateTasks: KeyedMutator<ResSteamTask>;
  tasksData: ResSteamTask | undefined;
};
const MapStatus = {
  [STATUS_TASK.TO_START]: "Chưa bắt đầu",
  [STATUS_TASK.TO_DO]: "Đang thực hiện",
  [STATUS_TASK.IN_PROGRESS]: "Chờ đánh giá",
  [STATUS_TASK.COMPLETED]: "Đã hoàn thành",
  [STATUS_TASK.CANCELLED]: "Đã hủy",
};
export default function SectionTaskList({
  members,
  leader,
  
  mutateTasks,
  tasksData,
}: SectionTaskListProps) {
  const [sort, setSort] = useState<boolean>(false);
  const { user } = useUserContext();
  const projectId = useSearchParams().get("q");
  const [taskList, setTaskList] = useState<SteamTaskInfo[]>([]);

  useEffect(() => {
    if (tasksData?.data) {
      const tasks = sort ? [...tasksData.data].reverse() : tasksData.data;
      setTaskList(tasks);
    }
  }, [tasksData, sort]);
  const handleGetTaskListSorted = () => {
    setSort(!sort);
    if (tasksData && tasksData?.data.length > 0) {
      setTaskList(sort ? [...tasksData.data].reverse() : tasksData.data);
    }
  };

  const handleOnSubmit = async (value: string, taskId?: string) => {
    if (!value || value === "noMember") return;
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
        mutateTasks();
        // mutateListUser();
        toast.success("Đã phân công nhiệm vụ thành công.");
      } else {
        toast.error("Đã xảy ra lỗi khi phân công nhiệm vụ.");
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
        <Button
          className="rounded border border-gray-500 bg-white text-black hover:bg-[#041ec4] hover:text-white"
          onClick={handleGetTaskListSorted}
        >
          <IoCode className="rotate-z-90" /> Xem
        </Button>
        {user._id === leader?._id && <CreateSteamTask mutate={mutateTasks} />}
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
              <TableHead className="text-center">Thời gian phân công</TableHead>
              <TableHead className="text-center">
                Thời gian hoàn thành
              </TableHead>
              <TableHead className="text-center">Thời hạn</TableHead>
              {user._id === leader?._id && (
                <TableHead className="text-center">Phân công</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskList.length !== 0 ? (
              taskList.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Link
                      href={`/du-an-steam/nhiem-vu/${slugify(item.name, { lower: true, locale: "vi" })}?q=${item._id}`}
                    >
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell className="flex items-center justify-center">
                    <span
                      className={`flex h-9 w-fit items-center justify-center rounded-full px-3 text-amber-900 ${item.status !== STATUS_TASK.COMPLETED ? "bg-amber-200" : "bg-green-200"}`}
                    >
                      {MapStatus[item.status]}
                    </span>
                  </TableCell>
                  <TableCell>{format(item.createdAt, "dd/MM/yyyy")}</TableCell>
                  {item.implementer ? (
                    <TableCell>{item.implementer.fullname}</TableCell>
                  ) : (
                    <TableCell>Chưa có thông tin</TableCell>
                  )}
                  {item.startTime ? (
                    <TableCell className="text-center">
                      {format(item.startTime, "dd/MM/yyyy")}
                    </TableCell>
                  ) : (
                    <TableCell className="text-center">
                      Chưa có thông tin
                    </TableCell>
                  )}
                  {item.completeTime ? (
                    <TableCell className="text-center">
                      {format(item.completeTime, "dd/MM/yyyy")}
                    </TableCell>
                  ) : (
                    <TableCell className="text-center">
                      Chưa có thông tin
                    </TableCell>
                  )}
                  <TableCell className="text-center">
                    {format(item.deadline, "dd/MM/yyyy")}
                  </TableCell>
                  {user._id === leader?._id && (
                    <TableCell className="flex items-center justify-center">
                      {/* <MdAssignmentAdd /> */}
                      {item.implementer?._id &&
                      item.status !== STATUS_TASK.TO_START ? (
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
                            {members && members?.length > 0 ? (
                              members?.map((member) => (
                                <SelectItem
                                  key={member.memberId._id}
                                  value={member.memberId._id}
                                >
                                  {member.memberId.fullname}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value={"noMember"}>
                                Không có thành viên.
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-[200px] text-center font-semibold text-gray-700"
                >
                  Không có nhiệm vụ nào được tạo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
