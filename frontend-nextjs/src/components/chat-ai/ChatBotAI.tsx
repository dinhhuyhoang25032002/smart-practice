"use client";
import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { TbWorld } from "react-icons/tb";
import { BsLightbulb } from "react-icons/bs";
import { IoMicOutline } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Chatbot, ChatbotType } from "@/types/Type";
import Image from "next/image";
import aiService from "@/assets/image/service/Chatbot_service.png";
import { Button } from "../ui/button";

export default function ChatBotAI() {
  const form = useForm<ChatbotType>({
    resolver: zodResolver(Chatbot),
    defaultValues: {
      message: "",
    },
  });

  async function onSubmit(values: ChatbotType) {
    console.log(values);
  }

  const question = form.watch("message");

  const responsive = "";
  return (
    <div
      className={`w-full bg-white p-9 rounded-sm flex items-center flex-col ${
        question ? "justify-between pt-6" : "justify-center h-full"
      }`}
    >
      {question && responsive ? (
        <div className=" flex gap-2 flex-col w-full h-[400px]  bg-red-400 overflow-auto rounded-md">
          <div className="flex items-center justify-end ">
            <div className="flex gap-2 items-center justify-end rounded-3xl bg-gray-300  p-3 w-fit">
              {question} <RxAvatar className="cursor-pointer text-2xl" />
            </div>
          </div>
          <div className="flex gap-2 items-center justify-start p-3">
            <Image
              src={aiService}
              alt={"ai-chat"}
              className="w-8 h-8 object-contain rounded-full  "
            />
            {responsive}
          </div>
        </div>
      ) : null}
      <Form {...form}>
        <section className=" h-fit py-4 rounded-md w-full ">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 h-fit py-4"
          >
            <div className="flex flex-col text-center">
              <span className=" text-3xl font-semibold">
                Tôi có thể giúp gì được cho bạn ?
              </span>
            </div>

            <div className="border-2 border-gray-300 rounded-2xl flex flex-col gap-4 p-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Nhắn tin cho Chat Bot"
                        {...field}
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 border-none placeholder-shown:bg-[#e7f5ff]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center px-3">
                <div className="flex gap-3 items-center">
                  <Button className=" hover:bg-gray-300 border-2 border-gray-200 bg-transparent text-gray-600 rounded-full  w-9 h-9 flex items-center justify-center">
                    <FaPlus />
                  </Button>
                  <Button className="hover:bg-gray-300 bg-transparent flex gap-1 py-2 px-3 items-center justify-center border-2 border-gray-200 h-9 rounded-3xl text-gray-600">
                    <TbWorld /> <span>Tìm kiếm</span>
                  </Button>
                  <Button className="hover:bg-gray-300 bg-transparent flex gap-1 py-2 px-3 items-center justify-center border-2 border-gray-200 h-9 rounded-3xl text-gray-600">
                    <BsLightbulb /> <span>Suy luận</span>
                  </Button>
                </div>
                {!question ? (
                  <div>
                    <Button
                      type="submit"
                      className="h-9 w-9 border-2 bg-transparent border-gray-200 rounded-full text-gray-600 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <IoMicOutline />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      type="submit"
                      className="h-9 w-9 bg-transparent border-2 border-gray-200 rounded-full text-gray-600 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <FaArrowUp />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
          <div className="text-xs text-center ">
            Chat Bot AI có thể mắc lỗi. Hãy kiểm tra các thông tin quan trọng.
          </div>
        </section>
      </Form>
    </div>
  );
}
