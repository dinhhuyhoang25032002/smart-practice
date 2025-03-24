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
    <div className="h-screen">
      <div>HomePageForStudent</div>
      <Button
        className=" rounded bg-[#239b2f] hover:bg-[#239b2f]"
        effect={"expandIcon"}
        icon={ArrowRightIcon}
        iconPlacement="right"
        onClick={() => router.push("/khoa-hoc")}
      >
        Bắt đầu khóa học
      </Button>
      {/* <CommingSoon /> */}
      <Button
        className=" rounded bg-[#239b2f] hover:bg-[#239b2f]"
        effect={"expandIcon"}
        icon={ArrowRightIcon}
        iconPlacement="right"
        onClick={() =>
          router.push(`/danh-sach-bai-thi-cua-sinh-vien?studentId=${user._id}`)
        }
      >
        Xem điểm
      </Button>
    </div>
  );
}
