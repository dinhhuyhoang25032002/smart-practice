import React, { useEffect } from "react";
import { NotificationData } from "./Notification";

import { toast } from "sonner";
import { HttpStatus, Headers, TYPE_NOTIFICATIOIN } from "@/constant/constant";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { useUserContext } from "@/store/context/AuthContext";

import { FaRegCircleUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";
type NotificationContentProps = {
  notifications: Array<NotificationData>;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationData[]>>;
  setOpenNotification: React.Dispatch<React.SetStateAction<boolean>>;
};
type Notifications = {
  _id: string;
  userId: string;
  content: {
    projectId: string;
    teamNumber: number;
    role: string;
    link: string;
  };
  type: string;
  message: string;
  status: string;
};
export default function NotificationContent({
  notifications,
  setNotifications,
  setOpenNotification,
}: NotificationContentProps) {
  const { user } = useUserContext();
  const router = useRouter();
  const handleJoinProject = async (data: NotificationData) => {
    const { projectId, teamNumber, role, notificationId } = data;
    if (data.type === TYPE_NOTIFICATIOIN.IMPORTANT) {
      const res = await fetchPrivateData(`steam/access-steam-project`, {
        method: "POST",
        body: JSON.stringify({ projectId, teamNumber, role, notificationId }),
        headers: Headers,
      });
      if (res?.status !== HttpStatus.OK) {
        toast.error("Đã xảy ra lỗi khi tham gia dự án.");
        return;
      }
      router.push(data.link);
      setOpenNotification(false);
      toast.success("Đã tham gia dự án thành công.");
    } else if (data.type === TYPE_NOTIFICATIOIN.NORMAL) {
      router.push(data.link);
      setOpenNotification(false);
    }
    // Cập nhật lại danh sách notifications sau khi tham gia dự án
    // setNotifications((prevNotifications) =>
    //   prevNotifications.filter(
    //     (notification) => notification.notificationId !== notificationId,
    //   ),
    // );
    // Có thể thêm logic để chuyển hướng người dùng đến trang dự án hoặc cập nhật giao diện
  };
  useEffect(() => {
    const abortController = new AbortController();
    const handleGetNotification = async () => {
      const res: { status: number; data: Notifications[] } =
        await fetchPrivateData(`notification`, {
          method: "GET",
          headers: Headers,
          signal: abortController.signal,
        });
      // if (res?.status !== HttpStatus.OK) {
      //   toast.error("Đã xảy ra lỗi khi lấy thông báo.");
      //   return;
      // }
      const notifications = res?.data.map((item) => ({
        message: item.message,
        projectId: item?.content?.projectId,
        teamNumber: item?.content?.teamNumber?.toString(),
        link: item?.content?.link,
        type: item?.type,
        role: item?.content?.role,
        notificationId: item._id.toString(),
      }));
      setNotifications(notifications);
    };
    handleGetNotification();
    return () => {
      abortController.abort();
    };
  }, [user._id, setNotifications]);

  return notifications?.length > 0 ? (
    <div className="flex flex-col">
      <div className="border-b border-gray-300 p-2 text-lg font-medium">
        Thông báo
      </div>
      {notifications.map((item, index) => (
        <div
          key={index}
          onClick={() => handleJoinProject(item)}
          className="flex cursor-pointer items-center gap-4 border-b border-gray-300 p-2 text-base font-normal hover:bg-gray-100 active:bg-gray-200"
        >
          <FaRegCircleUser className="text-4xl" />
          <p className="text-justify">{item.message}</p>
        </div>
      ))}
    </div>
  ) : (
    <p className="my-auto w-full text-center text-gray-500">
      Chưa có thông báo nào.
    </p>
  );
}
