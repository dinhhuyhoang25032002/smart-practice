import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { AddLessonFormType, AddLessonForm } from "@/types/Type";

type AddLessonProps = {
    courseId: string;
    onSubmit: (data: AddLessonFormType) => void;
}
export default function AddLesson({ courseId, onSubmit }: AddLessonProps) {
  const form = useForm<AddLessonFormType>({
    resolver: zodResolver(AddLessonForm),
    defaultValues: {
      name: "",
      course: courseId,
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-3" >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tên bài học</FormLabel>
              <FormControl>
                <Input
                  placeholder="Tên bài học"
                  className="bg-white"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">Thêm bài học</Button>
      </form>
    </Form>
  );
}
