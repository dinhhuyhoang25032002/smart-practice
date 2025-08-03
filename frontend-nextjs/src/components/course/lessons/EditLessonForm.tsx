"use client";

import { Button } from "@/components/ui/button";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { IndexItemProps, Lesson } from "@/types/CustomType";
import { RiAddCircleLine, RiDeleteBack2Line } from "react-icons/ri";
// import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditLessonForm, EditLessonFormType } from "@/types/Type";
import { BsCameraVideo } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import UploadFile from "@/components/custom/UploadFile";
import EditLessonContentForm from "@/components/course/lessons/EditLessonContentForm";
import SectionLesson from "@/components/course/section/SectionLesson";
import Loading from "@/app/loading";
import { v4 as uuidv4 } from "uuid";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { Headers, HttpStatus } from "@/constant/constant";
import {
  toastNotiFail,
  toastNotiSuccess,
} from "@/components/custom/ToastNotification";
type EditLessonFormContentProps = {
  lessonId: string;
  nameCourse: string | undefined;
};
export default function EditLessonFormContent({
  lessonId,
  nameCourse,
}: EditLessonFormContentProps) {
  const form = useForm<EditLessonFormType>({
    resolver: zodResolver(EditLessonForm),
    defaultValues: {
      name: "",
      indexItem: [],
      content: [],
      course: {
        _id: "",
        name: "",
      },
      idFrontLesson: {
        _id: "",
        name: "",
      },
      video: "",
      image: "",
    },
  });
  // const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const [newItemIndexContent, setNewItemIndexContent] = useState<string>("");
  const [addingToItemId, setAddingToItemId] = useState<string | null>(null);

  const { data, isLoading } = useSWRPrivate<Lesson>(
    `lesson?lessonId=${lessonId}`
  );

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name || "",
        course: {
          _id: data?.course?._id || "",
          name: data?.course?.name || nameCourse,
        },
        indexItem: data?.indexItem || [],
        content: data?.content || [],
        idFrontLesson: {
          _id: data?.idFrontLesson?._id || "",
          name: data?.idFrontLesson?.name || "",
        },
        video: data?.video || "",
        image: data?.linkImage || "",
      });
    }
  }, [data, form, nameCourse]);
  if (isLoading) return <Loading />;
  const onSubmit = async (data: EditLessonFormType) => {
   
    try {
      const res = await fetchPrivateData(`lesson/${lessonId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: Headers,
      });
      if (res && res.status === HttpStatus.OK) {
        toastNotiSuccess(res.message);
        return;
      }
      if (res && res.status === HttpStatus.NOT_FOUND) {
        toastNotiFail(res.message);
        return;
      }
      toastNotiFail("Cập nhật khóa học thất bại");
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddIndexItem = (indexItem: IndexItemProps) => {
    console.log(form.getValues("indexItem"));
    setAddingToItemId(indexItem._id);
  };
  const handleSaveNewItem = () => {
    if (!newItemIndexContent.trim()) return;

    const updatedIndexItems = [...form.getValues("indexItem")];
    const updatedContent = [...form.getValues("content")];

    const insertIndex =
      updatedIndexItems.findIndex((item) => item._id === addingToItemId) + 1;
    const newIndexItem = {
      _id: uuidv4(),
      nameItem: newItemIndexContent.trim(),
    };

    // Thêm mục lục mới
    updatedIndexItems.splice(insertIndex, 0, newIndexItem);

    // Thêm content mới tương ứng
    updatedContent.splice(insertIndex, 0, {
      contentText: [],
      dataImage: undefined,
      dataList: undefined,
      dataList2: undefined,
      dataMerge: undefined,
      dataPlus: undefined,
      codeSample: "",
      dataVideo: undefined,
      dataSlides: undefined,
      dataTab: undefined,
    });

    form.setValue("indexItem", updatedIndexItems, { shouldValidate: true });
    form.setValue("content", updatedContent, { shouldValidate: true });
    setAddingToItemId(null);
    setNewItemIndexContent("");
  };
  const handleDeleteIndexItem = (indexItemId: string) => {
    const updatedIndexItems = form
      .getValues("indexItem")
      .filter((item) => item._id !== indexItemId);

    // Tìm vị trí index của mục lục bị xóa
    const deleteIndex = form
      .getValues("indexItem")
      .findIndex((item) => item._id === indexItemId);

    // Xóa content ở vị trí tương ứng
    const updatedContent = [...form.getValues("content")];
    if (deleteIndex !== -1) {
      updatedContent.splice(deleteIndex, 1);
    }

    form.setValue("indexItem", updatedIndexItems, { shouldValidate: true });
    form.setValue("content", updatedContent, { shouldValidate: true });
  };

  return (
    <div className="mt-8">
      {data ? (
        <div className="space-y-4 border-t pt-4">
          <div className="flex gap-2 items-center">
            <h3 className="text-lg font-medium">Chỉnh sửa bài học:</h3>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-between items-center flex-col bg-gray-100 p-3  rounded-md space-y-5">
                <div className="flex gap-3 w-full">
                  <FormField
                    control={form.control}
                    name="course.name"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel className="text-lg font-medium">
                          Tên khóa học
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Tên khóa học" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel className="text-lg font-medium">
                          Tên bài học
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Tên bài học" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="idFrontLesson.name"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel className="text-lg font-medium ">
                          Tên bài học phía trước
                          <div className="flex items-center gap-1 group relative">
                            <RiErrorWarningLine className="" />
                            <span className="text-sm text-red-500 hidden group-hover:block group-active:block absolute top-2 left-4 w-[200px] bg-white p-2 rounded-sm text-justify">
                              Nếu bài học này là bài học đầu tiên của khóa học,
                              thì trường này sẽ có nội dung giống tên bài học.
                            </span>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Tên bài học phía trước"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 w-full">
                  <div className="flex gap-3  w-1/3 flex-col">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-lg font-medium">
                            Ảnh bài học
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Ảnh bài học" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch("image") ? (
                      <div className="w-full h-[200px]">
                        <Image
                          src={form.watch("image") as string}
                          alt="Ảnh không hợp lệ hoặc có lỗi xảy ra."
                          height={200}
                          width={200}
                          className="object-contain h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-[200px] bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">Không có ảnh</span>
                      </div>
                    )}
                  </div>
                  <div className="w-2/3"></div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <span className="text-lg font-medium">Mục lục</span>
                  <div className="flex justify-between items-start w-full px-3">
                    <div className="flex flex-col w-[40%] space-y-5">
                      <span className="font-medium">Nội dung</span>
                      {form.watch("indexItem").length > 0 ? (
                        <ul className="space-y-2">
                          {form.watch("indexItem").map((item, index) => {
                            return (
                              <li
                                key={index}
                                className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
                              >
                                <FormField
                                  control={form.control}
                                  name={`indexItem.${index}.nameItem`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="flex items-center gap-2 p-2">
                                          <RiAddCircleLine
                                            className="text-xl text-gray-500 hover:text-green-500 cursor-pointer transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAddIndexItem(item);
                                            }}
                                          />
                                          <Input
                                            {...field}
                                            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                            placeholder="Nhập tên mục lục"
                                          />
                                          <RiDeleteBack2Line
                                            className="text-xl text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteIndexItem(item._id);
                                            }}
                                          />
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {addingToItemId === item._id && (
                                  <div className="flex items-center gap-2 p-3 border-t border-gray-100">
                                    <Input
                                      className="flex-1"
                                      placeholder="Nhập tên mục lục mới"
                                      value={newItemIndexContent}
                                      onChange={(e) =>
                                        setNewItemIndexContent(e.target.value)
                                      }
                                    />

                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveNewItem();
                                      }}
                                      className="bg-green-500 hover:bg-green-600"
                                    >
                                      Lưu
                                    </Button>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : addingToItemId ? (
                        <div className="flex items-center gap-2 p-3 border-t border-gray-100">
                          <Input
                            className="flex-1"
                            placeholder="Nhập tên mục lục mới"
                            value={newItemIndexContent}
                            onChange={(e) =>
                              setNewItemIndexContent(e.target.value)
                            }
                          />

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveNewItem();
                            }}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Lưu
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
                          <span className="text-gray-500">
                            Không có mục lục
                          </span>
                          <Button
                            onClick={() => {
                              handleAddIndexItem({
                                _id: `${form.getValues("indexItem").length}a`,
                                nameItem: "",
                              });
                            }}
                          >
                            Thêm mục lục
                          </Button>
                        </div>
                      )}
                      <span>
                        Số lượng: {form.getValues("indexItem").length}
                      </span>
                    </div>
                    <div className="flex flex-col w-[45%] space-y-5">
                      <span className="font-medium">Xem Trước</span>
                      <ul className="px-2">
                        <li className="py-2 hover:bg-[#eee] active:bg-[#eee] cursor-pointer rounded-sm pl-3 font-normal text-sm flex items-center gap-1 ">
                          <BsCameraVideo /> Mục lục
                        </li>
                        {form.watch("indexItem")?.map((item, index) => {
                          return (
                            <li
                              key={index}
                              className="py-2 hover:bg-[#eee] active:bg-[#eee] rounded-sm pl-3 cursor-pointer "
                            >
                              <div className="flex items-center gap-1 font-normal text-sm ">
                                <BsCameraVideo />
                                {item.nameItem}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-center items-center flex-col gap-2">
                  <span className="text-lg font-medium">Nội dung bài học</span>
                  <div className="w-full flex justify-center items-center">
                    <div className="flex flex-col gap-2  w-full ">
                      {form.watch("content").map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-start  justify-between"
                          >
                            <div className="flex flex-col gap-2 w-[44%]">
                              <EditLessonContentForm
                                header={form.watch("indexItem")[index]}
                                control={form.control}
                                index={index}
                                contentText={item.contentText}
                                dataImage={item.dataImage}
                                dataList={item.dataList}
                                dataList2={item.dataList2}
                                form={form}
                                dataMerge={item.dataMerge}
                                dataPlus={item.dataPlus}
                                codeSample={item.codeSample}
                                dataVideo={item.dataVideo}
                                dataSlides={item.dataSlides}
                                dataTab={item.dataTab}
                              />
                            </div>
                            <div className="flex flex-col gap-2 w-[54%] ">
                              <SectionLesson
                                key={index}
                                header={form.watch("indexItem")[index]}
                                dataImage={item.dataImage}
                                dataList2={item.dataList2}
                                dataList={item.dataList}
                                dataMerge={item.dataMerge}
                                dataPlus={item.dataPlus}
                                //dataSlides={item.dataSlides}
                                dataTab={item.dataTab}
                                dataVideo={item.dataVideo}
                                contentText={item.contentText}
                                codeSample={item.codeSample}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-x-2">
                  <Button
                    // onClick={handleSaveLesson}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Lưu thay đổi
                  </Button>
                  {/* <Button
                    onClick={() => {
                      setEditingLesson(null);
                    }}
                    variant="destructive"
                  >
                    Hủy
                  </Button> */}
                </div>
              </div>
            </form>
          </Form>
          <UploadFile endpoint={""} extraFields={{
            lessonId: lessonId,
          }} />
        </div>
      ) : (
        <div className=" text-lg font-medium h-[200px] flex items-center justify-center">
          <span>Không tìm thấy dữ liệu bài học.</span>
        </div>
      )}
    </div>
  );
}
