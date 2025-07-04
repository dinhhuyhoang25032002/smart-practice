import LeftContentHeader from "@/components/header/LeftContentHeader";
import RightContentHeader from "@/components/header/RightContentHeader";

const Header = () => {
  return (
    <div className="flex flex-col shadow-xl w-screen max-w-full bg-white z-30 px-4 py-2 relative">
      <div className="flex justify-around lg:gap-10">
        <div className="w-[80%] flex items-center justify-center sm:w-full xs:w-full  lg:w-[90%] xl:w-[75%]">
          <LeftContentHeader />
        </div>
        <div className="w-[45%] flex items-center justify-center sm:w-[20%]  lg:w-[10%] xl:w-[25%]">
          <RightContentHeader />
        </div>
      </div>
    </div>
  );
};

export default Header;
