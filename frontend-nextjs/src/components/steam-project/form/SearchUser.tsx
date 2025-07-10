import { SearchUserForm, SearchUserFormType } from "@/types/Type";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CiSearch } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function SearchUser() {
  const form = useForm<SearchUserFormType>({
    resolver: zodResolver(SearchUserForm),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (values: SearchUserFormType) => {
    console.log(values);
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thêm thành viên mới</FormLabel>
                <FormControl>
                  <div className="relative ">
                    <Input
                      {...field}
                      type="text"
                      placeholder="Nhập email để tìm người dùng"
                      className="input w-full p-2 rounded  focus-visible:ring-blue-400/50 focus-visible:ring-[2px] focus-visible:border-blue-500/50"
                    />
                    <Button className="absolute right-0 top-1/2 -translate-y-1/2 h-full p-3 rounded bg-green-500">
                      <CiSearch />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
