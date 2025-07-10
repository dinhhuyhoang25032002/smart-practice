import React from 'react'
import { Textarea } from '../ui/textarea'
import { SteamProjectInfo } from '@/types/CustomType'
import { format } from "date-fns";
import { IoSettingsOutline } from "react-icons/io5";
import { Progress } from "@/components/ui/progress";
export default function SectionSteamProjectDetail({ leader, description, listMember, startDate, endDate }: SteamProjectInfo) {
    return (
        <div className="w-full flex justify-center ">
            <div className="relative w-1/2 p-5 bg-white rounded shadow flex justify-between gap-2 flex-col">
                <div className="w-fit flex justify-end absolute top-5 right-5">
                    <IoSettingsOutline className="cursor-pointer active:rotate-z-45 duration-200" />
                </div>
                <div className="flex justify-between items-center gap-5">
                    <div className="flex flex-col gap-2 w-1/2  h-full">
                        <span>Trưởng dự án: {leader?.fullname}</span>
                        <Textarea
                            readOnly
                            defaultValue={description}
                            className="flex-1 pointer-events-none" 
                        ></Textarea>
                        <span>Số lượng thành viên: {listMember?.length}</span>
                    </div>

                    <div className="w-1/2 flex flex-col gap-2">

                        <span>Trạng thái: Chưa hoàn thành</span>
                        <div className="flex flex-col items-center gap-0">
                            <span className="flex w-full">Tiến độ:</span>
                            <span className="inline-block ">
                                {14} / {24} nhiệm vụ đã hoàn thành.
                            </span>
                            <div className="flex items-center gap-2 w-full justify-center">
                                <Progress
                                    className=" w-[60%] h-2 rounded-full  "
                                    value={Math.round((14 / 24) * 100)}
                                />
                                <span>{Math.round((14 / 24) * 100)}%</span>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-between ">
                            {startDate && (
                                <span className="w-1/2">Ngày bắt đầu: {format(startDate, "dd/MM/yyyy")}</span>
                            )}
                            {endDate && (
                                <span className="w-1/2">Ngày kết thúc: {format(endDate, "dd/MM/yyyy")}</span>
                            )}
                        </div>

                        {/* <SearchUser /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
