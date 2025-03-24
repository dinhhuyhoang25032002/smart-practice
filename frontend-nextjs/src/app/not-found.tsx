import Link from "next/link";
import Image from "next/image";
import { BsBoxArrowRight, BsHouseDoor } from "react-icons/bs";
// import { Container } from '@/components/ui/container'
export default function NotFound() {
  return (
    <div className="py-6">
      <div className="flex flex-col justify-center items-center">
        <div>
          <Image
            alt="404-image"
            src="/assets/images/page-not-found.jpg"
            width={640}
            height={200}
            priority
            className="object-contain object-center rounded-[8px]"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <h2 className="text-2xl font-bold uppercase">404</h2>
          <span className="text-lg font-semibold">
            Ối!! Trang không được tìm thấy
          </span>
          <p className="text-base">
            Xin lỗi nhưng trang bạn đang tìm kiếm không tồn tại, đã được LOẠI
            BỎ, tên đã thay đổi hoặc tạm thời không có.
          </p>
          <Link
            href={"/"}
            className="text-xl mt-4 underline flex items-center gap-1 bg-[#228d2c] p-3 rounded-lg text-white "
          >
            <BsHouseDoor className="text-xl font-semibold" /> Quay lại trang chủ
            <BsBoxArrowRight className="text-xl font-semibold ml-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
