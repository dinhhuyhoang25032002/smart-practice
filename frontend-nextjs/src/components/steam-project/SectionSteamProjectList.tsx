import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { SteamProjectInfo } from "@/types/CustomType";
import { format } from "date-fns";
type SectionSteamProjectListProps = {
  data: Array<SteamProjectInfo> | undefined;
};
export default function SectionSteamProjectList({
  data,
}: SectionSteamProjectListProps) {
  return (
    <div className="w-full rounded bg-red-50 px-10">
      <Table className="table-auto">
        <TableCaption className="mb-4 caption-top text-xl font-semibold text-black">
          Những dự án đã tham gia.
        </TableCaption>
        <TableHeader>
          <TableRow className="text-lg font-semibold">
            <TableHead className="">Tên dự án</TableHead>
            <TableHead className="text-center">Người tạo</TableHead>
            <TableHead className="text-center">Ngày khởi tạo</TableHead>
            <TableHead className="text-center">Ngày kết thúc</TableHead>
            <TableHead className="text-center">Số thành viên</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length !== 0 ? (
            data?.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">
                  <Link href={`/du-an-steam/du-an-1?q=${item._id}`}>
                    {item.name}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  {item.leader.fullname}
                </TableCell>
                <TableCell className="text-center">
                  {format(new Date(item.startDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-center">
                  {format(new Date(item.endDate), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="text-center">
                  {item.listMember.length}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-30 text-center text-base text-gray-900"
              >
                Không có dự án nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
