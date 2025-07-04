"use client";
import { MouseEvent } from "react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Attendances, DataTimeview, EvaluaTions } from "@/types/CustomType";
import { use, useState } from "react";
import NoDataAvailable from "@/components/custom/NoDataAvailable";
import { useSearchParams } from "next/navigation";
import TooltipPlotScore from "@/components/custom/TooltipPlotScore";
import TooltipPlotRecord from "@/components/custom/TooltipPlotRecord";
import MainLayout from "@/components/main-layout";
import moment from "moment-timezone";
import { Headers, StatusAttendance, StatusLesson } from "@/constant/constant";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
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
  const { data } = useSWRPrivate<EvaluaTions>(
    slug ? `course/get-result?slug=${slug}&studentId=${studentId}` : ""
  );
  const { data: dataAttendance } = useSWRPrivate<Attendances[]>(
    `attendance?studentId=${studentId}`
  );
  const [isActiveLesson, setActiveLesson] = useState(
    data?.dataResult?.[0]?.lessonId ?? null
  );
  const [date, setDate] = useState<Date>();
  const [isPaginationActive, setIsPaginationActive] = useState(1);
  const [checkoutAttendanceByDate, setCheckoutAttendanceByDate] = useState<
    Attendances[]
  >([]);
  const { data: dataTimeView } = useSWRPrivate<DataTimeview>(
    isActiveLesson
      ? `lesson/get-sections?lessonId=${isActiveLesson}&userId=${studentId}`
      : `lesson/get-sections?lessonId=${q}&userId=${studentId}`
  );
  if (
    (data && "status" in data && data.status === 400) ||
    (dataTimeView && "status" in dataTimeView && +dataTimeView.status === 400)
  ) {
    return <NoDataAvailable />;
  }
  const dataResult = data?.dataResult;
  const startTime = data?.startTime;
  const isComplete = data?.isComplete;
  const nameCourse = data?.nameCourse;
  const dataRecord = dataTimeView?.dataRecord;
  const status = dataTimeView?.status;
  const startTimeLesson = dataTimeView?.startTime;
  const nameLesson = dataTimeView?.nameLesson;
  const chartData =
    dataResult?.map((item, index) => ({
      score:
        item.score === 0 ? (index < 7 ? index + 3 : index - 2) : item.score,
      label: `Bài ${index + 1}`,
      name: item.name,
    })) || [];
  const chartRecord = dataRecord?.map((item, index) => ({
    name: item.nameItem,
    views: item.views,
    duration: item.duration,
    label: `Phần ${index + 1}`,
  }));

  const handlePageChange = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    next?: boolean,
    numberPaginationActive?: number
  ) => {
    e.preventDefault();
    if (next) {
      setIsPaginationActive((prev) => prev + 1);
      return;
    }
    if (numberPaginationActive) {
      setIsPaginationActive(numberPaginationActive);
      console.log(isPaginationActive);
      return;
    }
    setIsPaginationActive((prev) => prev - 1);
  };
  const handleCheckoutByDate = async (date: Date | undefined) => {
    if (!date) {
      setDate(date);
      return;
    }
    setDate(date);
    const dateString = new Date(date as Date).toLocaleDateString("vi-VN");
    const res = await fetchPrivateData(
      `attendance/search-date?studentId=${studentId}&date=${dateString}`,
      {
        method: "GET",
        headers: Headers,
      }
    );
    if (res && res.status === 400) {
      setCheckoutAttendanceByDate([]);
      return;
    }
    setCheckoutAttendanceByDate(res);
    console.log(date, dateString);
  };
  return (
    <MainLayout>
      <div className="flex flex-col gap-5 xl:gap-10 p-5 xl:p-14 justify-center items-center ">
        <span className="uppercase text-2xl font-semibold">
          Quản Lí sinh Viên
        </span>
        <div className="flex items-center w-full gap-10">
          <div className="shadow-xl flex flex-col xl:w-1/2 p-5 space-y-2 bg-amber-200 rounded-lg text-gray-800">
            <span className="uppercase mx-auto text-xl">Tổng kết khóa học</span>
            <span>
              Tên sinh viên:{" "}
              <span className="font-semibold">Đinh Huy Hoàng</span>
            </span>
            <span>
              Tên khóa học: <span className="font-semibold">{nameCourse}</span>
            </span>
            <span>
              Tổng thời gian học:{" "}
              <span className="font-semibold"> 120 phút</span>
            </span>
            <span>
              Điểm trung bình: <span className="font-semibold">8.2</span>
            </span>
          </div>
        </div>
        <div className="flex justify-between w-full gap-5 xl:gap-10 flex-col xl:flex-row">
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
                      {startTimeLesson &&
                        moment
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
                {dataRecord?.length === 0 ? (
                  <div className="flex justify-center items-center w-full h-[200px]">
                    <span className="text-xl font-semibold text-muted-foreground">
                      Chưa có dữ liệu thống kê.
                    </span>
                  </div>
                ) : (
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
                )}
              </CardContent>

              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  {nameLesson}.
                </div>
                <div className="leading-none text-muted-foreground">
                  {dataTimeView?.fullname} - B20DCVT163
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
                    {startTime &&
                      moment
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
                {dataResult?.length === 0 ? (
                  <div className="flex justify-center items-center w-full h-[200px]">
                    <span className="text-xl font-semibold text-muted-foreground">
                      Chưa có dữ liệu thống kê.
                    </span>
                  </div>
                ) : (
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
                                ? "#18ba2b"
                                : +entry.score > 2
                                ? "#ffd503"
                                : "#ff2803"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                  {nameCourse}
                </div>
                <div className="leading-none text-muted-foreground">
                  {dataTimeView?.fullname} - B20DCVT163
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="flex justify-center items-center w-full flex-col gap-10 xl:px-20">
          <Table className="table-auto">
            <TableCaption className="caption-top text-2xl font-semibold mb-10 text-black">
              <div className="flex items-center justify-between w-full flex-col xl:flex-row gap-5">
                <span className="text-xl xl:text-2xl">
                  Danh sách thời gian điểm danh của sinh viên.
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {date ? (
                        new Date(date as Date).toLocaleDateString("vi-VN")
                      ) : (
                        <span>Chọn ngày để tìm kiếm</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => handleCheckoutByDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </TableCaption>

            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="">Ngày học</TableHead>
                <TableHead>Giờ điểm danh</TableHead>
                <TableHead>Ca</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {date ? (
                checkoutAttendanceByDate?.length === 0 ? (
                  <TableRow className="h-[200px]">
                    <TableCell
                      colSpan={4}
                      className="text-center text-xl font-semibold text-muted-foreground"
                    >
                      Không có dữ liệu điểm danh.
                    </TableCell>
                  </TableRow>
                ) : (
                  checkoutAttendanceByDate?.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">{item.day}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>{item.shift}</TableCell>
                      <TableCell>
                        {item.status === StatusAttendance.LATE
                          ? "Vào muộn"
                          : item.status === StatusAttendance.ON_TIME
                          ? "Đúng giờ"
                          : "Không xác định"}
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : dataAttendance &&
                "status" in dataAttendance &&
                dataAttendance.status === 400 ? (
                <TableRow className="h-[200px]">
                  <TableCell
                    colSpan={4}
                    className="text-center text-xl font-semibold text-muted-foreground"
                  >
                    Chưa có dữ liệu điểm danh.
                  </TableCell>
                </TableRow>
              ) : (
                dataAttendance?.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.day}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.shift}</TableCell>
                    <TableCell>
                      {item.status === StatusAttendance.LATE
                        ? "Vào muộn"
                        : item.status === StatusAttendance.ON_TIME
                        ? "Đúng giờ"
                        : "Không xác định"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem
                className={`${isPaginationActive === 1 && "hidden"}`}
              >
                <PaginationPrevious
                  onClick={(e) => handlePageChange(e, false)}
                  href={""}
                />
              </PaginationItem>
              {Array.from({ length: 4 }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={(e) =>
                      handlePageChange(e, false, isPaginationActive + index)
                    }
                    href={""}
                    isActive={isPaginationActive + index === isPaginationActive}
                  >
                    {isPaginationActive + index}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => handlePageChange(e, true)}
                  href={""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </MainLayout>
  );
}
