"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { RiPenNibLine } from "react-icons/ri";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddLessonFormType,
  EditCourseForm,
  EditCourseFormType,
} from "@/types/Type";
import Image from "next/image";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { CourseContent } from "@/types/CustomType";
import { useState, useEffect, useCallback } from "react";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IoMdClose } from "react-icons/io";
import EditLessonFormContent from "../lessons/EditLessonForm";
import AddLesson from "../lessons/AddLesson";
import NotFound from "@/app/not-found";
import _ from "lodash";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { toastNotiFail } from "@/components/custom/ToastNotification";
import { Headers, HttpStatus } from "@/constant/constant";
import { toastNotiSuccess } from "@/components/custom/ToastNotification";
// import UploadFile from "@/components/custom/UploadFile";
type EditCourseContentProps = {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
};
export default function EditCourseContent({
  isEditing,
  setIsEditing,
}: EditCourseContentProps) {
  const form = useForm<EditCourseFormType>({
    resolver: zodResolver(EditCourseForm),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      price: "",
      type: "",
      video: "",
      image: "",
    },
  });
  const params = useParams();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<string>("");

  const [isEditingLesson, setIsEditingLesson] = useState<boolean>(false);
  const [lessonId, setLessonId] = useState<string>("");
  const slug = params.slug;
  const { data, isLoading, mutate } = useSWRPrivate<CourseContent>(
    `course/${slug}`
  );
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        code: data.code || "",
        description: data.description || "",

        price: data.price?.toString() || "",
        type: data.type || "",
        video: data.video || "",
        image: data.image || "",
      });
      if (data.image) {
        setPreviewImage(data.image);
      }
      if (data.video) {
        setCurrentVideo(data.video);
      }
    }
  }, [data, form]);

  const onSubmitCreateALesson = useCallback(
    async (data: AddLessonFormType) => {
      console.log(data);
      const res = await fetchPrivateData(`lesson`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res && res.status !== HttpStatus.OK) {
        toastNotiFail(res.message);
        return;
      }
      await mutate();
      toastNotiSuccess("Thêm bài học thành công");

      console.log(res);
    },
    [mutate]
  );

  const onSubmit = async (values: EditCourseFormType) => {
    console.log(values);
    try {
      const response = await fetchPrivateData(`/course/update/${data?._id}`, {
        method: "PUT",
        body: JSON.stringify(values),
        headers: Headers,
      });

      if (response && response.status === HttpStatus.OK) {
        await mutate(); // Cập nhật lại data
        setIsEditing(false);
        toastNotiSuccess(response.message);
        return;
      }
      if (response && response.status === HttpStatus.NOT_FOUND) {
        toastNotiFail(response.message);
        return;
      }
      toastNotiFail("Cập nhật khóa học thất bại");
    } catch (error) {
      console.error(error);
      toastNotiFail("Cập nhật khóa học thất bại");
    }
  };
  const handleOpenEditLesson = (lessonId: string) => {
    setIsEditingLesson(true);
    setLessonId(lessonId);
  };
  if (isLoading) return <Loading />;
  if ((data && "status" in data) || _.isEmpty(data)) {
    return <NotFound />;
  }

  return (
    <div className="space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-lg font-medium">Thông tin khóa học</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khóa học</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="Nhập tên khóa học"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã khóa học</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="Nhập mã khóa học"
                      className="bg-white"
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
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại khóa học</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="Nhập loại khóa học"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">
                  Mô tả khóa học
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={!isEditing}
                    placeholder="Nhập mô tả khóa học"
                    className="min-h-[100px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-start gap-10 h-full ">
            <div className="space-y-5 w-1/2 flex h-full  ">
              {isEditing ? (
                <div className="flex items-center flex-col flex-1 gap-5">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className=" w-full">
                        <FormLabel className="text-lg font-medium">
                          Ảnh khóa học
                        </FormLabel>
                        <FormControl className="">
                          <Input
                            {...field}
                            placeholder="Nhập link ảnh khóa học"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Image
                    src={form.watch("image") as string}
                    alt="Không có ảnh hoặc bị lỗi."
                    priority
                    width={500}
                    height={500}
                    className="aspect-video border-2 text-center text-gray-500 leading-24 font-medium border-gray-300 rounded-lg w-full"
                  />
                </div>
              ) : previewImage ? (
                <div className="w-full flex items-center justify-center ">
                  <div className="w-full  flex flex-col rounded-lg items-center gap-2">
                    <span className="text-lg font-medium w-full">
                      Ảnh khóa học
                    </span>
                    <Image
                      src={previewImage}
                      alt="Không có ảnh hoặc bị lỗi."
                      priority
                      width={500}
                      height={500}
                      className=" w-full  aspect-video border-2 border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Không có hình ảnh khóa học</p>
                </div>
              )}
            </div>

            <div className="space-y-5 w-1/2">
              {isEditing ? (
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">
                          Video giới thiệu
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              value={field.value}
                              onChange={(e) => {
                                const newValue = e.target.value;
                                field.onChange(newValue);
                                setCurrentVideo(newValue || data?.video || "");
                              }}
                              placeholder="Nhập link video YouTube"
                              className="bg-white pr-10"
                            />
                            {field.value && (
                              <Button
                                type="button"
                                onClick={() => {
                                  const defaultVideo = data?.video || "";
                                  field.onChange(defaultVideo);
                                  setCurrentVideo(defaultVideo);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 bg-white hover:bg-gray-100 rounded-full"
                              >
                                <IoMdClose className="text-gray-600" />
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center flex-col gap-2">
                  <span className="text-lg font-medium  w-full">
                    Video giới thiệu
                  </span>
                </div>
              )}
              <div className="aspect-video rounded-lg bg-gray-100 w-full">
                {currentVideo ? (
                  <iframe
                    src={currentVideo}
                    allowFullScreen
                    title="YouTube course video player"
                    className="w-full h-full rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">
                      Khóa học của bạn chưa có video
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end">
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                Lưu thay đổi
              </Button>
            </div>
          )}
        </form>
      </Form>
      <div className="space-y-2 bg-white p-3">
        <span className="text-lg font-medium">Danh sách các bài học </span>
        <div className="flex flex-wrap gap-4 justify-between items-center w-full p-5 ">
          {data &&
            data?.lessons?.length > 0 &&
            data?.lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex items-center justify-between gap-2 w-[45%] rounded-md bg-gray-100 p-4"
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <span className="text-sm font-medium">{lesson.name}</span>
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <Button onClick={() => handleOpenEditLesson(lesson._id)}>
                        <RiPenNibLine />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          <div className="w-full flex items-center justify-center bg-gray-100 flex-col p-5">
            {data && data?.lessons?.length > 0 ? (
              <p className="text-gray-500  p-5 rounded-md w-full flex items-center justify-center">
                Khóa học của bạn đang có {data?.lessons?.length} bài học
              </p>
            ) : (
              <p className="text-gray-500  p-5 rounded-md w-full flex items-center justify-center">
                Khóa học của bạn chưa có bài học
              </p>
            )}
            {isEditing && (
              <div className="flex items-center justify-center gap-5  w-1/3 bg-white rounded-md p-2">
                <AddLesson
                  courseId={data?._id}
                  onSubmit={onSubmitCreateALesson}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isEditingLesson && (
        <EditLessonFormContent
          lessonId={lessonId}
          nameCourse={data?.name}
          key={lessonId}
        />
      )}

      {/* <UploadFile/> */}
    </div>
  );
}
