"use client";
import React, { useState } from "react";

export default function Page() {
  const [idMappingContent, setMappingContent] = useState<string[]>([]); //idMappingContent = 0 -> 1

  console.log(idMappingContent[idMappingContent.length-1],idMappingContent[idMappingContent.length-2]);

  return (
    <div onClick={() => setMappingContent((pre) => [...pre, "ADASD"])}>ádas</div>
  );
}
