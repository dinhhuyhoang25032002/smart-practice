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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchUser from "./SearchUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteMemberForm, InviteMemberFormType } from "@/types/Type";
import { Input } from "@/components/ui/input";
import { PiAirplaneTakeoff } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { useSearchParams } from "next/navigation";
import { Headers, HttpStatus, ROLE_STEAM_PROJECT } from "@/constant/constant";
import { toast } from "sonner";
export default function InviteMember() {
  const [isOpen, setOpen] = useState(false);
  const [searchUserResult, setSearchUserResult] = useState<{
    _id: string;
    fullname: string;
  } | null>(null);
  const projectId = useSearchParams().get("q");
  const form = useForm<InviteMemberFormType>({
    resolver: zodResolver(InviteMemberForm),
    defaultValues: {
      teamNumber: "",
      role: "",
    },
  });
  const onSubmit = async (values: InviteMemberFormType) => {
    console.log(values);
    console.log("Project ID:", projectId, searchUserResult?._id);

    if (!searchUserResult?._id || !projectId) {
      console.log("Không có thành viên hoặc dự án nào được chọn");

      return;
    }
    const res = await fetchPrivateData(`steam/invite-steam-member`, {
      method: "POST",
      body: JSON.stringify({
        ...values,
        projectId,
        memberId: searchUserResult?._id,
      }),
      headers: Headers,
    });
    if (res.status !== HttpStatus.CREATED) {
      toast.warning(res.message);
      return;
    }
    toast.success(res.message);
    setOpen(false);
    setSearchUserResult(null);
    form.reset();
  };
  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setSearchUserResult(null);
          setOpen(!isOpen);
        }}
      >
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
            {searchUserResult ? (
              <div className="flex gap-2 justify-between flex-col">
                <span className="font-medium text-sm">
                  Họ và tên thành viên
                </span>
                <Input
                  defaultValue={searchUserResult.fullname}
                  className="pointer-events-none"
                />
              </div>
            ) : (
              <SearchUser
                searchUserResult={searchUserResult}
                setSearchUserResult={setSearchUserResult}
              />
            )}

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
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Vai trò</FormLabel>
                      <FormControl>
                        <div className="relative ">
                          <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger className="input w-full p-2 rounded  focus-visible:ring-blue-400/50 focus-visible:ring-[2px] focus-visible:border-blue-500/50">
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value={ROLE_STEAM_PROJECT.LEADER_TEAM}
                              >
                                Trưởng nhóm
                              </SelectItem>
                              <SelectItem value={ROLE_STEAM_PROJECT.MEMBER}>
                                Thành viên
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
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
