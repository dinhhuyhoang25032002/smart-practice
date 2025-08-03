"use client";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/loading";
import { SteamProjectInfo, SteamTaskInfo } from "@/types/CustomType";
import SectionSteamProjectDetail from "@/components/steam-project/SectionSteamProjectDetail";
import NotFound from "@/app/not-found";
import SectionTaskList from "@/components/steam-project/SectionTaskList";
import SectionSteamMemberList from "@/components/steam-project/SectionSteamMemberList";
import { Button } from "@/components/ui/button";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { useState } from "react";
import ProjectReportPDF from "@/components/pdf/ProjectReportPDF";

export type ResSteamProjectDetail = {
  status: number;
  message: string;
  data: SteamProjectInfo;
};

export type ResSteamTasks = {
  status: number;
  message: string;
  data: SteamTaskInfo[];
};
export type ResSteamTask = {
  status: number;
  message: string;
  data: Array<SteamTaskInfo>;
};
export default function Page() {
  const id = useSearchParams().get("q");
  const [showPDFModal, setShowPDFModal] = useState<boolean>(false);

  const { data, isLoading } = useSWRPrivate<ResSteamProjectDetail>(
    `steam/${id}`,
  );

  const {
    data: tasksData,
    mutate: mutateTasks,
  } = useSWRPrivate<ResSteamTask>(`steam/get-steam-tasks?projectId=${id}`);

  if (!isLoading && !data?.data) return <NotFound />;
  if (isLoading) return <Loading />;
  if (!data?.data) return;

  const {
    name: nameProject,
    leader,
    listMember: members,
    description,
    startDate,
    endDate,
    totalProjectTasks,
    completedProjectTasks,
  } = data.data;

  return (
    <div className="flex w-screen max-w-full justify-center bg-gray-100 p-20 py-14">
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
              totalProjectTasks={totalProjectTasks}
              completedProjectTasks={completedProjectTasks}
            />
          </div>
        )}
        <div className="w-full">
          <SectionTaskList
            members={members}
            leader={leader}
            mutateTasks={mutateTasks}
            tasksData={tasksData}
          />
        </div>

        <div className="w-full">
          <SectionSteamMemberList members={members} />
        </div>

        <div className="flex w-full justify-end">
          <Button
            className="rounded border border-gray-500 bg-white text-black hover:bg-[#041ec4] hover:text-white"
            onClick={() => setShowPDFModal(true)}
          >
            <LiaFileDownloadSolid /> Xuất PDF
          </Button>
        </div>
      </div>
      {showPDFModal && (
        <ProjectReportPDF
          projectData={data?.data}
          tasksData={tasksData?.data || []}
          onGeneratePDF={() => setShowPDFModal(false)}
        />
      )}
    </div>
  );
}
