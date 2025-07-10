"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { vi } from "date-fns/locale";
import { FaRegSquarePlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateSteamTaskType, CreateSteamTaskForm } from "@/types/Type";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { Headers, HttpStatus } from "@/constant/constant";
import { toast } from "sonner";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { ResSteamTask } from "../SectionTaskList";
type CreateSteamTaskProps = {
  mutate: KeyedMutator<ResSteamTask>;
};

export default function CreateSteamTask({ mutate }: CreateSteamTaskProps) {
  const projectId = useSearchParams().get("q");
  const [isOpen, setOpen] = useState(false);
  const form = useForm<CreateSteamTaskType>({
    resolver: zodResolver(CreateSteamTaskForm),
    defaultValues: {
      name: "",
      deadline: undefined,
      startDate: undefined,
      description: "",
    },
  });
  const onSubmit = async (values: CreateSteamTaskType) => {
    console.log({ ...values, projectId });
    const res = await fetchPrivateData(`steam/create-steam-task`, {
      method: "POST",
      body: JSON.stringify({
        ...values,
        projectId,
      }),
      headers: Headers,
    });

    if (res.status !== HttpStatus.CREATED) {
      toast.warning(res.message);
      return;
    }

    form.reset();
    toast.success(res.message);
    setOpen(false);
    mutate();
    return;
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => setOpen(!isOpen)}>
      <DialogTrigger className="bg-white p-2 inline-flex h-10 cursor-pointer items-center gap-2 text-black border border-gray-500 rounded hover:bg-[#041ec4] hover:text-white">
        <FaRegSquarePlus />
        Tạo mới
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Tạo nhiệm vụ mới</DialogTitle>
          <DialogDescription className="text-center">
            Hoàn thành tất cả thông tin để tạo nhiệm vụ mới
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên nhiệm vụ</FormLabel>
                    <FormControl>
                      <div className="relative ">
                        <Input
                          {...field}
                          type="text"
                          placeholder="Nhập tên nhiệm vụ"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả nhiệm vụ</FormLabel>
                    <FormControl>
                      <div className="relative ">
                        <Textarea
                          {...field}
                          placeholder="Nhập mô tả nhiệm vụ"
                          className="input w-full p-2 rounded  focus-visible:ring-blue-400/50 focus-visible:ring-[2px] focus-visible:border-blue-500/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex-1 flex gap-4 justify-between ">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-1/2">
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                " pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Chọn một ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            locale={vi}
                            onSelect={field.onChange} // KẾT NỐI TẠI ĐÂY
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SỬA LẠI DATE PICKER CHO endDate */}
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Ngày kết thúc</FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Chọn một ngày</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            locale={vi}
                            selected={field.value}
                            onSelect={field.onChange} // KẾT NỐI TẠI ĐÂY
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="w-full"
                effect={"expandIcon"}
                type="submit"
                icon={ArrowRightIcon}
                iconPlacement="right"
              >
                Tạo mới
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
