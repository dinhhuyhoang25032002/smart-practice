"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditCourseContent from "@/components/course/form/EditCourseForm";

export default function EditLessonPage() {

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white">
      <div className="rounded-lg shadow-lg p-6">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={
            isEditing
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }
        >
          {isEditing ? "Hủy" : "Chỉnh sửa"}
        </Button>
        <EditCourseContent
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        
        />
        
      </div>
    </div>
  );
}
