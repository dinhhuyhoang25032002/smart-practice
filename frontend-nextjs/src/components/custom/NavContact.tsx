"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import flagVN from "@/assets/icon/vietnam_flags.png";
import flagEN from "@/assets/icon/united-states_flags.png";
import { FaCaretDown } from "react-icons/fa";
import Image from "next/image";
import { ReactNode, useState } from "react";
type NavContactProps = {
  contentLeft?: ReactNode;
  contentRight?: ReactNode;
};
const NavContact = ({ contentLeft }: NavContactProps) => {
  const [isOpenProfile, setOpenProfile] = useState(false);

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-[#080541] from-0% via-[#090979] via-58% to-[#06044a] to-100% px-6 py-1 text-white">
      <div className="flex xl:w-[20%]">{contentLeft}</div>
      <div className="flex items-center justify-center gap-2 xl:w-[15%]">
        <TooltipProvider delayDuration={100}>
          <Tooltip open={isOpenProfile}>
            <TooltipTrigger
              className=""
              onClick={() => setOpenProfile(!isOpenProfile)}
            >
              <div className="flag-container flex h-[46px] w-[46px] items-center justify-center gap-2">
                <div>
                  <Image
                    alt="VN-Flag"
                    src={flagVN}
                    className="object-cove cursor-pointer"
                    data-tooltip-id="option-language"
                  />
                </div>
                <FaCaretDown />
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white">
              <div className="container-option flex bg-white">
                <div className="content-option flex flex-col text-sm text-black">
                  <div className="flex cursor-pointer items-center gap-4 rounded-sm px-2 hover:bg-[#d2d3d4] hover:text-white">
                    <Image
                      alt="flag-en"
                      src={flagEN}
                      className="object-cove h-[40px] w-[40px] cursor-pointer"
                    />
                    <span>English (US)</span>
                  </div>
                  <div className="flex cursor-pointer items-center gap-4 rounded-sm px-2 hover:bg-[#d2d3d4] hover:text-white">
                    <Image
                      alt="flag-vn"
                      src={flagVN}
                      className="object-cove h-[40px] w-[40px] cursor-pointer"
                    />
                    <span>Tiếng Việt</span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default NavContact;
