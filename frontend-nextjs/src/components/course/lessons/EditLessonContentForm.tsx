import { ContentLesson, IndexItemProps } from "@/types/CustomType";
import Image from "next/image";
import Slider from "react-slick";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import AccordionExtra from "@/components/course/section/AccordionExtra";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Suspense, useRef } from "react";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import "react-markdown-editor-lite/lib/index.css";
import "highlight.js/styles/a11y-dark.css";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditLessonFormType } from "@/types/Type";
import MarkdownCodeEditor from "@/components/course/lessons/MarkdownCodeEditor";

type SectionLessonProps = ContentLesson & {
  header?: IndexItemProps;
  control: Control<EditLessonFormType>;
  index: number;
};


export default function EditLessonContentForm({
  dataImage,
  dataList2,
  dataList,
  dataMerge,
  header,
  dataPlus,
  dataSlides,
  dataTab,
  dataVideo,
  contentText,
  codeSample,
  control,
  index,
}: SectionLessonProps) {
  const sliderRef = useRef<Slider | null>(null);

  const next = () => {
    sliderRef.current?.slickNext();
  };
  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <div className="flex flex-col justify-center items-center w-full ">
      {/* header */}
      {header ? (
        <div className="mb-5 flex flex-col lg:gap-5 gap-4 w-full my-4 ">
          <span className="font-semibold text-base">
            Phần {index + 1}: {header?.nameItem}
          </span>
          {/* <div className="flex flex-col gap-2">
            <FormField
              control={control}
              name={`indexItem.${index}.nameItem`}
              render={({ field }) => <Input {...field} />}
            />
          </div> */}
        </div>
      ) : null}

      {/* contentText & dataImage & dataPlus*/}
      {contentText || dataImage || dataPlus ? (
        <div
          className={
            contentText || dataPlus
              ? "flex items-center justify-around flex-col lg:flex-row w-full gap-4 mb-4"
              : "flex items-center justify-center w-full mb-8"
          }
        >
          {(contentText || dataPlus) && (
            <div
              className={
                dataImage
                  ? `flex flex-col lg:w-[45%] w-full`
                  : ` w-full flex flex-col lg:w-[55%]`
              }
            >
              {contentText ? (
                <ul className=" ">
                  {contentText.length !== 0
                    ? contentText.map((item, index) => {
                        return (
                          <li
                            key={index}
                            className="inline-flex items-center gap-2 lg:py-4 py-2"
                          >
                            <div className="lg:w-10 lg:h-10 w-8 h-8 rounded-full bg-blue-600 flex justify-center items-center text-white">
                              {index + 1}
                            </div>
                            <p className="text-justify w-[88%]">{item}</p>
                          </li>
                        );
                      })
                    : null}
                </ul>
              ) : null}

              {dataPlus && (
                <div className="flex flex-col gap-1">
                  <FormField
                    control={control}
                    name={`content.${index}.dataPlus.header`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-base">
                          Nhập tiêu đề
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {dataPlus?.data?.map((_, indexDataPlus) => {
                    return (
                      <div key={indexDataPlus}>
                        <FormField
                          control={control}
                          name={`content.${index}.dataPlus.data.${indexDataPlus}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-base">
                                Nhập tiêu đề
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nhập tiêu đề" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`content.${index}.dataPlus.data.${indexDataPlus}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-semibold text-base">
                                Nhập nội dung
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nhập nội dung" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {dataImage && (
            <div
              className={
                contentText || dataPlus
                  ? "lg:w-[55%] flex flex-col items-center justify-center w-full"
                  : " w-full flex flex-col items-center justify-center"
              }
            >
              {dataImage.url && (
                <FormField
                  control={control}
                  name={`content.${index}.dataImage.url`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-semibold text-base">
                        Nhập Link hình ảnh
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập Link hình ảnh" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {dataImage.title && (
                <FormField
                  control={control}
                  name={`content.${index}.dataImage.title`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-semibold text-base">
                        Nhập tên hình ảnh
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tên hình ảnh" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* dataList & dataList2 */}
      {dataList || dataList2 ? (
        <div className="flex flex-col items-center justify-center mb-4 w-full">
          {dataList && (
            <div className="mb-4 flex flex-col gap-4  w-full ">
              <FormField
                control={control}
                name={`content.${index}.dataList.header`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base">
                      Nhập tiêu đề
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tiêu đề" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {dataList || dataList2 ? (
            <div className=" flex justify-around w-full flex-col lg:flex-row gap-0 lg:gap-5">
              {dataList && (
                <ul>
                  {dataList.data?.map((_, indexDataList) => {
                    return (
                      <li key={indexDataList}>
                        <FormField
                          control={control}
                          name={`content.${index}.dataList.data.${indexDataList}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Nhập nội dung" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
              {dataList2 && (
                <ul>
                  {dataList2?.data?.map((_, indexDataList2) => {
                    return (
                      <li key={indexDataList2}>
                        <FormField
                          control={control}
                          name={`content.${index}.dataList2.data.${indexDataList2}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Nhập nội dung" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* dataMerge */}
      {dataMerge ? (
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="mb-8 flex flex-col gap-4  w-full ">
            <FormField
              control={control}
              name={`content.${index}.dataMerge.header`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tiêu đề" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className=" flex justify-around w-full flex-col sm:flex-row">
            <div className="sm:w-[45%]  w-full">
              {dataMerge.data?.map((item, indexDataMerge) => {
                return (
                  <div key={indexDataMerge}>
                    <FormField
                      control={control}
                      name={`content.${index}.dataMerge.data.${indexDataMerge}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-base">
                            Nhập tiêu đề
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nhập tiêu đề" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      {item?.description?.map((x, indexs) => {
                        return (
                          <div key={indexs}>
                            <FormField
                              control={control}
                              name={`content.${index}.dataMerge.data.${indexDataMerge}.description.${indexs}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Nhập nội dung"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <div>
                              <FormField
                                control={control}
                                name={`content.${index}.dataMerge.data.${indexDataMerge}.description.${indexs}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Nhập nội dung"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              {x?.description?.map((_, indexX) => {
                                return (
                                  <FormField
                                    control={control}
                                    key={indexX}
                                    name={`content.${index}.dataMerge.data.${indexDataMerge}.description.${indexs}.description.${indexX}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="Nhập nội dung"
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="sm:w-[45%] w-full">
              {dataMerge.image && (
                <FormField
                  control={control}
                  name={`content.${index}.dataMerge.image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-base">
                        Nhập Link hình ảnh
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập Link hình ảnh" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* dataTab */}
      {dataTab ? (
        <div className="flex justify-center flex-col items-center w-full ">
          {dataTab.header && (
            <span className="sm:flex hidden justify-center items-center w-full text-xl font-semibold sm:mb-8 mb-4">
              {dataTab.header}
            </span>
          )}

          {dataTab && dataTab?.data?.length <= 2 ? (
            <Tabs
              defaultValue="0"
              className="w-full flex flex-col items-center justify-center"
            >
              <TabsList className="w-fit bg-[#eee] h-fit flex justify-center rounded">
                {dataTab?.data?.map((item, index) => {
                  return (
                    <TabsTrigger
                      value={`${index}`}
                      key={index}
                      className=" whitespace-nowrap h-full rounded data-[state=active]:bg-blue-700 data-[state=active]:text-white p-4"
                    >
                      {item.title}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {dataTab?.data?.map((item, index) => {
                return (
                  <TabsContent
                    value={`${index}`}
                    className="w-full "
                    key={index}
                  >
                    <Suspense>
                      <div className="flex justify-around items-center py-8 gap-4 w-full flex-col sm:flex-row">
                        <p className="text-justify sm:w-[30%] block  w-full">
                          {item.description}
                        </p>

                        {item.image ? (
                          <div className="sm:w-[45%] items-center flex justify-center  w-full">
                            <Image
                              src={item.image}
                              alt="data-image-123"
                              width={900}
                              height={500}
                              className="sm:h-80 object-center object-contain w-[60%] h-52 "
                            />
                          </div>
                        ) : null}
                      </div>
                    </Suspense>
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : null}

          {dataTab && dataTab?.data?.length > 2 ? (
            <div className="w-full">
              {dataTab.data.map((item, index) => {
                return (
                  <div key={index} className="flex flex-col">
                    <AccordionExtra
                      content={item.title}
                      description={item.description}
                    />
                    {item.image ? (
                      <div className="sm:w-[45%] items-center flex justify-center w-full">
                        <Image
                          src={item.image}
                          alt="data-image-123"
                          width={900}
                          height={500}
                          className="sm:h-80 object-center object-contain w-[60%] h-52 "
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* dataSlides */}
      {dataSlides ? (
        <div className="flex flex-col w-full items-center ">
          {dataSlides.title && (
            <span className="text-xl font-semibold"> {dataSlides.title} </span>
          )}

          <div className="w-full flex justify-center items-center gap-4 flex-col lg:flex-row">
            <Button
              aria-label="previous-button"
              className="px-5 py-5 rounded-full bg-black w-fit h-fit hidden lg:flex"
              onClick={previous}
            >
              <FaAngleLeft className="text-2xl text-white" />
            </Button>

            {/* <div className="w-full lg:w-[80%] ">
              <Slider {...newSettings} ref={sliderRef}>
                {dataSlides?.data?.map((item, index) => {
                  return (
                    <div className="my-4 w-full " key={index}>
                      <div className="w-full text-center flex flex-col items-center sm:gap-8 gap-2">
                        <span className=" bg-blue-600 text-white px-3 py-2 rounded text-lg font-semibold">
                          Step {index + 1}
                        </span>
                        <div className="w-full flex items-center gap-8 rounded-3xl justify-center">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt="image-description-course"
                              className="rounded-lg w-[85%] xl:h-[400px] h-[200px] object-cover object-center "
                              width={900}
                              height={900}
                            />
                          )}
                        </div>
                        <p
                          className="text-justify sm:px-10 px-0"
                          dangerouslySetInnerHTML={{
                            __html: item.description as string,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div> */}

            <div className="lg:hidden flex justify-around items-center w-full">
              <button
                aria-label="previous-button"
                className=" px-4 py-4 rounded-full bg-black w-fit h-fit  xs:p-2"
                onClick={previous}
              >
                <FaAngleLeft className="text-2xl text-white" />
              </button>
              <button
                className=" px-4 py-4 rounded-full bg-black w-fit h-fit xs:p-2 "
                onClick={next}
                aria-label="next-button"
              >
                <FaAngleRight className="text-2xl text-white" />
              </button>
            </div>
            <Button
              className=" hidden lg:flex px-5 py-5 rounded-full bg-black w-fit h-fit  "
              onClick={next}
              aria-label="next-button"
            >
              <FaAngleRight className="text-2xl text-white" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* codeSample */}
      {codeSample && (
        <div className="w-full flex flex-col gap-4 sm:px-10 px-0 mb-4">
          <FormField
            control={control}
            name={`content.${index}.codeSample`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Code Editor
                </FormLabel>
                <FormControl>
                  <MarkdownCodeEditor
                    value={field.value ||""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* dataVideo */}
      {dataVideo && (
        <div className="w-full flex justify-center items-center  sm:my-10 my-4 flex-col lg:px-10">
          <iframe
            width="560"
            className="rounded w-full h-fit xl:w-1/2  aspect-video"
            height="315"
            src={dataVideo.url}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          {dataVideo.title ? (
            <span className=" sm:text-xl w-full font-semibold text-base text-center my-4">
              {dataVideo.title}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
