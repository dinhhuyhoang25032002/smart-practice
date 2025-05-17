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
import { EditCourseForm, EditCourseFormType } from "@/types/Type";
import Image from "next/image";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { CourseContent } from "@/types/CustomType";
import { useCallback, useState, useEffect } from "react";
import { Headers } from "@/constant/constant";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { toastNotiFail } from "@/components/custom/ToastNotification";
import { useDropzone } from "react-dropzone";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toastNotiSuccess } from "@/components/custom/ToastNotification";
import { IoMdClose } from "react-icons/io";
import { IoCloudUploadOutline } from "react-icons/io5";
import EditLessonFormContent from "../lessons/EditLessonForm";
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
      image: null,
    },
  });
  const params = useParams();
  const [previewImage, setPreviewImage] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
        //  image: data.image ? new File([], data.image) : null,
      });
      if (data.image) {
        setPreviewImage(data.image);
      }
      if (data.video) {
        setCurrentVideo(data.video);
      }
    }
  }, [data, form]);
  const onDropImage = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      const file = acceptedFiles[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        form.setValue("image", file, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropImage,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: false,
  });
  const onSubmit = async (values: EditCourseFormType) => {
    console.log(values);
    // try {
    //   const formDataToSend = new FormData();

    //   // Thêm các trường thông tin
    //   Object.entries(values).forEach(([key, value]) => {
    //     formDataToSend.append(key, value);
    //   });

    //   // Thêm ảnh nếu có
    //   if (selectedImage) {
    //     formDataToSend.append("image", selectedImage);
    //   }

    //   const response = await fetch(`/api/course/${slug}`, {
    //     method: "PUT",
    //     headers: {
    //       ...Headers,
    //     },
    //     body: formDataToSend,
    //   });

    //   if (!response.ok) throw new Error("Failed to update course");

    //   await mutate(); // Cập nhật lại data
    //   setIsEditing(false);
    //   setSelectedImage(null);
    //   toastNotiSuccess("Cập nhật khóa học thành công");
    // } catch (error) {
    //   console.error(error);
    //   toastNotiFail("Cập nhật khóa học thất bại");
    // }
  };
  const handleOpenEditLesson = (lessonId: string) => {
    setIsEditingLesson(true);
    setLessonId(lessonId);
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setPreviewImage(data?.image || "");
    form.setValue("image", null, { shouldValidate: true });
  };

  if (isLoading) return <Loading />;
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
          <div className="flex justify-between items-start gap-10 ">
            <div className="space-y-5 w-1/2 flex ">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">
                      Ảnh khóa học
                    </FormLabel>
                    <FormControl className="">
                      {isEditing ? (
                        <div
                          {...getRootProps()}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center"
                        >
                          <input
                            type="file"
                            {...getInputProps()}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                onDropImage([e.target.files[0]]);
                              }
                            }}
                          />
                          {previewImage ? (
                            <div className="aspect-video space-y-2 relative w-full h-full flex flex-col items-center justify-center">
                              <Button
                                type="button"
                                onClick={handleDeleteImage}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-md"
                              >
                                <IoMdClose className="text-gray-600" />
                              </Button>
                              <Image
                                src={previewImage}
                                alt="Preview"
                                width={500}
                                priority
                                height={500}
                                className="mx-auto object-contain w-full h-full"
                              />
                              {selectedImage && (
                                <p className="text-sm text-gray-500 flex flex-col">
                                  <span>Tên ảnh: {selectedImage.name}</span>
                                  <span>
                                    Kích thước:{" "}
                                    {Math.round(selectedImage.size / 1024)} KB
                                  </span>
                                </p>
                              )}
                            </div>
                          ) : isDragActive ? (
                            <p className="text-blue-500">Thả ảnh vào đây...</p>
                          ) : (
                            <p className="text-gray-500 inline-flex items-center gap-2">
                              <IoCloudUploadOutline className="text-2xl text-gray-400" />
                              Kéo hoặc chọn ảnh khóa học
                            </p>
                          )}
                        </div>
                      ) : previewImage ? (
                        <div className="relative w-full flex-1 flex items-center justify-center">
                          <div className="w-full h-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center p-5">
                            <Image
                              src={previewImage}
                              alt="Course image"
                              priority
                              width={500}
                              height={500}
                              className="object-contain w-auto h-auto border-2 border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center">
                          <p>Không có hình ảnh khóa học</p>
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              ) : null}
              <div className="flex-1 flex items-center justify-center">
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
          </div>

          <div className="space-y-2">
            <span className="text-lg font-medium">Danh sách các bài học </span>
            <div className="flex flex-wrap gap-4 justify-between items-center w-full p-5">
              {data && data?.lessons?.length > 0 ? (
                data?.lessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="flex items-center justify-between gap-2 w-[45%] rounded-md bg-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <span className="text-sm font-medium">{lesson.name}</span>
                      <div className="flex items-center gap-2">
                        {isEditing && (
                          <Button
                            onClick={() => handleOpenEditLesson(lesson._id)}
                          >
                            <RiPenNibLine />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  Khóa học của bạn chưa có bài học
                </p>
              )}
            </div>
          </div>
          {isEditing && (
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              Lưu thay đổi
            </Button>
          )}
        </form>
      </Form>
      {isEditingLesson && <EditLessonFormContent lessonId={lessonId} />}
    </div>
  );
}
