import { FaPenNib } from "react-icons/fa6";
type CardUserInforProps = {
  fullname?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
};
export default function CardUserInfor({
  fullname,
  email,
  dateOfBirth,
  address,
}: CardUserInforProps) {
  return (
    <div className="flex items-center justify-between w-full p-5  rounded-lg shadow-sm xl:bg-red-300 ">
      <div className="flex flex-col gap-1 w-full">
        <span className="flex gap-2">
          <span className="font-semibold">{fullname}</span>
          <span className="p-2 py-[2px] bg-green-200 w-fit font-light rounded-full text-sm sm:hidden lg:block">
            {address}
          </span>
        </span>

        <span className="font-light">{email}</span>
        <span className="text-gray-500">{dateOfBirth}</span>

        <div className="sm:flex justify-between items-center w-full hidden lg:hidden">
          <span className="p-2 py-[2px] bg-green-200 w-fit font-light rounded-full text-sm ">
            {address}
          </span>
          <div className="cursor-pointer active:text-amber-400">
            <FaPenNib />
          </div>
        </div>
      </div>
      <div className="cursor-pointer active:text-amber-400 sm:hidden lg:block">
        <FaPenNib />
      </div>
    </div>
  );
}
