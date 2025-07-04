"use client";
import { useRouter } from "next/navigation";
import { BsHouseDoor } from "react-icons/bs";
import { BsBoxArrowRight } from "react-icons/bs";
import { Button } from "@/components/ui/button";
type ForbiddenResourceErrorProps = {
  namebtn?: string;
};
export default function ForbiddenResourceError({
  namebtn,
}: ForbiddenResourceErrorProps) {
  const router = useRouter();
  const handleRiderect = () => {
    if (!namebtn) {
      router.back();
    }
    router.push("/dang-nhap");
  };
  return (
    <div className="w-full h-full min-h-[500px] flex justify-center items-center flex-col gap-10">
      <div className="text-xl font-semibold lg:text-3xl">
        Không được cấp quyền để truy cập.
      </div>

      <Button
        onClick={handleRiderect}
        className="text-xl underline flex items-center gap-1 bg-[#228d2c] p-2 lg:p-3 rounded-lg text-white cursor-pointer"
      >
        <BsHouseDoor className="text-xl font-semibold" />
        {namebtn ?? "Quay lại trang trước"}
        <BsBoxArrowRight className="text-xl font-semibold ml-4" />
      </Button>
    </div>
  );
}
