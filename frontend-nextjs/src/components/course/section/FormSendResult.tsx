import { SyntheticEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { ArrowRightIcon, ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

export type ImgInfo = {
  name: string;
  type: string;
  size: number;
  src: string | ArrayBuffer | null;
};

export default function FormSendResult() {
  const [imgInfor, setImgInfo] = useState<ImgInfo>();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const id = useSearchParams().get("id");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImgInfo({
        name: file.name,
        type: file.type,
        size: Math.round(file.size / 1024),
        src: reader.result as string,
      });
      setPreviewUrl(URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setZoomLevel(1);
  };

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault();

    if (!file || !id) {
      toast.error("Vui lòng chọn tệp tin trước khi gửi!");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("lessonId", id);

      const res = await fetchPrivateData("result", {
        body: formData,
        method: "POST",
      });

      if (res.status === 400 || res.status === 403) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      setFile(undefined);
      setImgInfo(undefined);
      setPreviewUrl(undefined);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi gửi bài tập!");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDeleteImg = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(undefined);
    setImgInfo(undefined);
    setPreviewUrl(undefined);
    setZoomLevel(1);
  };

  const renderPreview = () => {
    if (!previewUrl || !file) return null;

    if (file.type.startsWith("image/")) {
      return (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 group">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-contain cursor-pointer transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
            onClick={() => setIsPreviewOpen(true)}
          />
          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (file.type === "application/pdf") {
      return (
        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
          <iframe
            src={previewUrl}
            className="w-full h-full"
            title="PDF Preview"
          />
        </div>
      );
    }

    return (
      <div className="w-full h-48 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Không thể xem trước file này</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="flex flex-col w-full bg-white items-center justify-center space-y-6 p-6 rounded-lg shadow-lg"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">Nộp bài tập</h2>
          <p className="text-sm text-gray-600">
            Tải lên bài tập của bạn để được đánh giá
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`w-full h-40 flex flex-col justify-center items-center rounded-lg border-2 border-dashed transition-colors cursor-pointer
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
        >
          <input className="hidden" {...getInputProps()} />
          <IoCloudUploadOutline className="text-4xl text-gray-400 mb-2" />
          {isDragActive ? (
            <p className="text-blue-500 font-medium">Thả tập tin tại đây...</p>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 font-medium">
                Kéo thả hoặc nhấp để tải lên
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (Tối đa 5MB)
              </p>
            </div>
          )}
        </div>

        {imgInfor && (
          <div className="w-full space-y-4">
            {renderPreview()}

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
              <Button
                onClick={handleDeleteImg}
                type="button"
                className="absolute top-2 right-2 w-8 h-8 bg-white hover:bg-gray-100 rounded-full shadow-sm"
              >
                <IoMdClose className="text-gray-600" />
              </Button>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Tên tệp:</span>
                  <span className="text-gray-600 truncate max-w-[70%]">
                    {imgInfor.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Kích thước:</span>
                  <span className="text-gray-600">{imgInfor.size} KB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Định dạng:</span>
                  <span className="text-gray-600">{imgInfor.type}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !file}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            {isSubmitting ? "Đang gửi..." : "Nộp bài tập"}
            <ArrowRightIcon className="w-4 h-4" />
          </span>
        </Button>
      </form>

      {/* Fullscreen Preview Modal */}
      {isPreviewOpen && previewUrl && file?.type.startsWith("image/") && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]">
            <Button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-100 rounded-full shadow-lg"
            >
              <X className="h-6 w-6 text-gray-600" />
            </Button>
            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
              <Button
                onClick={handleZoomIn}
                variant="secondary"
                className="bg-white hover:bg-gray-100"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleZoomOut}
                variant="secondary"
                className="bg-white hover:bg-gray-100"
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={previewUrl}
                alt="Full Preview"
                fill
                className="object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
