"use client";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/loading";

import { SteamProjectInfo } from "@/types/CustomType";
import SectionSteamProjectDetail from "@/components/steam-project/SectionSteamProjectDetail";
import NotFound from "@/app/not-found";

import SectionTaskList from "@/components/steam-project/SectionTaskList";
import SectionSteamMemberList from "@/components/steam-project/SectionSteamMemberList";
export type ResSteamProjectDetail = {
  status: number;
  message: string;
  data: SteamProjectInfo;
};
export default function Page() {
  const id = useSearchParams().get("q");
  const { data, isLoading } = useSWRPrivate<ResSteamProjectDetail>(
    `steam/${id}`
  );

  const [nameProject, leader, members, description, startDate, endDate] =
    useMemo(() => {
      return [
        data?.data.name || "",
        data?.data.leader,
        data?.data.listMember || [],
        data?.data.description || "",
        data?.data.startDate || "",
        data?.data.endDate || "",
      ];
    }, [data]);
  if (!isLoading && !data?.data) return <NotFound />;
  if (isLoading) return <Loading />;
  console.log(members);

  return (
    <div className=" w-screen max-w-full min-h-screen flex p-20 py-10 justify-center bg-gray-100">
      <div className=" flex flex-col items-center w-full space-y-5">
        <span className="text-3xl font-bold uppercase animate-gradient-flow [--animation-duration:20s] bg-[linear-gradient(to_right,#24348C_0%,#F07F29_25%,#24348C_50%,#F07F29_75%,#24348C_100%)] bg-clip-text text-transparent  bg-[length:200%_auto]">
          {nameProject}
        </span>
        {data?.data && (
          <div className="w-full">
            <SectionSteamProjectDetail
              name={nameProject}
              leader={leader}
              listMember={members}
              description={description}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        )}
        <div className="w-full">
          <SectionTaskList members={members} />
        </div>

        <div className="w-full">
          <SectionSteamMemberList members={members} />
        </div>
      </div>
    </div>
  );
}
