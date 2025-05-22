import { ContentLesson, IndexItemProps } from "@/types/CustomType";
import { useCallback } from "react";
import { Control, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import CodeMirror from "@uiw/react-codemirror";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditLessonFormType } from "@/types/Type";
import { langs } from "@uiw/codemirror-extensions-langs";
import { RiAddCircleLine, RiDeleteBack2Line } from "react-icons/ri";
import { abcdef } from "@uiw/codemirror-themes-all";

type SectionLessonProps = ContentLesson & {
  header?: IndexItemProps;
  control: Control<EditLessonFormType>;
  index: number;
  form: UseFormReturn<EditLessonFormType>;
};

export default function EditLessonContentForm({
  dataImage,
  dataList2,
  dataList,
  dataMerge,
  header,
  form,
  dataPlus,
  dataSlides,
  dataTab,
  dataVideo,
  contentText,
  codeSample,
  control,
  index,
}: SectionLessonProps) {
  const handleAddContentText = useCallback(() => {
    form.setValue(`content.${index}.contentText`, [
      ...(form.getValues(`content.${index}.contentText`) || []),
      "",
    ]);
  }, [form, index]);

  const handleDeleteContentText = useCallback(
    (indexContentText: number) => {
      const contentText = form.getValues(`content.${index}.contentText`);
      if (contentText) {
        const newContentText = contentText.filter(
          (_, i) => i !== indexContentText
        );
        form.setValue(`content.${index}.contentText`, newContentText);
      }
    },
    [form, index]
  );

  const handleAddDataForDataPlus = useCallback(() => {
    form.setValue(`content.${index}.dataPlus`, {
      ...(form.getValues(`content.${index}.dataPlus`) || {
        header: "",
        data: [],
      }),
      data: [
        ...(form.getValues(`content.${index}.dataPlus`)?.data || []),
        { title: "", description: [] },
      ],
    });
  }, [form, index]);

  const handleDeleteDataForDataPlus = useCallback(
    (indexDataPlus: number) => {
      form.setValue(`content.${index}.dataPlus.data`, [
        ...(form.getValues(`content.${index}.dataPlus.data`) || []).filter(
          (_, i) => i !== indexDataPlus
        ),
      ]);
    },
    [form, index]
  );

  const handleDeleteDataPlus = useCallback(() => {
    if (form.getValues(`content.${index}.dataPlus.data`)?.length > 0) {
      form.setValue(`content.${index}.dataPlus.header`, undefined);
      return;
    }
    form.setValue(`content.${index}.dataPlus`, undefined);
  }, [form, index]);

  const handleAddDataImage = useCallback(() => {
    form.setValue(`content.${index}.dataImage`, {
      ...(form.getValues(`content.${index}.dataImage`) || {}),
      url: "",
      title: "",
    });
  }, [form, index]);

  const handleDeleteDataImage = useCallback(() => {
    form.setValue(`content.${index}.dataImage`, undefined);
  }, [form, index]);

  const handleAddDataList = useCallback(() => {
    form.setValue(`content.${index}.dataList`, {
      ...(form.getValues(`content.${index}.dataList`) || {}),
      data: [...(form.getValues(`content.${index}.dataList`)?.data || []), ""],
    });
  }, [form, index]);

  const handleAddDataList2 = useCallback(() => {
    form.setValue(`content.${index}.dataList2`, {
      ...(form.getValues(`content.${index}.dataList2`) || {}),
      data: [...(form.getValues(`content.${index}.dataList2`)?.data || []), ""],
    });
  }, [form, index]);

  const handleDeleteDataList = useCallback(
    (indexDataList: number) => {
      form.setValue(`content.${index}.dataList.data`, [
        ...(form.getValues(`content.${index}.dataList.data`) || []).filter(
          (_, i) => i !== indexDataList
        ),
      ]);
    },
    [form, index]
  );

  const handleDeleteDataList2 = useCallback(
    (indexDataList2: number) => {
      form.setValue(`content.${index}.dataList2.data`, [
        ...(form.getValues(`content.${index}.dataList2.data`) || []).filter(
          (_, i) => i !== indexDataList2
        ),
      ]);
    },
    [form, index]
  );

  const handleAddDataMerge = useCallback(() => {
    form.setValue(`content.${index}.dataMerge`, {
      ...(form.getValues(`content.${index}.dataMerge`) || {
        data: [],
        image: "",
        header: "",
      }),
      data: [
        ...(form.getValues(`content.${index}.dataMerge`)?.data || []),
        {
          label: "",
          description: [
            {
              title: "",
              description: [""],
            },
          ],
        },
      ],
    });
    console.log(
      "form.getValues(`content.${index}.dataMerge`):",
      form.getValues(`content.${index}.dataMerge`)
    );
  }, [form, index]);

  const handleAddDataVideo = useCallback(() => {
    form.setValue(`content.${index}.dataVideo`, {
      ...(form.getValues(`content.${index}.dataVideo`) || {}),
      url: "",
      title: "",
    });
  }, [form, index]);

  const handleAddDataSlides = useCallback(() => {
    form.setValue(`content.${index}.dataSlides`, {
      ...(form.getValues(`content.${index}.dataSlides`) || {}),
      title: form.getValues(`content.${index}.dataSlides.title`),
      data: [
        ...(form.getValues(`content.${index}.dataSlides`)?.data || []),
        { image: "", description: "" },
      ],
    });

    console.log(
      "form.getValues(`content.${index}.dataSlides`):",
      form.getValues(`content.${index}.dataSlides`)
    );
  }, [form, index]);

  const handleDeleteDataSlides = useCallback(
    (indexDataSlides: number) => {
      form.setValue(`content.${index}.dataSlides.data`, [
        ...(form.getValues(`content.${index}.dataSlides.data`) || []).filter(
          (_, i) => i !== indexDataSlides
        ),
      ]);
    },
    [form, index]
  );

  const handleAddDataTab = useCallback(() => {
    form.setValue(`content.${index}.dataTab`, {
      ...(form.getValues(`content.${index}.dataTab`) || {}),
      header: "",
      data: [
        ...(form.getValues(`content.${index}.dataTab`)?.data || []),
        {
          title: "",
          image: "",
        },
      ],
    });
    console.log(
      "form.getValues(`content.${index}.dataTab`):",
      form.getValues(`content.${index}.dataTab`)
    );
  }, [form, index]);

  const handleAddDataForDataTab = useCallback(() => {
    form.setValue(`content.${index}.dataTab.data`, [
      ...(form.getValues(`content.${index}.dataTab.data`) || []),
      { title: "", image: "" },
    ]);
  }, [form, index]);

  const handleDeleteDataForDataTab = useCallback(
    (indexDataTab: number) => {
      form.setValue(`content.${index}.dataTab.data`, [
        ...(form.getValues(`content.${index}.dataTab.data`) || []).filter(
          (_, i) => i !== indexDataTab
        ),
      ]);
    },
    [form, index]
  );

  const handleAddDataForDataMerge = useCallback(() => {
    form.setValue(`content.${index}.dataMerge.data`, [
      ...(form.getValues(`content.${index}.dataMerge.data`) || []),
      { label: "", description: [] },
    ]);
  }, [form, index]);

  const handleAddSubDescriptionForDataMerge = useCallback(
    (indexDataMerge: number, indexs: number) => {
      form.setValue(
        `content.${index}.dataMerge.data.${indexDataMerge}.description.${indexs}.description`,
        [
          ...(form.getValues(
            `content.${index}.dataMerge.data.${indexDataMerge}.description.${indexs}.description`
          ) || []),
          "",
        ]
      );
    },
    [form, index]
  );

  const handleDeleteSubDescriptionForDataMerge = useCallback(
    (indexDataMerge: number, indexs: number, indexX: number) => {
      form.setValue(
        `content.${index}.dataMerge.data.${indexDataMerge}.description.${indexs}.description`,
        [
          ...(
            form.getValues(
              `content.${index}.dataMerge.data.${indexDataMerge}.description.${indexs}.description`
            ) || []
          ).filter((_, i) => i !== indexX),
        ]
      );
    },
    [form, index]
  );

  const handleAddDescriptionForDataMerge = useCallback(
    (indexDataMerge: number) => {
      form.setValue(
        `content.${index}.dataMerge.data.${indexDataMerge}.description`,
        [
          ...(form.getValues(
            `content.${index}.dataMerge.data.${indexDataMerge}.description`
          ) || []),
          { title: "", description: [] },
        ]
      );
    },
    [form, index]
  );

  const handleDeleteDescriptionForDataMerge = useCallback(
    (indexDataMerge: number, indexs: number) => {
      form.setValue(
        `content.${index}.dataMerge.data.${indexDataMerge}.description`,
        [
          ...(
            form.getValues(
              `content.${index}.dataMerge.data.${indexDataMerge}.description`
            ) || []
          ).filter((_, i) => i !== indexs),
        ]
      );
    },
    [form, index]
  );

  return (
    <div className="flex flex-col justify-center items-center w-full space-y-4">
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
      {contentText && contentText.length > 0 ? (
        <ul className="w-full">
          {contentText.map((_, indexContentText) => {
            return (
              <li
                key={indexContentText}
                className="inline-flex items-center gap-2 py-3 hover:shadow-md shadow-sm bg-white w-full px-2 mb-2 rounded-sm"
              >
                <RiAddCircleLine
                  className="text-base text-gray-500 hover:text-green-500 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddContentText();
                  }}
                />
                <FormField
                  control={control}
                  name={`content.${index}.contentText.${indexContentText}`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nhập nội dung đoạn văn."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <RiDeleteBack2Line
                  className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteContentText(indexContentText);
                  }}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="w-full h-full flex items-center justify-center gap-2 flex-col bg-white p-2 rounded-md">
          <span className="text-gray-500">Không có nội dung</span>
          <div className="flex items-center justify-center gap-2 w-full">
            <Button onClick={handleAddContentText}>Thêm mới</Button>
          </div>
        </div>
      )}
      {/* dataPlus */}
      {!_.isEmpty(dataPlus) ? (
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center gap-2 w-full bg-white p-2  rounded-md">
            <FormField
              control={control}
              name={`content.${index}.dataPlus.header`}
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormControl>
                    <Input {...field} placeholder="Nhập tiêu đề" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RiDeleteBack2Line
              className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteDataPlus();
              }}
            />
          </div>
          {dataPlus?.data && dataPlus.data.length > 0 ? (
            dataPlus.data.map((_, indexDataPlus) => {
              return (
                <div
                  key={indexDataPlus}
                  className="w-full bg-white p-2 rounded-md flex items-center gap-2"
                >
                  <RiAddCircleLine
                    className="text-base text-gray-500 hover:text-green-500 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddDataForDataPlus();
                    }}
                  />
                  <div className="flex flex-col gap-2 w-full">
                    <FormField
                      control={control}
                      name={`content.${index}.dataPlus.data.${indexDataPlus}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="Nhập title" />
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
                          <FormControl>
                            <Input {...field} placeholder="Nhập description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <RiDeleteBack2Line
                    className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDataForDataPlus(indexDataPlus);
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center gap-2 flex-col">
              <span className="text-gray-500">Không có data cho dataPlus</span>
              <div className="flex items-center gap-2 w-full">
                <Button onClick={handleAddDataForDataPlus}>Thêm mới</Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center gap-2 flex-col bg-white p-2 rounded-md">
          <span className="text-gray-500">Không có dataPlus</span>
          <div className="flex gap-2 w-full items-center justify-center">
            <Button onClick={handleAddDataForDataPlus}>Thêm mới</Button>
          </div>
        </div>
      )}
      {!_.isEmpty(dataImage) ? (
        <div
          className={
            "flex  items-center justify-center w-full bg-white p-2 gap-3 rounded-md"
          }
        >
          <div className="flex items-center gap-2 w-full flex-col">
            <FormField
              control={control}
              name={`content.${index}.dataImage.url`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} placeholder="Nhập Link hình ảnh" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`content.${index}.dataImage.title`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên hình ảnh" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <RiDeleteBack2Line
            className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteDataImage();
            }}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center gap-2 flex-col bg-white p-2 rounded-md">
          <span className="text-gray-500">Không có dataImage</span>
          <div className="flex items-center justify-center gap-2 w-full">
            <Button onClick={handleAddDataImage}>Thêm mới</Button>
          </div>
        </div>
      )}
      {/* dataList & dataList2 */}

      <div className="flex flex-col items-center justify-center mb-4 w-full">
        <div className=" flex justify-between bg-white p-2 rounded-md w-full gap-2 ">
          {dataList ? (
            <div className="w-1/2 h-full flex items-center justify-center gap-2 flex-col">
              <FormField
                control={control}
                name={`content.${index}.dataList.header`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập tiêu đề cho dataList"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!_.isEmpty(dataList.data) ? (
                <ul className="w-full">
                  {dataList.data?.map((_, indexDataList) => {
                    return (
                      <li
                        key={indexDataList}
                        className="flex items-center gap-2 mb-2 justify-between"
                      >
                        <RiAddCircleLine
                          className="text-base text-gray-500 hover:text-green-500 cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddDataList();
                          }}
                        />
                        <FormField
                          control={control}
                          name={`content.${index}.dataList.data.${indexDataList}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} placeholder="Nhập nội dung" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <RiDeleteBack2Line
                          className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDataList(indexDataList);
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="w-full h-full flex items-center justify-center gap-2 flex-col ">
                  <span className="text-gray-500">Không có dataList</span>
                  <div className="flex items-center gap-2 w-full justify-center">
                    <Button onClick={handleAddDataList}>Thêm mới</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center gap-2 flex-col">
              <span className="text-gray-500">Không có dataList</span>
              <div className="flex items-center gap-2 w-full justify-center">
                <Button onClick={handleAddDataList}>Thêm mới</Button>
              </div>
            </div>
          )}
          {dataList2 ? (
            <div className="w-1/2 h-full flex items-center justify-center gap-2 flex-col">
              <FormField
                control={control}
                name={`content.${index}.dataList2.header`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập tiêu đề cho dataList2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!_.isEmpty(dataList2.data) ? (
                <ul className="w-full">
                  {dataList2?.data?.map((_, indexDataList2) => {
                    return (
                      <li
                        key={indexDataList2}
                        className="flex items-center gap-2 mb-2 justify-between"
                      >
                        <RiAddCircleLine
                          className="text-base text-gray-500 hover:text-green-500 cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddDataList2();
                          }}
                        />
                        <FormField
                          control={control}
                          name={`content.${index}.dataList2.data.${indexDataList2}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} placeholder="Nhập nội dung" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <RiDeleteBack2Line
                          className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDataList2(indexDataList2);
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="w-full h-full flex items-center justify-center gap-2 flex-col">
                  <span className="text-gray-500">Không có dataList2</span>
                  <div className="flex items-center gap-2 w-full justify-center">
                    <Button onClick={handleAddDataList2}>Thêm mới</Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center gap-2 flex-col">
              <span className="text-gray-500">Không có dataList2</span>
              <div className="flex items-center gap-2 w-full justify-center">
                <Button onClick={handleAddDataList2}>Thêm mới</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* dataMerge */}
      {dataMerge ? (
        <div className="flex flex-col items-center justify-center gap-4  w-full">
          <div className=" flex flex-col gap-4  w-full ">
            <FormField
              control={control}
              name={`content.${index}.dataMerge.header`}
              render={({ field }) => (
                <FormItem className="w-full bg-white p-2 rounded-md ">
                  <FormControl>
                    <Input {...field} placeholder="Nhập header" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-around w-full flex-col gap-4">
            <div className="w-full flex flex-col">
              {dataMerge?.data && dataMerge.data.length > 0 ? (
                dataMerge.data.map((item, indexDataMerge) => {
                  return (
                    <div
                      key={indexDataMerge}
                      className="w-full flex flex-col gap-4"
                    >
                      <FormField
                        control={control}
                        name={`content.${index}.dataMerge.data.${indexDataMerge}.label`}
                        render={({ field }) => (
                          <FormItem className="w-full bg-white p-2 rounded-md ">
                            <FormControl>
                              <Input {...field} placeholder="Nhập label" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col gap-4">
                        {item?.description && item?.description?.length > 0 ? (
                          item?.description?.map((x, indexs) => {
                            return (
                              <div
                                key={indexs}
                                className="flex flex-col gap-2 bg-white p-2 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <RiAddCircleLine
                                    className="text-base text-gray-500 hover:text-green-500 cursor-pointer transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddDescriptionForDataMerge(
                                        indexDataMerge
                                      );
                                    }}
                                  />
                                  <FormField
                                    control={control}
                                    name={`content.${index}.dataMerge.data.${indexDataMerge}.description.${indexs}.title`}
                                    render={({ field }) => (
                                      <FormItem className="w-full">
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="Nhập title"
                                            className="font-semibold"
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <RiDeleteBack2Line
                                    className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteDescriptionForDataMerge(
                                        indexDataMerge,
                                        indexs
                                      );
                                    }}
                                  />
                                </div>

                                {x?.description &&
                                x?.description?.length > 0 ? (
                                  <div>
                                    {x?.description?.map((_, indexX) => {
                                      return (
                                        <div
                                          key={indexX}
                                          className="flex items-center gap-2 mb-2"
                                        >
                                          <RiAddCircleLine
                                            className="text-base text-gray-500 hover:text-green-500 cursor-pointer transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAddSubDescriptionForDataMerge(
                                                indexDataMerge,
                                                indexs
                                              );
                                            }}
                                          />
                                          <FormField
                                            control={control}
                                            key={indexX}
                                            name={`content.${index}.dataMerge.data.${indexDataMerge}.description.${indexs}.description.${indexX}`}
                                            render={({ field }) => (
                                              <FormItem className="w-full">
                                                <FormControl>
                                                  <Input
                                                    {...field}
                                                    placeholder="Nhập nội dung 1"
                                                  />
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />
                                          <RiDeleteBack2Line
                                            className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteSubDescriptionForDataMerge(
                                                indexDataMerge,
                                                indexs,
                                                indexX
                                              );
                                            }}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center gap-2 flex-col">
                                    <span className="text-gray-500">
                                      Không có sub description cho dataMerge
                                    </span>
                                    <div className="flex items-center gap-2 w-full justify-center">
                                      <Button
                                        onClick={() =>
                                          handleAddSubDescriptionForDataMerge(
                                            indexDataMerge,
                                            indexs
                                          )
                                        }
                                      >
                                        Thêm mới
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="w-full h-full flex items-center justify-center gap-2 flex-col">
                            <span className="text-gray-500">
                              Không có description cho dataMerge
                            </span>
                            <div className="flex items-center gap-2 w-full justify-center">
                              <Button
                                onClick={() =>
                                  handleAddDescriptionForDataMerge(
                                    indexDataMerge
                                  )
                                }
                              >
                                Thêm mới
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center gap-2 flex-col">
                  <span className="text-gray-500">
                    Không có data cho dataMerge
                  </span>
                  <div className="flex items-center gap-2 w-full justify-center">
                    <Button onClick={handleAddDataForDataMerge}>
                      Thêm mới
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full bg-white p-2 rounded-md ">
              <FormField
                control={control}
                name={`content.${index}.dataMerge.image`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Nhập Link hình ảnh" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center gap-2 flex-col bg-white p-2 rounded-md">
          <span className="text-gray-500">Không có dataMerge</span>
          <div className="flex items-center gap-2 w-full justify-center">
            <Button onClick={handleAddDataMerge}>Thêm mới</Button>
          </div>
        </div>
      )}
      {/* dataTab */}
      {dataTab ? (
        <div className="flex justify-center flex-col items-center w-full gap-4">
          <FormField
            control={control}
            name={`content.${index}.dataTab.header`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input {...field} placeholder="Nhập header" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {dataTab?.data?.length > 0 ? (
            <div className="w-full flex justify-center items-center gap-4 flex-col">
              {dataTab?.data?.map((_, indexDataTab) => {
                return (
                  <div
                    key={indexDataTab}
                    className="w-full flex items-center gap-2 bg-white p-2 rounded-md"
                  >
                    <RiAddCircleLine
                      className="text-base text-gray-500 hover:text-green-500 cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddDataForDataTab();
                      }}
                    />
                    <div className="flex gap-2 flex-col w-full">
                      <FormField
                        control={control}
                        name={`content.${index}.dataTab.data.${indexDataTab}.title`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input {...field} placeholder="Nhập title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`content.${index}.dataTab.data.${indexDataTab}.image`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Nhập link hình ảnh"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <RiDeleteBack2Line
                      className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDataForDataTab(indexDataTab);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center gap-2 flex-col bg-white p-2 rounded-md">
              <span className="text-gray-500">Không có data cho dataTab</span>
              <div className="flex items-center gap-2 w-full justify-center">
                <Button onClick={handleAddDataTab}>Thêm mới</Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center gap-2 flex-col bg-white p-2 rounded-md">
          <span className="text-gray-500">Không có dataTab</span>
          <div className="flex items-center gap-2 w-full justify-center">
            <Button onClick={handleAddDataTab}>Thêm mới</Button>
          </div>
        </div>
      )}
      {/* dataSlides */}
      {dataSlides ? (
        <div className="flex flex-col w-full items-center ">
          <FormField
            control={control}
            name={`content.${index}.dataSlides.title`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input {...field} placeholder="Nhập title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-center items-center gap-4 flex-col">
            {dataSlides?.data?.length > 0 ? (
              dataSlides?.data?.map((_, indexdataSlides) => {
                return (
                  <div
                    className=" w-full flex items-center gap-2"
                    key={indexdataSlides}
                  >
                    <RiAddCircleLine
                      className="text-base text-gray-500 hover:text-green-500 cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddDataSlides();
                      }}
                    />
                    <div className="w-full flex items-center gap-2  justify-center flex-col p-2 rounded-md bg-white">
                      <FormField
                        control={control}
                        name={`content.${index}.dataSlides.data.${indexdataSlides}.image`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Nhập link hình ảnh"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`content.${index}.dataSlides.data.${indexdataSlides}.description`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input {...field} placeholder="Nhập nội dung" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <RiDeleteBack2Line
                      className="text-base text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDataSlides(indexdataSlides);
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center gap-2 flex-col bg-white p-2 rounded-md">
                <span className="text-gray-500">Không có data dataSlides</span>
                <div className="flex items-center gap-2 w-full justify-center">
                  <Button onClick={handleAddDataSlides}>Thêm mới</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center gap-2 flex-col bg-white p-2 rounded-md">
          <span className="text-gray-500">Không có dataSlides</span>
          <div className="flex items-center gap-2 w-full justify-center">
            <Button onClick={handleAddDataSlides}>Thêm mới</Button>
          </div>
        </div>
      )}
      {/* codeSample */}
      {codeSample && (
        <div className="w-full gap-4 h-fit px-0 mb-4">
          <FormField
            control={control}
            name={`content.${index}.codeSample`}
            render={({ field }) => (
              <FormItem className="w-full iteams-center flex">
                <FormControl>
                  <CodeMirror
                    className="w-full h-full rounded-2xl"
                    theme={abcdef}
                    height="490px"
                    maxWidth="100%"
                    autoFocus
                    // readOnly={true}
                    basicSetup={{
                      foldGutter: true,
                      dropCursor: true,
                      allowMultipleSelections: true,
                      indentOnInput: true,
                      autocompletion: true,
                    }}
                    extensions={[langs.javascript()]}
                    onChange={(value) => {
                      console.log("value:", value);
                    }}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      {/* dataVideo */}
      {dataVideo ? (
        <div className="w-full flex justify-center items-center gap-4 bg-white p-2 rounded-md  my-4 flex-col ">
          <FormField
            control={control}
            name={`content.${index}.dataVideo.url`}
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormControl>
                  <Input {...field} placeholder="Nhập link video" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`content.${index}.dataVideo.title`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input {...field} placeholder="Nhập title video" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center gap-2 flex-col bg-white p-2 rounded-md">
          <span className="text-gray-500">Không có dataVideo</span>
          <div className="flex items-center gap-2 w-full justify-center">
            <Button onClick={handleAddDataVideo}>Thêm mới</Button>
          </div>
        </div>
      )}
    </div>
  );
}
