"use client";

import Link from "next/link";
import Image from "next/image";
import { MdMenuOpen } from "react-icons/md";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { useSearchParams } from "next/navigation";
import FormSendResult from "@/components/course/section/FormSendResult";
import { use } from "react";
import {
  type ContentLesson,
  type CourseIsActive,
  type ArrLessons,
  type IndexItemProps,
  Lesson,
  type ForbiddenException,
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

export default function CourseContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const param = use(params);
  const slug = param.slug;

  const [isOpenMenu, setOpenMenu] = useState(true);
  const [isContinue, setContinue] = useState(false);
  const {
    isLoading: isLoadingLesson,
    error: errorLesson,
    data: dataLesson,
  } = useSWRPrivate<Lesson & ForbiddenException>(
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
  console.log(dataLesson);

  if (isLoadingLesson || isLoadingCourse) return <Loading />;
  if (dataLesson?.status === 403 && dataLesson?.name === "ForbiddenException") {
    return <ForbiddenResourceError />;
  }
  if (errorLesson || errorCourse) return <NotFound />;

  const indexItem: IndexItemProps[] = dataLesson?.indexItem || [];
  const nameLesson = dataLesson?.name;
  const contentCourse: ContentLesson[] = dataLesson?.content || [];
  const arrayLessons: ArrLessons[] = dataCourse?.lessons || [];
  if (contentCourse.length === 0) return <CommingSoon />;
  const MapArrayLesson: (ArrLessons & { index: number })[] = arrayLessons?.map(
    (item, index) => ({
      ...item,
      index: index + 1,
    })
  );

  return (
    <MainLayout authPage={true}>
      <div className={`flex w-full relative sm:bg-red-500 ${isOpenMenu ? "justify-end " : ""}`}>
        <div
          className={`w-[75%]  h-screen z-20 bg-white overflow-y-auto transition-all ease-out duration-200 ${
            isOpenMenu
              ? "translate-x-0 fixed inset-0 "
              : "-translate-x-full pointer-events-none "
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
              <li className="py-2 hover:bg-[#eee] cursor-pointer rounded-sm pl-3 font-normal text-sm flex items-center gap-1 ">
                <BsCameraVideo /> Mục lục
              </li>
              {indexItem?.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="py-2 hover:bg-[#eee] rounded-sm pl-3 "
                  >
                    <Link
                      href={`#${index}`}
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
                      className="text-justify p-2 w-full rounded-sm hover:bg-[#eee] "
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
          className={` flex flex-col  justify-center transition-all ease-out duration-200 items-center  ${
            isOpenMenu ? "xl:w-[79%] w-full " : "w-full z-10 absolute right-0 top-0"
          }`}
        >
          <div className=" flex w-full xs:p-3 px-5 py-3 bg-[#eee] justify-between items-center flex-row-reverse ">
            <Button
              onClick={() => setOpenMenu(!isOpenMenu)}
              aria-label="Open Menu"
              className="px-3 py-2 hover:bg-gray-500 rounded hover:text-white"
            >
              <MdMenuOpen className="text-2xl " />
            </Button>
            <Link
              href={"/"}
              className="uppercase px-4 font-semibold hover:text-blue-400"
            >
              Home
            </Link>
            <div>
              <TooltipAvatar />
            </div>
          </div>

          <div
            className={
              isOpenMenu
                ? "w-full px-0 flex flex-col items-center justify-center"
                : "w-full px-0 flex flex-col items-center justify-center xs:px-5"
            }
          >
            {contentCourse && contentCourse.length !== 0 ? (
              <div className="w-full flex flex-col items-center justify-center">
                {isContinue === false && (
                  <div className="px-5  pt-8 w-full xs:space-y-5">
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
                      {indexItem?.map((item, index) => {
                        return (
                          <li
                            key={index}
                            className="py-3 hover:bg-[#eee] rounded-sm pl-0 xs:py-2 xs:px-0"
                          >
                            <Link
                              href={`#${index}`}
                              className="flex items-center gap-1 text-base font-semibold "
                            >
                              <BsCameraVideo /> {item.nameItem}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {contentCourse?.map((item, index) => {
                  if (index < 3) {
                    return isContinue === false ? (
                      <div className="w-full" key={index} id={`${index}`}>
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
                      </div>
                    ) : null;
                  }
                  if (index === 3) {
                    return isContinue === false ? (
                      <div className="w-full" key={index} id={`${index}`}>
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
                        <div className="py-5 w-full flex justify-center items-center ">
                          <Link
                            href={`#${index + 1}`}
                            className="bg-blue-700 xs:w-2/3  w-1/3 px-14 py-4 rounded text-white text-lg flex justify-center items-center"
                            onClick={() => setContinue(true)}
                          >
                            Continue
                          </Link>
                        </div>
                      </div>
                    ) : null;
                  }
                  if (index === 4) {
                    return isContinue === true ? (
                      <div className="w-full" key={index} id={`${index}`}>
                        <div className=" w-full flex justify-center items-center">
                          <Button
                            className="bg-blue-700 xs:w-2/3  w-1/3 px-14 rounded py-4 text-white text-lg flex justify-center items-center sm:mb-10 mb-4"
                            onClick={() => setContinue(false)}
                          >
                            Back
                          </Button>
                        </div>
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
                      </div>
                    ) : null;
                  } else {
                    return isContinue === true ? (
                      <div className="w-full" key={index} id={`${index}`}>
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
                      </div>
                    ) : null;
                  }
                })}
              </div>
            ) : null}
            {isContinue === true ? (
              <div className="w-full px-5 flex flex-col space-y-5 pb-5">
                <hr className="w-full  border-2 border-red-600" />
                <span className="text-2xl font-semibold">Báo cáo kết quả</span>
                <div className="flex justify-center items-center w-full ">
                  <div className="w-full ">
                    <FormSendResult />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
