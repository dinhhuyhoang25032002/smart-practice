import { ContentLesson, IndexItemProps } from "@/types/CustomType";
import Image from "next/image";
import Slider from "react-slick";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import AccordionExtra from "@/components/course/section/AccordionExtra";
import { IoMdCheckmark } from "react-icons/io";
import { settings } from "@/configs/settingSlider";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";

import CodeEditor from "../lessons/CodeEditor";
type SectionLessonProps = ContentLesson & {
  header?: IndexItemProps;
};

const newSettings = {
  ...settings,
  autoplay: false,
  //autoplaySpeed: 3000,
  pauseOnHover: true,
  pauseOnFocus: true,
  dots: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 10000,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export default function SectionLesson({
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
}: SectionLessonProps) {
  const sliderRef = useRef<Slider | null>(null);
  const next = () => {
    sliderRef.current?.slickNext();
  };
  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      {/* header */}
      {header ? (
        <div className="mb-5 flex flex-col lg:gap-5 gap-4 w-full my-4 ">
          <hr className="w-full  border-2 border-red-600" />
          <span className="xl:text-2xl font-semibold text-xl ">
            {header?.nameItem}
          </span>
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
                  <span>{dataPlus.header}</span>
                  {dataPlus?.data?.map((item, index) => {
                    return (
                      <div key={index}>
                        <AccordionExtra
                          content={item.title}
                          description={item.description}
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
                <Image
                  src={dataImage.url as string}
                  alt="dataImage"
                  width={500}
                  height={300}
                  className={
                    "lg:h-80 h-72 object-center object-contain lg:w-[80%] w-full"
                  }
                />
              )}
              <span className="flex justify-center items-center w-full">
                {dataImage.title}
              </span>
            </div>
          )}
        </div>
      ) : null}

      {/* dataList & dataList2 */}
      {dataList || dataList2 ? (
        <div className="flex flex-col items-center justify-center mb-4 w-full">
          {dataList && (
            <div className="mb-4 flex flex-col gap-4  w-full ">
              {/* <hr className="w-full  border-2 border-red-600 mb-2" /> */}
              <span className="lg:text-2xl font-semibold text-xl">
                {dataList.header}
              </span>
            </div>
          )}
          {dataList || dataList2 ? (
            <div className=" flex justify-around w-full flex-col lg:flex-row gap-0 lg:gap-5">
              {dataList && (
                <ul>
                  {dataList.data?.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="flex items-center gap-2 py-4  text-justify"
                      >
                        <div className="xl:w-10 xl:h-10 w-8 h-8 rounded-full bg-blue-600 flex justify-center items-center text-white">
                          <IoMdCheckmark />
                        </div>
                        <span className="text-justify w-[87%]">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              {dataList2 && (
                <ul>
                  {dataList2?.data?.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="flex items-center  gap-2  py-4"
                      >
                        <div className="xl:w-10 xl:h-10 w-8 h-8  rounded-full bg-blue-600 flex justify-center items-center text-white">
                          <IoMdCheckmark />
                        </div>
                        <span className="text-justify w-[87%]">{item}</span>
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
            {/* <hr className="w-full  border-2 border-red-600 mb-2" /> */}
            <span className="lg:text-2xl font-semibold text-xl ">
              {dataMerge?.header}
            </span>
          </div>
          <div className=" flex justify-around w-full flex-col sm:flex-row">
            <div className="sm:w-[45%]  w-full">
              {dataMerge.data?.map((item, index) => {
                return (
                  <div key={index}>
                    <span className="block text-justify">{item.label}</span>
                    <div>
                      {item?.description?.map((item, index) => {
                        return (
                          <div key={index}>
                            <AccordionExtra
                              content={item.title}
                              description={item.description}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="sm:w-[45%]  w-full">
              {dataMerge.image && (
                <Image
                  src={dataMerge.image}
                  alt="data-merge"
                  width={500}
                  height={500}
                  className="w-full sm:h-52 h-44 object-center object-contain"
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

            <div className="w-full lg:w-[80%] ">
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
            </div>

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
        <div className="w-full flex h-fit px-0 mb-4 flex-col">
          <CodeEditor code={codeSample} readOnly={false} />
          {/* <CodeMirror
            className="w-full rounded-2xl"
            theme={abcdef}
            height="490px"
            maxWidth="100%"
            autoFocus
            readOnly={true}
            basicSetup={{
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              autocompletion: true,
            }}
            extensions={[langs.javascript()]}
            value={codeSample || ""}
          /> */}
        </div>
      )}

      {/* dataVideo */}
      {dataVideo && (
        <div className="w-full flex justify-center items-center  sm:my-10 my-4 flex-col lg:px-10">
          {dataVideo.url && (
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
          )}
          {dataVideo.title && (
            <span className=" sm:text-xl w-full font-semibold text-base text-center my-4">
              {dataVideo.title}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
