"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { CourseSearch } from "@/types/CustomType";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";
import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

export default function InputSearchCourse() {
  const [value, setValue] = useState("");
  const [course, setCourse] = useState<CourseSearch[]>([]);
  const debouncedValue = useDebounce(value);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (!debouncedValue) {
      setCourse([]);
      return;
    }
    const fetchData = async () => {
      const res = await fetchPrivateData(
        `/course/search-name?name=${debouncedValue}`,
        { signal }
      );
      if (res) {
        setCourse(res);
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [debouncedValue]);
  return (
    <div className="flex flex-col relative items-end justify-center">
      <div className="relative flex items-center justify-center w-fit ">
        <Input
          id="search"
          className="focus:w-[260px] active:w-[260px] transition-all duration-200 ease-linear  border-none outline-none rounded-full h-9 w-34 py-2 px-3 bg-[#eee] cursor-pointer"
          placeholder="Tìm kiếm"
          type="text"
          onChange={(e) => setValue(e.target.value)}
        />
        <label
          htmlFor="search"
          className="cursor-pointer text-lg  absolute right-2"
        >
          <IoIosSearch className=" font-extralight" />
        </label>
        
      </div>
      {course && course.length > 0 && (
        <div className="absolute left-0 bottom-0 right-0 top-full  h-20 w-[260px] mt-3">
          {course.map((item) => (
            <div
              key={item._id}
              className="bg-white border-b border-gray-200 p-2 cursor-pointer hover:bg-gray-100"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
