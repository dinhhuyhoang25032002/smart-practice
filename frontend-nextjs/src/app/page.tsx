"use client";
import { useUserContext } from "@/store/context/AuthContext";
import { UserRole } from "@/constant/constant";
import HomePageForStudent from "@/components/homepage/HomePageForStudent";
import HomePageForTeacher from "@/components/homepage/HomePageForTeacher";
import MainLayout from "@/components/main-layout";
// import ForbiddenResourceError from "@/components/custom/ForbiddenResourceError";
import ChatBotAI from "@/components/chat-ai/ChatBotAI";
import { useChatBotAiContext } from "@/store/context/ChatBotAi";
export default function Home() {
  const renderHomepage = (type: string) => {
    switch (type) {
      case UserRole.STUDENT:
        return <HomePageForStudent />;
      case UserRole.TEACHER:
        return <HomePageForTeacher />;
      default:
        return <HomePageForStudent />;
    }
  };
  const { user } = useUserContext();
  const { isOpenChatBotAi } = useChatBotAiContext();
  return (
    <>
      <MainLayout>
        <div>
          {renderHomepage(user.role)}
          {}
          {isOpenChatBotAi && (
            <div className="fixed bottom-10 z-50 right-12 w-[500px]">
              <ChatBotAI />
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
}
