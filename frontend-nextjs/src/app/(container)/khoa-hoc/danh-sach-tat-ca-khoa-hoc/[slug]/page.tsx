"use client";
import { ContentLesson, IndexItemProps } from "@/types/CustomType";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  toastNotiSuccess,
  toastNotiFail,
} from "@/components/custom/ToastNotification";
import EditCourseContent from "@/components/course/form/EditCourseForm";
import EditLessonFormContent from "@/components/course/lessons/EditLessonForm";

export default function EditLessonPage() {
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLessonName, setEditingLessonName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  // const handleLessonNameChange = async (lessonId: string, newName: string) => {
  //   try {
  //     const response = await fetch(`/api/course/${slug}/lesson/${lessonId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ name: newName }),
  //     });

  //     if (!response.ok) throw new Error("Failed to update lesson name");

  //     await mutate();
  //     setEditingLessonId(null);
  //     toastNotiSuccess("Cập nhật tên bài học thành công");
  //   } catch (error) {
  //     console.error(error);
  //     toastNotiFail("Cập nhật tên bài học thất bại");
  //   }
  // };

  // const handleContentChange = (index: number, newContent: ContentLesson) => {
  //   const updatedContent = [...lessonContent];
  //   updatedContent[index] = newContent;
  //   setLessonContent(updatedContent);
  // };

  // const handleAddIndexItem = () => {
  //   const newItem: IndexItemProps = {
  //     _id: Date.now().toString(), // Tạm thời dùng timestamp làm id
  //     nameItem: "",
  //   };
  //   setIndexItems([...indexItems, newItem]);
  // };

  // const handleRemoveIndexItem = (index: number) => {
  //   const newItems = [...indexItems];
  //   newItems.splice(index, 1);
  //   setIndexItems(newItems);
  // };

  // const handleIndexItemChange = (index: number, value: string) => {
  //   const newItems = [...indexItems];
  //   newItems[index] = {
  //     ...newItems[index],
  //     nameItem: value,
  //   };
  //   setIndexItems(newItems);
  // };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
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
