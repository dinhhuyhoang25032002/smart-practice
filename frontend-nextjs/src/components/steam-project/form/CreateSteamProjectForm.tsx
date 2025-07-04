"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CreateSteamProjectFormType,
  CreateSteamProjectForm,
} from "@/types/Type";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
type CreateSteamProjectProps = {
  setIsCreateProject: Dispatch<SetStateAction<boolean>>;
};
export default function CreateSteamProject({
  setIsCreateProject,
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
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full text-center text-xl font-medium">
        Hoàn tất các thông tin để có thể tạo dự án Steam mới!
      </div>
      <Form {...form}>
        <form className="w-full flex flex-col gap-4">
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
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        type="date"
                        className="input input-bordered w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        className="input input-bordered w-full"
                      />
                    </FormControl>
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
