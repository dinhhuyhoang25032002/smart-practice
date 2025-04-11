"use client";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
// import CommingSoon from "@/components/custom/CommingSoon";
import { useUserContext } from "@/store/context/AuthContext";
export default function HomePageForStudent() {
  const router = useRouter();
  const { user } = useUserContext();
  return (
    <div className="h-lvh flex items-center justify-center">
      <div className=" flex gap-10 items-center justify-center ">
        <Button
          className="rounded bg-[#239b2f] hover:bg-[#239b2f] active:opacity-55"
          effect={"expandIcon"}
          icon={ArrowRightIcon}
          iconPlacement="right"
          onClick={() => router.push("/khoa-hoc")}
        >
          Bắt đầu khóa học
        </Button>
        <Button
          className="rounded bg-[#239b2f] hover:bg-[#239b2f] active:opacity-55"
          effect={"expandIcon"}
          icon={ArrowRightIcon}
          iconPlacement="right"
          onClick={() =>
            router.push(
              `/danh-sach-bai-thi-cua-sinh-vien?studentId=${user._id}`
            )
          }
        >
          Xem điểm
        </Button>
      </div>
    </div>
  );
}
