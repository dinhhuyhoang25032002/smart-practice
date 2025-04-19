"use client";

import Link from "next/link";
import Image from "next/image";
import { MdMenuOpen } from "react-icons/md";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { useSearchParams } from "next/navigation";
import FormSendResult from "@/components/course/section/FormSendResult";
import { use, useRef } from "react";
import moment from "moment-timezone";
import type {
  ContentLesson,
  CourseIsActive,
  ContentLessonMerge,
  ArrLessons,
  IndexItemProps,
  Lesson,
  ResponseException,
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
import { Headers } from "@/constant/constant";
import { useUserContext } from "@/store/context/AuthContext";
import { ArrowRightIcon } from "lucide-react";

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
  } = useSWRPrivate<Lesson & ResponseException>(
    `lesson?lessonId=${id}`,
    {},
    {
      dedupingInterval: 1000,
      revalidateIfStale: true,
    }
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

  if (contentCourse.length === 0 && !isLoadingLesson) return <CommingSoon />;
  const MapArrayLesson: (ArrLessons & { index: number })[] = arrayLessons?.map(
    (item, index) => ({
      ...item,
      index: index + 1,
    })
  );

  const contentCourseArray: ContentLessonMerge[] = contentCourse.map(
    (item, index) => ({
      ...item,
      _id: indexItem[index]._id,
    })
  );
  if (isLoadingLesson || isLoadingCourse) return <Loading />;
  if (dataLesson?.status === 403 && dataLesson?.name === "ForbiddenException") {
    return <ForbiddenResourceError />;
  }
  if (errorLesson || errorCourse) return <NotFound />;

  const handleSubmitTime = async (
    sectionId: string,
    index: number,
    isNext?: boolean
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
        className={`flex w-full relative h-screen items-start ${
          isOpenMenu ? "justify-end " : ""
        }`}
      >
        <div
          className={`w-[75%] sm:w-[70%] h-screen z-20 bg-white overflow-y-auto transition-all ease-out duration-200 ${
            isOpenMenu
              ? "translate-x-0 fixed inset-0 xl:w-[21%] xl:opacity-100"
              : "-translate-x-full pointer-events-none xl:opacity-0 "
          }`}
        >
          <nav className="flex flex-col">
            <div className="mb-5 flex flex-col gap-5 ">
              <Image
                src={
                  "https://raw.githubusercontent.com/dinhhuyhoang25032002/openlab-image-public/refs/heads/master/sales.jpg"
                }
                alt="Image-5G"
                width={600}
                height={600}
                className="border-2 w-full h-[190px] object-contain object-center px-3"
                priority
              />

              {MapArrayLesson?.filter((item) => item.name === nameLesson)?.map(
                (item) => (
                  <span
                    key={item._id}
                    className="uppercase font-semibold text-sm text-blue-700 xs:text-center pl-3  "
                  >
                    Bài {item.index} {item.name}
                  </span>
                )
              )}
            </div>

            <ul>
              <li className="py-2 hover:bg-[#eee] active:bg-[#eee] cursor-pointer rounded-sm pl-3 font-normal text-sm flex items-center gap-1 ">
                <BsCameraVideo /> Mục lục
              </li>
              {indexItem?.map((item) => {
                return (
                  <li
                    key={item._id}
                    className="py-2 hover:bg-[#eee] active:bg-[#eee] rounded-sm pl-3 "
                  >
                    <Link
                      href={`#${item._id}`}
                      onClick={() => handleSubmitIndex(item._id)}
                      className="flex items-center gap-1 font-normal text-sm "
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
                      className="text-justify p-2 w-full rounded-sm hover:bg-[#eee] active:bg-[#eee]"
                    >
                      <Link
                        href={`/khoa-hoc/khoa-hoc-thuc-hanh-esp8266?id=${item._id}`}
                      >
                        <span className="uppercase font-semibold text-sm  block   ">
                          Bài {item.index} {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                }
              )}
            </ul>
          </nav>
        </div>
        <div
          onClick={() => setOpenMenu(false)}
          className={`xl:hidden w-full bg-gray-400 h-screen fixed inset-0 z-10 opacity-70 ${
            isOpenMenu ? "block" : "hidden"
          }`}
        ></div>

        <div
          className={`flex flex-col justify-start transition-all ease-out duration-200 items-center h-full  ${
            isOpenMenu
              ? "xl:w-[79%] w-full "
              : "w-full z-10 absolute right-0 top-0"
          }`}
        >
          <div className=" flex w-full xs:p-3 px-5 py-3 bg-[#eee] justify-between items-center flex-row-reverse xl:flex-row">
            <Button
              onClick={() => setOpenMenu(!isOpenMenu)}
              aria-label="Open Menu"
              className="px-3 py-2 hover:bg-gray-500 active:bg-gray-500 rounded hover:text-white active:text-white"
            >
              <MdMenuOpen className="text-2xl " />
            </Button>
            <Link
              href={"/"}
              className="uppercase px-4 font-semibold hover:text-blue-400 active:text-blue-400"
            >
              Home
            </Link>
            <div>
              <TooltipAvatar />
            </div>
          </div>

          <div className="w-full px-5 flex flex-col items-center justify-start sm:px-8 flex-1">
            {contentCourse && contentCourse.length !== 0 && (
              <div className="w-full flex flex-col items-center justify-center h-full ">
                <div className="pt-8 w-full xs:space-y-5">
                  {MapArrayLesson?.filter(
                    (item) => item.name === nameLesson
                  )?.map((item) => (
                    <span
                      key={item._id}
                      className="font-semibold block uppercase text-lg w-full text-center "
                    >
                      Bài {item.index}: {item.name}
                    </span>
                  ))}

                  <ul>
                    {indexItem?.map((item) => {
                      return (
                        <li key={item._id} className="  ">
                          <Link
                            href={`#${item._id}`}
                            onClick={() => handleSubmitIndex(item._id)}
                            className="flex items-center gap-1 text-base font-semibold p-3 hover:bg-[#eee] active:bg-[#eee] rounded-sm "
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
                        className="w-full flex flex-col justify-center items-center"
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
                          indexItem[indexItem.length - 1]._id && (
                          <Button
                            effect={"expandIcon"}
                            icon={ArrowRightIcon}
                            iconPlacement="right"
                            className="w-1/2 my-5"
                            onClick={() =>
                              handleSubmitTime(
                                indexItem[index + 1]._id,
                                index,
                                true
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
                      className="active:opacity-60 "
                    >
                      Getting startted!
                    </Button>
                  </div>
                )}
              </div>
            )}
            {idMappingContent === indexItem[indexItem.length - 1]?._id && (
              <div className="w-full flex flex-col space-y-5 pb-5">
                <hr className="w-full border-2 border-red-600" />
                <span className="text-2xl font-semibold">Báo cáo kết quả</span>
                <div className="flex justify-center items-center w-full ">
                  <div className="w-full bg-[#eeeeee] p-5 xl:px-10 rounded-md xl:w-2/3 space-y-5 ">
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
                    <FormSendResult />
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
