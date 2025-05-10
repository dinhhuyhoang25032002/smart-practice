"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import aiService from "@/assets/image/service/Chatbot_service.png";
import Image from "next/image";
import { useChatBotAiContext } from "@/store/context/ChatBotAi";

export default function TooltipChatbot() {
  // const { isOpen, setIsOpen } = useState();
  const { setOpenChatBotAi, isOpenChatBotAi } = useChatBotAiContext();
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={isOpenChatBotAi}>
        <TooltipTrigger
          className=""
          onClick={() => setOpenChatBotAi(!isOpenChatBotAi)}
        >
          <div className="flex justify-center items-center gap-2 cursor-pointer ">
            <Image
              src={aiService}
              alt={"ai-chat"}
              className="w-14 h-14 object-contain"
              // onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className="px-0 py-0 bg-white" side="bottom">
          <div className="flex items-center gap-2 text-base text-red-500 p-5">
            Chatbot AI hỗ trợ 24/7
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
