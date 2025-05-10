"use client";

import React, { useState, useEffect } from "react";

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
  useEffect(() => {
    console.log(1);
    setTimeout(() => {
      console.log(2);
    }, 0);
    console.log(3);
    Promise.resolve().then(() => console.log(4));
  }, []);

  return (
    <div>
      <button onClick={() => setShowComponent((prev) => !prev)}>
        {showComponent ? "Ẩn Component" : "Hiện Component"}
      </button>

      {showComponent && <ProgressComponent />}
    </div>
  );
};

export default App;
