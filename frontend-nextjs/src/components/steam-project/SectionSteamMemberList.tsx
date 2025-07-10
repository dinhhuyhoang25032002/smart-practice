import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InviteMemberForm from "./form/InviteMember";
type SectionSteamMemberListProps = {
  members?: Array<{ _id: string; fullname: string }>;
};
export default function SectionSteamMemberList({
  members,
}: SectionSteamMemberListProps) {
  return (
    <div className="bg-white rounded w-full flex flex-col gap-5 justify-center items-center p-10">
      <div className="flex items-center justify-center w-full flex-col gap-3">    
        <span className="text-xl font-semibold">
          Danh sách thành viên trong dự án
        </span>
        <div className="w-full flex justify-end"><InviteMemberForm/></div>
      </div>
      <Table className="table-fixed">
        <TableCaption className="hidden">
          A list of your recent invoices.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Họ và tên</TableHead>
            <TableHead>Nhóm</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Số nhiệm vụ đã nhận</TableHead>
            <TableHead>Số nhiệm vụ đã hoàn thành</TableHead>
            <TableHead>Ngày tham gia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Trần Tuấn Trường</TableCell>
            <TableCell>1</TableCell>
            <TableCell>Nhóm trưởng</TableCell>
            <TableCell>4</TableCell>
            <TableCell>2</TableCell>
            <TableCell>10/07/2025</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
