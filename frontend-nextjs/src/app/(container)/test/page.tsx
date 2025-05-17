"use client";

import { Lesson } from "@/types/CustomType";
import { useSWRPrivate } from "@/hooks/useSWRCustom";
import React, { useState, useEffect, useMemo, useRef } from "react";

const ProgressComponent = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log("ProgressComponent mounted");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 150);

    console.log("Interval started with ID:", interval);

    return () => {
      console.log("Cleaning up interval ID:", interval);
      clearInterval(interval);
    };
  }, []);

  return <div>Progress: {progress}%</div>;
};

//RESULT

const App = () => {
  const [showComponent, setShowComponent] = useState(true);

  return (
    <div>
      <button onClick={() => setShowComponent((prev) => !prev)}>
        {showComponent ? "Ẩn Component" : "Hiện Component"}
      </button>

      {showComponent && <ProgressComponent />}
      <div className="bg-red-500 flex gap-2 ">
        <div className="bg-green-500 w-1/2"></div>
        <div className="bg-blue-500 h-[300px] w-[300px]"></div>
      </div>
    </div>
  );
};

export default App;
