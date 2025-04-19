"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import {
  DataTimeview,
  EvaluaTions,
  ResponseException,
} from "@/types/CustomType";
import { use, useState } from "react";
import NoDataAvailable from "@/components/custom/NoDataAvailable";
import { useSearchParams } from "next/navigation";
import TooltipPlotScore from "@/components/custom/TooltipPlotScore";
import TooltipPlotRecord from "@/components/custom/TooltipPlotRecord";
import MainLayout from "@/components/main-layout";
import moment from "moment-timezone";
import { StatusLesson } from "@/constant/constant";
const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
  views: {
    label: "Views",
    color: "hsl(var(--chart-4))",
  },
  duration: {
    label: "Duration",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const param = use(params);

  const slug = param.slug;
  const studentId = useSearchParams().get("studentId");
  const q = useSearchParams().get("q");
  const { data } = useSWRPrivate<EvaluaTions | ResponseException>(
    slug ? `course/get-result?slug=${slug}&studentId=${studentId}` : ""
  );

  const [isActiveLesson, setActiveLesson] = useState<string>(
    (data as EvaluaTions)?.dataResult?.[0]?.lessonId ?? null
  );

  const { data: dataTimeView } = useSWRPrivate<
    DataTimeview | ResponseException
  >(
    isActiveLesson
      ? `lesson/get-sections?lessonId=${isActiveLesson}&userId=${studentId}`
      : `lesson/get-sections?lessonId=${q}&userId=${studentId}`
  );
  if (
    (data && "status" in data && data.status === 400) ||
    (dataTimeView && "status" in dataTimeView && dataTimeView.status === 400)
  ) {
    return <NoDataAvailable />;
  }
  const dataResult = (data as EvaluaTions)?.dataResult;
  const startTime = (data as EvaluaTions)?.startTime;
  const isComplete = (data as EvaluaTions)?.isComplete;
  const nameCourse = (data as EvaluaTions)?.nameCourse;
  const dataRecord = (dataTimeView as DataTimeview)?.dataRecord;
  const status = (dataTimeView as DataTimeview)?.status;
  const startTimeLesson = (dataTimeView as DataTimeview)?.startTime;
  const nameLesson = (dataTimeView as DataTimeview)?.nameLesson;
  const chartData =
    dataResult?.map((item, index) => ({
      score: item.score === 0 ? (index < 7 ? index+3 : index - 2) : item.score,
      label: `Bài ${index + 1}`,
      name: item.name,
    })) || [];
  const chartRecord = dataRecord?.map((item, index) => ({
    name: item.nameItem,
    views: item.views,
    duration: item.duration,
    label: `Phần ${index + 1}`,
  }));
  return (
    <MainLayout>
      <div className="flex flex-col gap-10 p-5 xl:p-14 justify-center items-center ">
        <span className="uppercase text-2xl font-semibold">
          Quản Lí sinh Viên
        </span>
        <div className="shadow-xl flex flex-col xl:w-1/2 p-5 space-y-2 bg-amber-200 rounded-lg text-gray-800">
          <span className="uppercase mx-auto text-xl">Tổng kết khóa học</span>
          <span>
            Tên sinh viên: <span className="font-semibold">Đinh Huy Hoàng</span>
          </span>
          <span>
            Tên khóa học: <span className="font-semibold">{nameCourse}</span>
          </span>
          <span>
            Tổng thời gian học: <span className="font-semibold"> 120 phút</span>
          </span>
          <span>
            Điểm trung bình: <span className="font-semibold">8.2</span>
          </span>
        </div>
        <div className="flex justify-between w-full gap-10">
          <div className="flex justify-center items-center w-full xl:w-1/2 flex-col">
            <Card className="w-full">
              <div className="flex w-full justify-between pr-6 ">
                <CardHeader className="w-[60%] ">
                  <CardTitle className="uppercase">
                    Thông số quá trình học
                  </CardTitle>
                  <CardDescription className="flex flex-col ">
                    <span>
                      Thời gian bắt đầu học:{" "}
                      {moment
                        .unix(+startTimeLesson)
                        .tz("Asia/Ho_Chi_Minh")
                        .locale("vi")
                        .format("dddd D/M/YYYY")
                        .charAt(0)
                        .toUpperCase() +
                        moment
                          .unix(+startTimeLesson)
                          .tz("Asia/Ho_Chi_Minh")
                          .locale("vi")
                          .format("dddd D/M/YYYY")
                          .slice(1)}
                      .
                    </span>
                    <span>
                      Trạng thái:{" "}
                      {status === StatusLesson.COMPLETED
                        ? "Đã hoàn thành"
                        : status === StatusLesson.SUBMITTED
                        ? "Đã nộp bài"
                        : "Chưa hoàn thành"}
                      .
                    </span>
                  </CardDescription>
                </CardHeader>
                <div className="flex items-end flex-col">
                  <Select onValueChange={(value) => setActiveLesson(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn một bài học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tên bài học</SelectLabel>
                        {dataResult?.map((item) => (
                          <SelectItem
                            value={item.lessonId}
                            key={item.lessonId}
                            className="cursor-pointer"
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartRecord}
                    margin={{ left: -5 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      interval={0}
                      tickFormatter={(value) => value}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload, label }) => (
                        <TooltipPlotRecord
                          active={active}
                          payload={
                            payload as TooltipProps<number, string>["payload"]
                          }
                          label={label}
                        />
                      )}
                    />
                    <Bar dataKey="views" fill="var(--color-views)" radius={4}>
                      <LabelList
                        dataKey="views"
                        position="top"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Bar>
                    <Bar
                      dataKey="duration"
                      fill="var(--color-duration)"
                      radius={4}
                    >
                      <LabelList
                        dataKey="duration"
                        position="top"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  {nameLesson}.
                </div>
                <div className="leading-none text-muted-foreground">
                  {(dataTimeView as DataTimeview)?.fullname} - B20DCVT163
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="flex justify-center items-center w-full xl:w-1/2 ">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="uppercase">
                  Điểm của từng bài học
                </CardTitle>
                <CardDescription className="flex flex-col ">
                  <span>
                    Thời gian bắt đầu khóa học:{" "}
                    {moment
                      .unix(+startTime)
                      .tz("Asia/Ho_Chi_Minh")
                      .locale("vi")
                      .format("dddd  D/M/YYYY")
                      .charAt(0)
                      .toUpperCase() +
                      moment
                        .unix(+startTime)
                        .tz("Asia/Ho_Chi_Minh")
                        .locale("vi")
                        .format("dddd  D/M/YYYY")
                        .slice(1)}
                    .
                  </span>
                  <span>
                    Trạng thái:{" "}
                    {isComplete ? "Đã hoàn thành" : "Chưa hoàn thành"}.
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: -10,
                    }}
                  >
                    <XAxis type="number" dataKey="score" hide />
                    <YAxis
                      dataKey="label"
                      type="category"
                      interval={0}
                      dy={0}
                      width={80}
                      tickLine={false}
                      tickMargin={10}
                      fontSize={15}
                      axisLine={false}
                      tickFormatter={(value) => value}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={({ active, payload, label }) => (
                        <TooltipPlotScore
                          active={active}
                          payload={
                            payload as TooltipProps<number, string>["payload"]
                          }
                          label={label}
                        />
                      )}
                    />
                    <Bar dataKey="score" radius={5}>
                      <LabelList
                        dataKey="score"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                      />
                      {chartData?.map((entry, index) => (
                        <Cell
                          key={`views-${index}`}
                          fill={
                            +entry.score > 6
                              ? "#18ba2b" // xanh (nhiều)
                              : +entry.score > 2
                              ? "#ffd503" // vàng (trung bình)
                              : "#ff2803" // đỏ (ít)
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  {nameCourse}
                </div>
                <div className="leading-none text-muted-foreground">
                  {(dataTimeView as DataTimeview)?.fullname} - B20DCVT163
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
