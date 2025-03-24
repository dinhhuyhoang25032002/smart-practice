import Logo from "@/components/custom/Logo";
import { MdPhone } from "react-icons/md";
import { GrMail } from "react-icons/gr";
import { IoLocation } from "react-icons/io5";
import { LuCopyright } from "react-icons/lu";
// import { SiShopee } from "react-icons/si";
import { FaFacebookSquare } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import Image from "next/image";
import logoZalo from "@/assets/logo/contact/Icon_of_Zalo.svg";
const SectionFooter = () => {
  return (
    <div className="bg-gradient-to-r from-[#0a5a0d] from-0% via-[#137e17] via-58% to-[#024718] to-100% px-5 sm:px-10 xl:px-16 2xl:px-24 py-14 border-t-2 border-[#48d6e9] ">
      <div className="">
        <div className="flex text-white flex-col ">
          <div className="flex justify-between ">
            <div className="flex justify-between lg:gap-10 gap-5 flex-col lg:flex-row">
              <div className="w-full lg:w-[60%] ">
                <Logo color="white" />
                <div className="flex flex-col gap-8 text-justify">
                  <p className=" mt-3 lg:text-sm text-base font-normal text-white flex flex-col lg:w-full ">
                    <span className="text-sm sm:text-lg flex flex-col 2xl:w-[82%] xl:w-[95%] ">
                      <span className="text-xl sm:text-2xl font-semibold  2xl:mb-8 mb-2">
                        Ứng dụng học tập, thực hành.
                      </span>
                      <span>
                        Đơn vị cung cấp các sản phẩm & giải pháp toàn diện nhằm
                        nâng cao chất lượng của công tác thí nghiệm thực hành
                        trong các trường Đại học, thông qua cá nhân hoá quá
                        trình đào tạo, đào tạo mọi lúc mọi nơi, phục vụ đa dạng
                        như cầu đào tạo của mọi người trên môi trường số.
                      </span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="lg:w-[40%] w-full xl:py-5  flex flex-col text-lg font-normal text-white gap-3">
                <span className="text-xl sm:text-2xl font-semibold text-white  mb-0 uppercase ">
                  Khám phá
                </span>
                <div className="w-full gap-2 flex sm:text-xl  flex-col justify-center">
                  <div className="flex flex-col  gap-2 w-full ">
                    <span className="cursor-pointer hover:text-white">
                      Giới thiệu
                    </span>
                    <span className="cursor-pointer hover:text-white">
                      Blog
                    </span>
                    {/* 
                    <span className="cursor-pointer hover:text-white">
                      Hỗ trợ
                    </span> */}
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <span className="cursor-pointer hover:text-white">
                      Liên hệ
                    </span>
                    <span className="cursor-pointer hover:text-white">
                      Chính sách
                    </span>
                  </div>
                </div>
              </div>
              {/* <span className="flex items-center text-center text-base font-normal text-white sm:hidden xs:hidden lg:hidden">
                <LuCopyright />
                <span className="text-sm font-normal text-white mr-1">
                  2024 Bản quyền thuộc về
                </span>
                <span className=" text-base font-semibold text-white">
                  OPENLAB
                </span>
              </span> */}
            </div>
          </div>

          <div className="flex gap-5 justify-between mt-5 flex-col sm:text-xl lg:flex-row lg:gap-10">
            <div className="lg:w-[60%] space-y-2 w-full  text-lg sm:text-xl">
              <span className="text-xl sm:text-2xl font-semibold text-white block ">
                ĐỊA CHỈ
              </span>

              <span className="flex gap-1 cursor-pointer hover:text-white items-center ">
                <MdPhone className="" />
                (+84) 86 574 6698
              </span>

              <span className="flex gap-1 cursor-pointer hover:text-white items-center  ">
                <GrMail className="" />
                openlab.user@gmail.com
              </span>
              <span className="flex cursor-pointer hover:text-white items-center  gap-1 ">
                <div>
                  <IoLocation className=" text-xl " />
                </div>
                <span className="">
                  59/1194 Đường Láng, Láng Thượng, Đống Đa, HN
                </span>
              </span>
            </div>
            <div className="lg:w-[40%] w-full  flex flex-col justify-between  text-lg font-medium text-white">
              <div className="gap-2 sm:text-xl flex flex-col item">
                <span className="text-xl sm:text-2xl font-semibold text-white mb-2 xs:mb-0 uppercase">
                  Dịch vụ
                </span>
                <span className="cursor-pointer hover:text-white font-normal ">
                  Nền tảng thực hành thông minh
                </span>
                <span className="cursor-pointer hover:text-white font-normal ">
                  Phần mềm CĐS Giáo dục
                </span>
                <span className="cursor-pointer hover:text-white font-normal ">
                  Trợ giảng số AI
                </span>
                {/* <span className="cursor-pointer hover:text-white font-normal flex ">
                  Thiết bị thực hành thông minh
                </span> */}
                <span className="cursor-pointer hover:text-white font-normal flex ">
                  Khóa học thực hành trực tuyến
                </span>
              </div>

              {/* <div className="flex items-center text-4xl rounded  gap-7 xs:px-2 xs:justify-around ">
                <div className="bg-white rounded-md">
                  <FaFacebookSquare className="text-[#1877f2]" />
                </div>
                <div className="bg-white rounded-md">
                  <AiFillTikTok className="text-black" />
                </div>
                <div className="w-9 h-9">
                  <Image
                    src={logoZalo}
                    alt="logo-Zalo"
                    className="object-contain object-center w-full h-full"
                  />
                </div>
               
              </div> */}
            </div>
          </div>

          <div className=" flex justify-between mt-14 items-center flex-col-reverse gap-5 sm:flex-row">
            <span className="flex items-center text-center text-sm font-normal text-white sm:justify-center ">
              <LuCopyright />
              <span className="text-sm sm:text-base font-normal text-white mr-1">
                2025 Bản quyền thuộc về
              </span>
              <span className="text-base font-semibold text-white">
                OPENLAB
              </span>
            </span>
            <div className="flex justify-around items-center text-4xl rounded gap-7 w-full sm:w-fit">
              <div className="bg-white rounded-md">
                <FaFacebookSquare className="text-[#1877f2] cursor-pointer" />
              </div>
              <div className="bg-white rounded-md">
                <AiFillTikTok className="text-black cursor-pointer" />
              </div>
              <div>
                <Image
                  src={logoZalo}
                  alt="logo-Zalo"
                  className="w-9 h-9 object-contain object-center cursor-pointer"
                />
              </div>
              {/* <div className="bg-white rounded-md px-1 py-1 ">
                <SiShopee className="text-[#fd5621] text-3xl cursor-pointer" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionFooter;
