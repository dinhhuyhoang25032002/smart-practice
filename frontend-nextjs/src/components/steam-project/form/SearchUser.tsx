"use client";
import { SearchUserForm, SearchUserFormType } from "@/types/Type";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction } from "react";
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
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { Headers, HttpStatus } from "@/constant/constant";
type SearchUserProps = {
  searchUserResult: { _id: string; fullname: string } | null;
  setSearchUserResult: Dispatch<
    SetStateAction<{
      _id: string;
      fullname: string;
    } | null>
  >;
};

export default function SearchUser({
  searchUserResult,
  setSearchUserResult,
}: SearchUserProps) {
  const [isSearch, setIsSearch] = React.useState(false);

  const form = useForm<SearchUserFormType>({
    resolver: zodResolver(SearchUserForm),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: SearchUserFormType) => {
    console.log(values);
    const res = await fetchPrivateData(`user/search-user`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: Headers,
    });
    setIsSearch(true);
    if (res?.status === HttpStatus.OK) {
      setSearchUserResult(res.data);
      return;
    }
    setSearchUserResult(null);
    console.log(res);
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
                  <div className="relative">
                    <Input
                      {...field}
                      type="text"
                      placeholder="Nhập email để tìm người dùng"
                      className="input w-full p-2 rounded  focus-visible:ring-blue-400/50 focus-visible:ring-[2px] focus-visible:border-blue-500/50"
                    />
                    <Button className="absolute right-0 top-1/2 -translate-y-1/2 h-full p-3 rounded bg-green-500">
                      <CiSearch />
                    </Button>
                    {isSearch ? (
                      searchUserResult ? (
                        <div className="absolute text-center  left-0 top-full w-full bg-white border border-gray-300 p-2 rounded mt-1">
                          {searchUserResult.fullname} - {searchUserResult._id}
                        </div>
                      ) : (
                        <div className="absolute left-0 text-center top-full w-full bg-white border border-gray-300 p-2 rounded mt-1">
                          Không tìm thấy người dùng
                        </div>
                      )
                    ) : null}
                    <div></div>
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
