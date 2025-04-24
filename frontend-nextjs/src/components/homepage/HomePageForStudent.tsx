"use client";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
// import CommingSoon from "@/components/custom/CommingSoon";
import { useUserContext } from "@/store/context/AuthContext";
import Image from "next/image";
import bgHomePageForStudent from "@/assets/background/homepage/nonbg-01.png";

export default function HomePageForStudent() {
  const router = useRouter();
  const { user } = useUserContext();
  return (
    <div className=" flex flex-col justify-center items-center w-screen max-w-full">
      <div className="h-[600px] w-full flex items-center bg-gradient-to-r from-[#2A9B37] from-0% via-[#75B547] via-48% to-[#68C9CC] to-100% justify-center relative flex-col">
        <Image
          className="absolute inset-0 w-full h-full object-contain object-center"
          src={bgHomePageForStudent}
          alt="image-bg-homepage-student"
        />
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
     
    </div>
  );
}
