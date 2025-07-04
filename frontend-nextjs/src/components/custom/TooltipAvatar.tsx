"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoCalculatorOutline } from "react-icons/io5";
import { FaAddressCard } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { MdEditCalendar } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";
import Link from "next/link";
import { useState, MouseEvent } from "react";
import { handleLogout } from "@/services/auth/authService";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/store/context/AuthContext";
import { toastNotiSuccess } from "@/components/custom/ToastNotification";
export default function TooltipAvatar() {
  const [isOpenProfile, setOpenProfile] = useState(false);
  const router = useRouter();
  const { setUser } = useUserContext();
  const handleLogoutPage = async (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    await handleLogout();
    const resetUser = {
      _id: "",
      email: "",
      fullname: "",
      role: "",
      address: "",
      dateOfBirth: "",
      accessToken: "",
      courses: [],
    };
    localStorage.removeItem("isAuth");
    localStorage.removeItem("s");
    setUser(resetUser);
    router.push(`/`);
    toastNotiSuccess("Bạn đã đăng xuất khỏi hệ thống!");
  };
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={isOpenProfile}>
        <TooltipTrigger
          aria-label="avatar"
          className=""
          onClick={() => setOpenProfile(!isOpenProfile)}
        >
          <div className="flex justify-center items-center gap-2 cursor-pointer ">
            <RxAvatar className="cursor-pointer text-2xl" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="px-0 py-0 bg-white ">
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem className="flex items-center gap-2">
                  <FaAddressCard className="cursor-pointer " />
                  Thông tin cá nhân
                </CommandItem>

                <Link href="/products/courses/search-course">
                  <CommandItem className="flex items-center gap-2">
                    <MdEditCalendar />
                    Thông tin khóa học
                  </CommandItem>
                </Link>
                <Link href="/products/devices-kits/search-kit">
                  <CommandItem className="flex items-center gap-2">
                    <IoCalculatorOutline />
                    Thông tin Thiết bị/Kit
                  </CommandItem>
                </Link>
                <Link href="" onClick={handleLogoutPage}>
                  <CommandItem className="flex items-center gap-2">
                    <MdLogout />
                    Đăng xuất
                  </CommandItem>
                </Link>
              </CommandGroup>
            </CommandList>
          </Command>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
