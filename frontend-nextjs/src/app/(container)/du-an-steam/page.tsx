"use client";
import Loading from "@/app/loading";
import CreateSteamProject from "@/components/steam-project/form/CreateSteamProjectForm";
import SectionSteamProjectList from "@/components/steam-project/SectionSteamProjectList";
import { Button } from "@/components/ui/button";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { SteamProjectInfo } from "@/types/CustomType";
import { useState } from "react";
import { FaRegSquarePlus } from "react-icons/fa6";
export type ResListSteamProjects = {
  status: number;
  message: string;
  data: Array<SteamProjectInfo>;
};
export default function Page() {
  const [isCreateProject, setIsCreateProject] = useState(false);
  const { data, isLoading, mutate } = useSWRPrivate<ResListSteamProjects>(
    `steam/get-steam-project-list`,
  );
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex w-full items-center justify-center p-10">
      <div className="flex w-full flex-col items-center gap-4">
        <span className="animate-gradient-flow bg-[linear-gradient(to_right,#24348C_0%,#F07F29_25%,#24348C_50%,#F07F29_75%,#24348C_100%)] bg-[length:200%_auto] bg-clip-text text-3xl font-bold text-transparent uppercase [--animation-duration:20s]">
          Dự án Steam
        </span>
        <div className="flex w-full items-center justify-end gap-4">
          <Button
            onClick={() => setIsCreateProject(true)}
            className="animate-gradient-flow flex w-fit cursor-pointer items-center justify-end gap-2 rounded-full border border-[#F07F29] bg-[linear-gradient(to_right,#24348C_0%,#F07F29_25%,#24348C_50%,#F07F29_75%,#24348C_100%)] bg-[length:500%_auto] p-2 font-semibold text-white [--animation-duration:10s] hover:bg-[#24348C]"
          >
            <FaRegSquarePlus />
            Thêm mới dự án Steam
          </Button>
        </div>
        {isCreateProject && (
          <div className="flex w-full items-center justify-center">
            <div className="w-1/2 rounded border border-[#F07F29] bg-white p-8 shadow-md">
              <CreateSteamProject
                setIsCreateProject={setIsCreateProject}
                mutate={mutate}
              />
            </div>
          </div>
        )}

        <div className="mt-10 w-full px-10">
          <SectionSteamProjectList data={data?.data} />
        </div>
      </div>
    </div>
  );
}
