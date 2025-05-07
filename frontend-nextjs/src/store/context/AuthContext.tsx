"use client";
import { toastNotiFail } from "@/components/custom/ToastNotification";
import { handleGetIsAuth, handleGetUserInfor } from "@/store/localStorage";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
type Course = { productionId: string };

export type UserPropsContext = {
  fullname: string;
  role: string;
  _id: string;
  email: string;
  address?: string;
  image?: string;
  dateOfBirth?: string;
  courses?: Array<Course>;
};

type AuthContextType = {
  user: UserPropsContext;
  setUser: (user: UserPropsContext) => void;
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
};

const initialUser: UserPropsContext = {
  _id: "",
  fullname: "",
  email: "",
  role: "",
  address: "",
  dateOfBirth: "",
  courses: [],
};

export const AuthContext = createContext<AuthContextType>({
  user: initialUser,
  setUser: () => { },
  setOpenSheet: () => { },
  openSheet: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPropsContext>(initialUser);
  const [openSheet, setOpenSheet] = useState(false);
  // const router = useRouter();
  // const [userInfo, setUserInfo] = useState(handleGetUserInfor());
  // const [isLogged, setIsLogged] = useState(handleGetIsAuth());

  // useEffect(() => {
  //   setUserInfo(handleGetUserInfor());
  //   setIsLogged(handleGetIsAuth());
  // }, []);
  // useEffect(() => {
  //   if (!userInfo._id || !userInfo.act || !isLogged) {
  //     router.push("/dang-nhap");
  //   }
  // }, [isLogged, router, userInfo]);
  // useEffect(() => {
  //   const controller = new AbortController();
  //   const signal = controller.signal;

  //   if (!userInfo._id || !userInfo.act || !isLogged) {
  //     return;
  //   }

  //   const fetcher = async () => {
  //     const res = await fetchPrivateData(`user?userId=${userInfo._id}`, {
  //       signal: signal,
  //     });
  //     console.log(res);
  //     if (!res) {
  //       toastNotiFail(
  //         "Không lấy được dữ liệu người dùng",
  //         "Hãy đăng nhập và kiểm tra lại"
  //       );
  //     }

  //     setUser((prev) => ({ ...prev, ...res }));
  //   };
  //   fetcher();
  //   return () => {
  //     controller.abort();
  //   };
  // }, [isLogged, userInfo]);

  const { _id, act } = handleGetUserInfor();
  const router = useRouter();
  const isLogged = handleGetIsAuth();
  const pathname = usePathname();
  useEffect(() => {
    // if (!_id || !act || !isLogged) {
    //   if (pathname === "/dang-nhap") {
    //     return;
    //   }

    //   router.push("/dang-nhap");
    //   return;
    // }

    const fetcher = async () => {
      const res = await fetchPrivateData(`user?userId=${_id}`);

      if (!res) {
        toastNotiFail(
          "Không lấy được dữ liệu người dùng",
          "Hãy đăng nhập và kiểm tra lại"
        );
      }

      setUser((prev) => ({ ...prev, ...res }));
    };
    fetcher();
  }, [_id, act, isLogged, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, setUser, setOpenSheet, openSheet }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUserContext() {
  return useContext(AuthContext);
}
