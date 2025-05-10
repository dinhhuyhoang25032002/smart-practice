"use client";

import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

type ChatBotAiContextType = {
  isOpenChatBotAi: boolean;
  setOpenChatBotAi: Dispatch<SetStateAction<boolean>>;
};

const initialUser: ChatBotAiContextType = {
  isOpenChatBotAi: false,
  setOpenChatBotAi: () => {},
};

export const ChatBotAiContext =
  createContext<ChatBotAiContextType>(initialUser);

export function ChatBotAiProvider({ children }: { children: React.ReactNode }) {
  const [isOpenChatBotAi, setOpenChatBotAi] = useState(false);
  return (
    <ChatBotAiContext.Provider value={{ isOpenChatBotAi, setOpenChatBotAi }}>
      {children}
    </ChatBotAiContext.Provider>
  );
}

export function useChatBotAiContext() {
  return useContext(ChatBotAiContext);
}
