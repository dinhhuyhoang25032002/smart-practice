import React from "react";
import { Textarea } from "../ui/textarea";
import { SteamProjectInfo } from "@/types/CustomType";
import { format } from "date-fns";
import { IoSettingsOutline } from "react-icons/io5";
import { Progress } from "@/components/ui/progress";
export default function SectionSteamProjectDetail({
  leader,
  description,
  listMember,
  startDate,
  endDate,
  totalProjectTasks,
  completedProjectTasks,
}: SteamProjectInfo) {
  return (
    <div className="flex w-full justify-center">
      <div className="relative flex w-3/4 flex-col justify-between gap-2 rounded bg-white p-5 shadow">
        <div className="absolute top-5 right-5 flex w-fit justify-end">
          <IoSettingsOutline className="cursor-pointer duration-200 active:rotate-z-45" />
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex h-full w-1/3 flex-col gap-2">
            <span>Trưởng dự án: {leader?.fullname}</span>
            <Textarea
              readOnly
              defaultValue={description}
              className="pointer-events-none flex-1"
            ></Textarea>
          </div>
          <div className="flex w-1/5 flex-col gap-2">
            <span>Số lượng thành viên: {listMember?.length}</span>
            {startDate && (
              <span className="">
                Ngày bắt đầu: {format(startDate, "dd/MM/yyyy")}
              </span>
            )}
            {endDate && (
              <span className="">
                Ngày kết thúc: {format(endDate, "dd/MM/yyyy")}
              </span>
            )}
          </div>
          <div className="flex w-1/3 flex-col gap-2">
            <span>
              Trạng thái:{" "}
              {completedProjectTasks === totalProjectTasks
                ? "Đã hoàn thành"
                : "Chưa hoàn thành"}
            </span>
            <div className="flex flex-col items-center gap-0">
              <span className="flex w-full">Tiến độ:</span>
              <span className="inline-block">
                {completedProjectTasks} / {totalProjectTasks} nhiệm vụ đã hoàn
                thành.
              </span>
              <div className="flex w-full items-center justify-center gap-2">
                <Progress
                  className="h-2 w-[60%] rounded-full"
                  value={Math.round(
                    (completedProjectTasks / totalProjectTasks) * 100,
                  )}
                />
                <span>
                  {Math.round(
                    (completedProjectTasks / totalProjectTasks) * 100,
                  )}
                  %
                </span>
              </div>
            </div>

            {/* <SearchUser /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
