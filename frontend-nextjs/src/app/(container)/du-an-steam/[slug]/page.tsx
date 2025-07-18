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
  const { data, isLoading, mutate } = useSWRPrivate<ResSteamProjectDetail>(
    `steam/${id}`,
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
    <div className="flex min-h-screen w-screen max-w-full justify-center bg-gray-100 p-20 py-10">
      <div className="flex w-full flex-col items-center space-y-5">
        <span className="animate-gradient-flow bg-[linear-gradient(to_right,#24348C_0%,#F07F29_25%,#24348C_50%,#F07F29_75%,#24348C_100%)] bg-[length:200%_auto] bg-clip-text text-3xl font-bold text-transparent uppercase [--animation-duration:20s]">
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
          <SectionSteamMemberList members={members}  />
        </div>
      </div>
    </div>
  );
}
