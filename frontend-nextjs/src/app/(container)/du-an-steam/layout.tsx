import MainLayout from "@/components/main-layout";

export default function SteamProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
