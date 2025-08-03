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
import { MemberInfor } from "@/types/CustomType";
import { ROLE_STEAM_PROJECT } from "@/constant/constant";
import Link from "next/link";
import { format } from "date-fns";
type SectionSteamMemberListProps = {
  members?: Array<MemberInfor>;
};
const modelMap: Record<keyof typeof ROLE_STEAM_PROJECT, string> = {
  LEADER: "Trưởng dự án", // Bạn nên thêm cả key LEADER vào đây
  LEADER_TEAM: "Trưởng nhóm",
  MEMBER: "Thành viên",
};
export default function SectionSteamMemberList({
  members,
}: SectionSteamMemberListProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 rounded bg-white p-10">
      <div className="flex w-full flex-col items-center justify-center gap-3">
        <span className="text-xl font-semibold">
          Danh sách thành viên trong dự án
        </span>
        <div className="flex w-full justify-end">
          <InviteMemberForm />
        </div>
      </div>
      <Table className="table-fixed">
        <TableCaption className="hidden">
          A list of your recent invoices.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Họ và tên</TableHead>
            <TableHead className="text-center">Nhóm</TableHead>
            <TableHead className="text-center">Vai trò</TableHead>
            <TableHead className="text-center">
              Nhiệm vụ đang thực hiện
            </TableHead>
            <TableHead className="text-center">
              Nhiệm vụ đã hoàn thành
            </TableHead>
            <TableHead className="text-center">Ngày tham gia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members && members?.length > 0 ? (
            members.map((member) => (
              <TableRow key={member.memberId._id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/du-an-steam/bao-cao-thanh-tich/${member.memberId._id}`}
                  >
                    {member.memberId.fullname}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  {member.teamNumber}
                </TableCell>
                <TableCell className="text-center">
                  {modelMap[member.role]}
                </TableCell>
                <TableCell className="text-center">
                  {member.inProgressTasksCount}
                </TableCell>
                <TableCell className="text-center">
                  {member.completedTasksCount}
                </TableCell>
                <TableCell className="text-center">
                  {format(member.createdAt, "dd/MM/yyyy")}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-[150px] text-center font-semibold text-gray-700"
              >
                Không có thành viên nào trong dự án.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
