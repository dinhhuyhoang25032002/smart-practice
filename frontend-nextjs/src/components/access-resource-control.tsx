
import ForbiddenResourceError from "@/components/custom/ForbiddenResourceError";
import { useUserContext } from "@/store/context/AuthContext";
import { UserRole } from "@/constant/constant";

export default function AccessControlResource({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUserContext();
  return user.role === UserRole.TEACHER ? (
    <>{children}</>
  ) : (
    <ForbiddenResourceError />
  );
}
