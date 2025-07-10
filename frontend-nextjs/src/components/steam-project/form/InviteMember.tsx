import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import SearchUser from "./SearchUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteMemberForm, InviteMemberFormType } from "@/types/Type";
import { Input } from "@/components/ui/input";
import { PiAirplaneTakeoff } from "react-icons/pi";
import { Button } from "@/components/ui/button";
export default function InviteMember() {
  const [searchUserResult, setSearchUserResult] = useState<{
    _id: string;
    fullname: string;
  } | null>(null);
  const form = useForm<InviteMemberFormType>({
    resolver: zodResolver(InviteMemberForm),
    defaultValues: {
      teamNumber: "",
    },
  });
  const onSubmit = (values: InviteMemberFormType) => {
    console.log(values);
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger className="bg-white p-2 inline-flex h-10 cursor-pointer items-center gap-2 text-black border border-gray-500 rounded hover:bg-[#041ec4] hover:text-white">
          Thêm thành viên
        </DialogTrigger>
        <DialogContent className="bg-green-50">
          <DialogHeader>
            <DialogTitle className="text-center">
              Thêm mới thành viên
            </DialogTitle>
            <DialogDescription className="text-center">
              Hoàn thành tất cả thông tin để mời thành viên mới vào dự án.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full space-y-5 ">
            <SearchUser
              searchUserResult={searchUserResult}
              setSearchUserResult={setSearchUserResult}
            />
            <Form {...form}>
              <form
                className="space-y-5 flex flex-col items-end"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="teamNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nhóm tham gia</FormLabel>
                      <FormControl>
                        <div className="relative ">
                          <Input
                            {...field}
                            type="text"
                            placeholder="Nhập số nhóm tham gia"
                            className="input w-full p-2 rounded  focus-visible:ring-blue-400/50 focus-visible:ring-[2px] focus-visible:border-blue-500/50"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  effect="expandIcon"
                  icon={PiAirplaneTakeoff}
                  iconPlacement="right"
                >
                  Gửi lời mời
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
