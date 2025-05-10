"use client";
import { CreateACourseForm, CreateACourseFormType } from "@/types/Type";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ImgInfo } from "@/components/course/section/FormSendResult";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  toastNotiFail,
  toastNotiSuccess,
} from "@/components/custom/ToastNotification";
import { NumericFormat } from "react-number-format";
import { IoMdClose } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";

import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { HttpStatus } from "@/constant/constant";

export default function CreateCourseForm() {
  const form = useForm<CreateACourseFormType>({
    resolver: zodResolver(CreateACourseForm),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      image: undefined,
      video: "",
      price: "",
    },
  });

  const [imgInfor, setImgInfo] = useState<ImgInfo>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDropImage = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      const file = acceptedFiles[0];

      form.setValue("image", file);
      const reader = new FileReader();
      reader.onload = () => {
        setImgInfo({
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1024),
          src: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    onDrop: onDropImage,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  const handleDeleteImage = () => {
    setImgInfo(undefined);
    form.setValue("image", new File([], ""));
  };

  const onSubmit = async (values: CreateACourseFormType) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetchPrivateData(`course/create-course`, {
        method: "POST",
        body: formData,
      });
      if (response && response.status === HttpStatus.BADREQUEST) {
        toastNotiFail(response.message);
        return;
      }
      toastNotiSuccess(response.message);
      form.reset();
      setImgInfo(undefined);
    } catch (error) {
      console.log(error);
      toastNotiFail("Có lỗi xảy ra khi tạo khóa học!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex items-center justify-center"
        >
          <div className="space-y-5 p-6 rounded-sm shadow-lg w-full bg-white">
            <div className="text-2xl font-semibold uppercase text-center">
              Thông tin khóa học
            </div>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã khóa học</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Nhập mã khóa học"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khóa học</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Nhập tên khóa học"
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
                  <FormLabel>Mô tả khóa học</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Nhập mô tả khóa học"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá khóa học (VNĐ)</FormLabel>
                  <FormControl>
                    <NumericFormat
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue?.toString() || "");
                      }}
                      thousandSeparator="."
                      decimalSeparator=","
                      suffix=" VNĐ"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Nhập giá khóa học"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Ảnh khóa học</FormLabel>
                  <div
                    {...getImageRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <input type="file" {...getImageInputProps()} />
                    {imgInfor ? (
                      <div className="space-y-2 relative">
                        <Button
                          type="button"
                          onClick={handleDeleteImage}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md"
                        >
                          <IoMdClose className="text-gray-600" />
                        </Button>
                        <Image
                          src={imgInfor.src as string}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="max-h-32 mx-auto object-contain"
                        />
                        <p className="text-sm text-gray-500 flex flex-col">
                          <span>Tên ảnh: {imgInfor.name}</span>
                          <span>Kích thước: ({imgInfor.size} KB)</span>
                        </p>
                      </div>
                    ) : isImageDragActive ? (
                      <p className="text-blue-500">Thả ảnh vào đây...</p>
                    ) : (
                      <p className="text-gray-500 inline-flex items-center gap-2">
                        <IoCloudUploadOutline className="text-2xl text-gray-400" />{" "}
                        Kéo hoặc chọn ảnh khóa học
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video khóa học</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white"
                      placeholder="Nhập link video khóa học"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Tạo khóa học"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
