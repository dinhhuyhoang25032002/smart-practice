"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { vi } from "date-fns/locale";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CreateSteamProjectFormType,
  CreateSteamProjectForm,
} from "@/types/Type";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { Headers, HttpStatus } from "@/constant/constant";
import { toast } from "sonner";
import { KeyedMutator } from "swr";
import { ResListSteamProjects } from "@/app/(container)/du-an-steam/page";
type CreateSteamProjectProps = {
  setIsCreateProject: Dispatch<SetStateAction<boolean>>;
  mutate: KeyedMutator<ResListSteamProjects>;
};
export default function CreateSteamProject({
  setIsCreateProject,
  mutate,
}: CreateSteamProjectProps) {
  const form = useForm<CreateSteamProjectFormType>({
    resolver: zodResolver(CreateSteamProjectForm),
    defaultValues: {
      name: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    },
  });
  const onSubmit = async (values: CreateSteamProjectFormType) => {
    const res = await fetchPrivateData(`steam/create-steam-project`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: Headers,
    });
    console.log(res);

    if (res.status === HttpStatus.BADREQUEST) {
      toast.warning(
        "Đã xảy ra lỗi trong quá trình tạo dự án mới hãy thử lại sau."
      );
      return;
    }
    if (res.status !== HttpStatus.CREATED) {
      toast.warning(res.message, {
        style: { background: "#BE9525", color: "white" },
      });
      return;
    }
    toast.success(res.message, {
      style: { background: "green", color: "white" },
    });
    setIsCreateProject(false);
    mutate();
    return;
  };
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full text-center text-xl font-medium">
        Hoàn tất các thông tin để có thể tạo dự án Steam mới!
      </div>
      <Form {...form}>
        <form
          className="w-full flex flex-col gap-4 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên dự án</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Nhập tên dự án"
                    className="input w-full p-2  focus-visible:ring-blue-400/50 focus-visible:ring-[2px] focus-visible:border-blue-500/50"
                  />
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
                <FormLabel>Mô tả dự án</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Nhập mô tả dự án"
                    className="  w-full min-h-20 p-2 focus-visible:border-blue-500/50 focus-visible:ring-blue-400/50 focus-visible:ring-[2px] "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-end justify-between">
            <div className="flex-1 flex gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: vi })
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
                name="endDate"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Ngày kết thúc</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: vi })
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
            <div className="flex gap-4">
              <Button type="submit" className="">
                Tạo mới
              </Button>
              <Button onClick={() => setIsCreateProject(false)} className="">
                Hủy bỏ
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
