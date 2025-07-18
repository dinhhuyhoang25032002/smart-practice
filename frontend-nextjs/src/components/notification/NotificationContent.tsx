import React from "react";
import { NotificationData } from "./Notification";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { HttpStatus, Headers } from "@/constant/constant";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
type NotificationContentProps = {
  notifications: Array<NotificationData>;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationData[]>>;
};
export default function NotificationContent({
  notifications,
  setNotifications,
}: NotificationContentProps) {
  const handleJoinProject = async (data: NotificationData) => {
    const { projectId, teamNumber, role } = data;
    const res = await fetchPrivateData(`steam/access-steam-project`, {
      method: "POST",
      body: JSON.stringify({ projectId, teamNumber, role }),
      headers: Headers,
    });

    if (res.status !== HttpStatus.OK) {
      toast.error("Đã xảy ra lỗi khi tham gia dự án.");
      return;
    }

    toast.success("Tham gia dự án thành công!");
    // Cập nhật lại danh sách notifications sau khi tham gia dự án
    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notification) =>
          notification.projectId !== projectId &&
          notification.teamNumber !== teamNumber
      )
    );
    // Có thể thêm logic để chuyển hướng người dùng đến trang dự án hoặc cập nhật giao diện
  };
  return notifications.length > 0 ? (
    <div className="flex flex-col-reverse">
      {notifications.map((item, index) => (
        <div
          key={index}
          className="p-2 border-b border-gray-300 flex items-center gap-5"
        >
          <p className="font-semibold">{item.message}</p>
          <Button onClick={() => handleJoinProject(item)}>Tham gia</Button>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">Chưa có thông báo nào.</p>
  );
}
