import AuthContent from "@/app/(container)/dang-nhap/AuthContent";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "OpenLAB | Đăng Nhập",
  description: "Đăng Nhập",
  openGraph: {
    type: "website",
    title: "OpenLAB",
    description: "Đăng Nhập",
    url: "https://openlab.com.vn/dang-nhap",
    images: [
      {
        url: "http://localhost:3000/_next/static/media/Remove-bg.732fad70.png",
      },
    ],
  },
  applicationName: "OpenLAB",
};
export default function LoginPage() {
  return <AuthContent />;
}
