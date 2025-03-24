type logoProps = {
  color: string | undefined;
};
const Logo = ({ color }: logoProps) => {
  return (
    <div className="flex flex-col ">
      <span
        className={`font-semibold  text-3xl sm:text-5xl text-shadow-lg`}
        style={{
          color: color,
          textShadow:
            "rgb(106 109 129) 3px 0px 0px, rgba(0, 0, 0, 0) 4px -1px 10px, rgba(0, 0, 0, 0) 16px 1px 2px, rgba(115, 86, 86, 0) 22px 18px 30px",
        }}
      >
        SmartPractice
      </span>
      {/* <span className="font-medium mx-10 xs:hidden" style={{ color: color }}>
        AI/IoT as a service
      </span> */}
    </div>
  );
};

export default Logo;
