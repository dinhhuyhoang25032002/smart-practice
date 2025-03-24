import { toast, Position } from "sonner";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { CiWarning } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
export const toastNotiSuccess = (
  message: string,
  description?: string,
  position?: Position | undefined
) => {
  toast.success(message, {
    action: {
      label: <IoMdClose />,
      onClick: () => {},
    },
    description: <span className="text-white">{description}</span>,
    actionButtonStyle: {
      background: "transparent",
    },
    style: {
      border: "none",
      background: "#11bd1f",
      padding: 10,
      borderRadius: 8,
      gap: 8,
      color: "#FFFFFF",
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400",
    },
    icon: <IoCheckmarkCircleOutline className="font-semibold text-2xl" />,
    position: position ?? "top-right",
  });
};

export const toastNotiFail = (message: string, description?: string) => {
  toast.success(message, {
    action: {
      label: <IoMdClose />,
      onClick: () => {},
    },
    description: <span className="text-white">{description}</span>,
    actionButtonStyle: {
      background: "transparent",
    },

    style: {
      border: "none",
      background: "#d67813",
      padding: 10,
      borderRadius: 8,
      gap: 8,
      color: "#FFFFFF",
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400",
    },
    icon: <CiWarning className="font-semibold text-2xl" />,
    position: "top-right",
  });
};
