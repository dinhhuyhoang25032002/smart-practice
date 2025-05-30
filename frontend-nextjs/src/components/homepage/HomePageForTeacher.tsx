"use client";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import { UserPropsContext } from "@/store/context/AuthContext";
import { FaPenNib } from "react-icons/fa6";
import Link from "next/link";
import CardUserInfor from "@/components/custom/CardUserInfor";
import { FaRegCalendarAlt } from "react-icons/fa";
export default function HomePageForTeacher() {
  const { data } = useSWRPrivate<Array<UserPropsContext>>(`user/all-user`);

  return (
    <div className=" flex justify-center items-center flex-col gap-10 p-5 lg:p-10">
      <div className="w-full flex justify-center items-center flex-col">
        <table className="table-auto border-separate border-2 border-gray-400 w-full hidden xl:table">
          <caption className="caption-top uppercase text-2xl font-semibold mb-10">
            Danh sách sinh viên
          </caption>
          <thead>
            <tr>
              <th className="border border-gray-300">Họ và tên</th>
              <th className="border border-gray-300">Email</th>
              <th className="border border-gray-300">Ngày sinh</th>
              <th className="border border-gray-300">Địa chỉ</th>
              <th className="border border-gray-300">Chấm điểm</th>
              <th className="border border-gray-300">Quá trình học</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index} className="hover:bg-[#eee]">
                <td className="border border-gray-300 pl-3">{item.fullname}</td>
                <td className="border border-gray-300 pl-3">{item.email}</td>
                <td className="border border-gray-300 text-center">
                  {item.dateOfBirth}
                </td>
                <td className="border border-gray-300 text-center">
                  {item.address}
                </td>
                <td className="border border-gray-300 text-center cursor-pointer ">
                  <Link
                    className="mx-auto flex justify-center items-center"
                    href={`/danh-sach-bai-thi-cua-sinh-vien?studentId=${item._id}`}
                  >
                    <FaPenNib />
                  </Link>
                </td>
                <td className="border border-gray-300 cursor-pointer text-center">
                  <Link
                    className="mx-auto"
                    href={`/thong-so-hoc-tap?studentId=${item._id}`}
                  >
                    <FaRegCalendarAlt className="mx-auto" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-around  flex-wrap xl:hidden">
          {data?.map((item) => (
            <div key={item._id} className="w-full sm:w-[46%] mb-5 ">
              <CardUserInfor
                fullname={item.fullname}
                email={item.email}
                address={item.address}
                dateOfBirth={item.dateOfBirth}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
