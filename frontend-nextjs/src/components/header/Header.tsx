import LeftContentHeader from "@/components/header/LeftContentHeader";
import RightContentHeader from "@/components/header/RightContentHeader";

const Header = () => {
  return (
    <div className="relative z-30 flex w-screen max-w-full flex-col bg-white px-4 py-2 shadow-xl">
      <div className="flex justify-around lg:gap-10">
        <div className="xs:w-full flex w-[80%] items-center justify-center sm:w-full lg:w-[90%] xl:w-[75%]">
          <LeftContentHeader />
        </div>
        <div className="flex w-[45%] items-center justify-center sm:w-[20%] lg:w-[10%] xl:w-[25%]">
          <RightContentHeader />
        </div>
      </div>
    </div>
  );
};

export default Header;
