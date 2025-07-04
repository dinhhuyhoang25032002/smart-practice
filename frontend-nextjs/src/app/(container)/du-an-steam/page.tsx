"use client";
import CreateSteamProject from "@/components/steam-project/form/CreateSteamProjectForm";
import SectionSteamProjectList from "@/components/steam-project/SectionSteamProjectList";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaRegSquarePlus } from "react-icons/fa6";
export default function Page() {
  const [isCreateProject, setIsCreateProject] = useState(false);
  return (
    <div className="w-full flex justify-center items-center p-10">
      <div className="flex flex-col items-center gap-4 w-full ">
        <span className="text-3xl font-bold uppercase animate-gradient-flow [--animation-duration:20s] bg-[linear-gradient(to_right,#24348C_0%,#F07F29_25%,#24348C_50%,#F07F29_75%,#24348C_100%)] bg-clip-text text-transparent  bg-[length:200%_auto]">
          Dự án Steam
        </span>
        <div className="w-full flex justify-end items-center gap-4">
          <Button
            onClick={() => setIsCreateProject(true)}
            className="flex font-semibold cursor-pointer animate-gradient-flow [--animation-duration:10s] bg-[linear-gradient(to_right,#24348C_0%,#F07F29_25%,#24348C_50%,#F07F29_75%,#24348C_100%)] hover:bg-[#24348C] bg-[length:500%_auto] text-white  items-center gap-2 w-fit justify-end p-2 border border-[#F07F29] rounded-full"
          >
            <FaRegSquarePlus />
            Thêm mới dự án Steam
          </Button>
        </div>
        {isCreateProject && (
          <div className="w-full flex items-center justify-center ">
            <div className="w-1/2  p-8 border border-[#F07F29] rounded bg-white shadow-md">
              <CreateSteamProject setIsCreateProject={setIsCreateProject} />
            </div>
          </div>
        )}

        <div className="w-full mt-10">
          <SectionSteamProjectList />
        </div>
      </div>
    </div>
  );
}
