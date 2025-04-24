"use client";
import { useUserContext } from "@/store/context/AuthContext";
import { UserRole } from "@/constant/constant";
import HomePageForStudent from "@/components/homepage/HomePageForStudent";
import HomePageForTeacher from "@/components/homepage/HomePageForTeacher";
import MainLayout from "@/components/main-layout";
import ForbiddenResourceError from "@/components/custom/ForbiddenResourceError";

export default function Home() {
  const renderHomepage = (type: string) => {
    switch (type) {
      case UserRole.STUDENT:
        return <HomePageForStudent />;
      case UserRole.TEACHER:
        return <HomePageForTeacher />;
      default:
        return <HomePageForStudent />;;
    }
  };
  const { user } = useUserContext();

  return (
    <>
      <MainLayout>{renderHomepage(user.role)}</MainLayout>
    </>
  );
}
