"use client";

import Link from "next/link";
import Image from "next/image";
import { MdMenuOpen } from "react-icons/md";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { useSearchParams } from "next/navigation";

import { use, useRef } from "react";
import moment from "moment-timezone";
import type {
  ContentLesson,
  CourseIsActive,
  ContentLessonMerge,
  ArrLessons,
  IndexItemProps,
  Lesson,
} from "@/types/CustomType";
import { useState } from "react";
import { BsCameraVideo } from "react-icons/bs";
import MainLayout from "@/components/main-layout";
import TooltipAvatar from "@/components/custom/TooltipAvatar";
import SectionLesson from "@/components/course/section/SectionLesson";
import ForbiddenResourceError from "@/components/custom/ForbiddenResourceError";
import Loading from "@/app/loading";
import NotFound from "@/app/not-found";
import CommingSoon from "@/components/custom/CommingSoon";
import { Button } from "@/components/ui/button";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { Headers, UpdateMode } from "@/constant/constant";
import { useUserContext } from "@/store/context/AuthContext";
import { ArrowRightIcon } from "lucide-react";
import UploadFile from "@/components/custom/UploadFile";

export default function CourseContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const param = use(params);
  const slug = param.slug;
  const { user } = useUserContext();
  const [isOpenMenu, setOpenMenu] = useState(true);

  // const [isContinue, setContinue] = useState(false);
  const {
    isLoading: isLoadingLesson,
    error: errorLesson,
    data: dataLesson,
  } = useSWRPrivate<Lesson>(
    `lesson?lessonId=${id}`,
    {},
    {
      revalidateIfStale: true,
    },
  );

  const {
    isLoading: isLoadingCourse,
    error: errorCourse,
    data: dataCourse,
  } = useSWRPrivate<CourseIsActive>(`course/${slug}?isActive=${true}`);

  const indexItem: IndexItemProps[] = dataLesson?.indexItem || [];
  const [idMappingContent, setMappingContent] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const prevActiveSectionRef = useRef("");
  const nameLesson = dataLesson?.name;
  const contentCourse: ContentLesson[] = dataLesson?.content || [];
  const arrayLessons: ArrLessons[] = dataCourse?.lessons || [];

  const MapArrayLesson: (ArrLessons & { index: number })[] = arrayLessons?.map(
    (item, index) => ({
      ...item,
      index: index + 1,
    }),
  );

  const contentCourseArray: ContentLessonMerge[] = contentCourse.map(
    (item, index) => ({
      ...item,
      _id: indexItem[index]._id,
    }),
  );
  if (isLoadingLesson || isLoadingCourse) return <Loading />;
  if (dataLesson && "status" in dataLesson && dataLesson.status === 403) {
    return <ForbiddenResourceError />;
  }
  if (
    (dataLesson && !dataLesson.content) ||
    (dataLesson && dataLesson?.content?.length === 0)
  )
    return <CommingSoon />;
  if (errorLesson || errorCourse) return <NotFound />;

  const handleSubmitTime = async (
    sectionId: string,
    index: number,
    isNext?: boolean,
  ) => {
    if (isNext) {
      setMappingContent(sectionId);
      await fetchPrivateData("timeview", {
        method: "POST",
        headers: Headers,
        body: JSON.stringify({
          lessonId: id,
          sectionId: indexItem[index]._id,
          endTimeView: Date.now().toString(),
        }),
      });
      await fetchPrivateData("timeview", {
        method: "POST",
        headers: Headers,
        body: JSON.stringify({
          lessonId: id,
          sectionId: indexItem[index + 1]._id,
          startTimeView: Date.now().toString(),
        }),
      });
      return;
    }
    setMappingContent(sectionId);

    if (index === 0) {
      console.log(sectionId, index);

      await fetchPrivateData("timeview", {
        body: JSON.stringify({
          lessonId: id,
          sectionId,
          startTimeView: Date.now().toString(),
        }),
        method: "POST",
        headers: Headers,
      });
      return;
    }

    await fetchPrivateData("timeview", {
      body: JSON.stringify({
        lessonId: id,
        sectionId: indexItem[index - 1]._id,
        endTimeView: Date.now().toString(),
      }),
      method: "POST",
      headers: Headers,
    });

    await fetchPrivateData("timeview", {
      body: JSON.stringify({
        lessonId: id,
        sectionId,
        startTimeView: Date.now().toString(),
      }),
      method: "POST",
      headers: Headers,
    });
  };

  const handleSubmitIndex = async (sectionId: string) => {
    setMappingContent(sectionId);
    prevActiveSectionRef.current = activeSection;
    setActiveSection(sectionId);
    if (!prevActiveSectionRef.current) {
      await fetchPrivateData("timeview", {
        body: JSON.stringify({
          lessonId: id,
          sectionId,
          startTimeView: Date.now().toString(),
        }),
        method: "POST",
        headers: Headers,
      });
      return;
    }

    await fetchPrivateData("timeview", {
      body: JSON.stringify({
        lessonId: id,
        sectionId,
        startTimeView: Date.now().toString(),
      }),
      method: "POST",
      headers: Headers,
    });
    console.log(prevActiveSectionRef.current);

    await fetchPrivateData("timeview", {
      body: JSON.stringify({
        lessonId: id,
        sectionId: prevActiveSectionRef.current,
        endTimeView: Date.now().toString(),
      }),
      method: "POST",
      headers: Headers,
    });
  };

  return (
    <MainLayout authPage={true}>
      <div
        className={`relative flex h-screen w-full items-start ${
          isOpenMenu ? "justify-end" : ""
        }`}
      >
        <div
          className={`z-20 h-screen w-[75%] overflow-y-auto bg-white transition-all duration-200 ease-out sm:w-[70%] ${
            isOpenMenu
              ? "fixed inset-0 translate-x-0 xl:w-[21%] xl:opacity-100"
              : "pointer-events-none -translate-x-full xl:opacity-0"
          }`}
        >
          <nav className="flex flex-col">
            <div className="mb-5 flex flex-col gap-5">
              <Image
                src={
                  "https://raw.githubusercontent.com/dinhhuyhoang25032002/openlab-image-public/refs/heads/master/sales.jpg"
                }
                alt="Image-5G"
                width={600}
                height={600}
                className="h-[190px] w-full border-2 object-contain object-center px-3"
                priority
              />

              {MapArrayLesson?.filter((item) => item.name === nameLesson)?.map(
                (item) => (
                  <span
                    key={item._id}
                    className="xs:text-center pl-3 text-sm font-semibold text-blue-700 uppercase"
                  >
                    Bài {item.index} {item.name}
                  </span>
                ),
              )}
            </div>

            <ul>
              <li className="flex cursor-pointer items-center gap-1 rounded-sm py-2 pl-3 text-sm font-normal hover:bg-[#eee] active:bg-[#eee]">
                <BsCameraVideo /> Mục lục
              </li>
              {indexItem?.map((item) => {
                return (
                  <li
                    key={item._id}
                    className="rounded-sm py-2 pl-3 hover:bg-[#eee] active:bg-[#eee]"
                  >
                    <Link
                      href={`#${item._id}`}
                      onClick={() => handleSubmitIndex(item._id)}
                      className="flex items-center gap-1 text-sm font-normal"
                    >
                      <BsCameraVideo />
                      {item.nameItem}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="mb-4">
              {MapArrayLesson?.filter((item) => item._id !== id).map(
                (item, index) => {
                  return (
                    <li
                      key={index}
                      className="w-full rounded-sm p-2 text-justify hover:bg-[#eee] active:bg-[#eee]"
                    >
                      <Link
                        href={`/khoa-hoc/khoa-hoc-thuc-hanh-esp8266?id=${item._id}`}
                      >
                        <span className="block text-sm font-semibold uppercase">
                          Bài {item.index} {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          </nav>
        </div>
        <div
          onClick={() => setOpenMenu(false)}
          className={`fixed inset-0 z-10 h-screen w-full bg-gray-400 opacity-70 xl:hidden ${
            isOpenMenu ? "block" : "hidden"
          }`}
        ></div>

        <div
          className={`flex h-full flex-col items-center justify-start transition-all duration-200 ease-out ${
            isOpenMenu
              ? "w-full xl:w-[79%]"
              : "absolute top-0 right-0 z-10 w-full"
          }`}
        >
          <div className="xs:p-3 flex w-full flex-row-reverse items-center justify-between bg-[#eee] px-5 py-3 xl:flex-row">
            <Button
              onClick={() => setOpenMenu(!isOpenMenu)}
              aria-label="Open Menu"
              className="rounded px-3 py-2 hover:bg-gray-500 hover:text-white active:bg-gray-500 active:text-white"
            >
              <MdMenuOpen className="text-2xl" />
            </Button>
            <Link
              href={"/"}
              className="px-4 font-semibold uppercase hover:text-blue-400 active:text-blue-400"
            >
              Home
            </Link>
            <div>
              <TooltipAvatar />
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col items-center justify-start px-5 sm:px-8">
            {contentCourse && contentCourse.length !== 0 && (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="xs:space-y-5 w-full pt-8">
                  {MapArrayLesson?.filter(
                    (item) => item.name === nameLesson,
                  )?.map((item) => (
                    <span
                      key={item._id}
                      className="block w-full text-center text-lg font-semibold uppercase"
                    >
                      Bài {item.index}: {item.name}
                    </span>
                  ))}

                  <ul>
                    {indexItem?.map((item) => {
                      return (
                        <li key={item._id} className=" ">
                          <Link
                            href={`#${item._id}`}
                            onClick={() => handleSubmitIndex(item._id)}
                            className="flex items-center gap-1 rounded-sm p-3 text-base font-semibold hover:bg-[#eee] active:bg-[#eee]"
                          >
                            <BsCameraVideo /> {item.nameItem}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {contentCourseArray?.map((item, index) => {
                  return (
                    idMappingContent &&
                    item._id === idMappingContent && (
                      <div
                        key={item._id}
                        id={`${item._id}`}
                        className="flex w-full flex-col items-center justify-center"
                      >
                        <SectionLesson
                          header={indexItem[index]}
                          dataImage={item.dataImage}
                          contentText={item.contentText}
                          dataVideo={item.dataVideo}
                          dataTab={item.dataTab}
                          dataSlides={item.dataSlides}
                          dataList2={item.dataList2}
                          dataMerge={item.dataMerge}
                          dataList={item.dataList}
                          codeSample={item.codeSample}
                          dataPlus={item.dataPlus}
                        />
                        {idMappingContent !==
                          indexItem[indexItem?.length - 1]._id && (
                          <Button
                            effect={"expandIcon"}
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            className="my-5 w-1/2"
                            onClick={() =>
                              handleSubmitTime(
                                indexItem[index + 1]._id,
                                index,
                                true,
                              )
                            }
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    )
                  );
                })}

                {!idMappingContent && (
                  <div className="my-auto">
                    <Button
                      onClick={() => handleSubmitTime(indexItem[0]._id, 0)}
                      className="active:opacity-60"
                    >
                      Getting startted!
                    </Button>
                  </div>
                )}
              </div>
            )}
            {idMappingContent === indexItem[indexItem?.length - 1]?._id && (
              <div className="flex w-full flex-col space-y-5 pb-5">
                <hr className="w-full border-2 border-red-600" />
                <span className="text-2xl font-semibold">Báo cáo kết quả</span>
                <div className="flex w-full items-center justify-center">
                  <div className="w-full space-y-5 rounded-md bg-[#eeeeee] p-5 xl:w-2/3 xl:px-10">
                    <div className="flex flex-col">
                      <span>Tên bài học: {nameLesson}</span>
                      <span>Tên sinh viên: {user.fullname}</span>
                      <span>
                        Ngày nộp bài:{" "}
                        {moment
                          .tz("Asia/Ho_Chi_Minh")
                          .locale("vi")
                          .format("[Ngày] D [tháng] M [năm] YYYY")}
                      </span>
                    </div>
                    <UploadFile
                      endpoint={"uploads/result"}
                      extraFields={{
                        _id: id,
                        mode: UpdateMode.RESULT,
                        name: nameLesson,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
