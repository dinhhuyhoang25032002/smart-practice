import { SyntheticEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { ArrowRightIcon, ZoomIn, ZoomOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { fetchPrivateData } from "@/utils/fetcher/fetch-api";

import { HttpStatus } from "@/constant/constant";

import Image from "next/image";
import { toast } from "sonner";
import { KeyedMutator } from "swr";

export type ImgInfo = {
  name: string;
  type: string;
  size: number;
  src: string | ArrayBuffer | null;
};
interface UniversalUploadProps {
  endpoint: string; // endpoint để upload
  extraFields?: Record<string, any>; // các trường bổ sung
  title?: string;
  mutate?: KeyedMutator<any>;
}

export default function UploadFile({
  endpoint,
  extraFields,
  mutate,
  title,
}: UniversalUploadProps) {
  const [imgInfor, setImgInfo] = useState<ImgInfo>();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [isName, setName] = useState("");
  const [url, setUrl] = useState("");
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

    if (!file) {
      toast.error("Vui lòng chọn tệp tin trước khi gửi!");
      return;
    }
    // if (!isName) {
    //   toastNotiFail("Vui lòng nhập tên mục cần cập nhật trước khi gửi!");
    //   return;
    // }
    // if (!isMode) {
    //   toastNotiFail("Vui lòng chọn loại sản phẩm cần cập nhật trước khi gửi!");
    //   return;
    // }
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      let fields: Record<string, any> = {};
      if (typeof extraFields === "object" && extraFields) fields = extraFields;
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
      formData.append("file", file);

      const res = await fetchPrivateData(endpoint, {
        body: formData,
        method: "POST",
      });

      if (res?.status === HttpStatus.OK) {
        toast.success(res.message);
        mutate?.();
        setUrl(res.url);
        setFile(undefined);
        setImgInfo(undefined);
        setPreviewUrl(undefined);
        return;
      }

      toast.error(res?.message);
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
        <div className="group relative h-48 w-full overflow-hidden rounded-lg border border-gray-200">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="cursor-pointer object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
            onClick={() => setIsPreviewOpen(true)}
          />
          <div className="absolute right-2 bottom-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
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
        <div className="h-48 w-full overflow-hidden rounded-lg border border-gray-200">
          <iframe
            src={previewUrl}
            className="h-full w-full"
            title="PDF Preview"
          />
        </div>
      );
    }

    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
        <p className="text-gray-500">Không thể xem trước file này</p>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col items-center justify-center space-y-6 rounded-lg bg-white p-6 shadow-lg"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-600">
            Tải lên hình ảnh của nội dung bài học để cập nhật.
          </p>
        </div>
      
        <div
          {...getRootProps()}
          className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <input className="hidden" {...getInputProps()} />
          <IoCloudUploadOutline className="mb-2 text-4xl text-gray-400" />
          {isDragActive ? (
            <p className="font-medium text-blue-500">Thả tập tin tại đây...</p>
          ) : (
            <div className="text-center">
              <p className="font-medium text-gray-600">
                Kéo thả hoặc nhấp để tải lên
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (Tối đa 5MB)
              </p>
            </div>
          )}
        </div>

        {imgInfor && (
          <div className="w-full space-y-4">
            {renderPreview()}

            <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
              <Button
                onClick={handleDeleteImg}
                type="button"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-100"
              >
                <IoMdClose className="text-gray-600" />
              </Button>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Tên tệp:</span>
                  <span className="max-w-[70%] truncate text-gray-600">
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
          className="w-full bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <span className="flex items-center justify-center gap-2">
            {isSubmitting ? "Đang tải..." : "Tải lên"}
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </Button>
      </form>

      {/* Fullscreen Preview Modal */}
      {isPreviewOpen && previewUrl && file?.type.startsWith("image/") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative h-full max-h-[90vh] w-full max-w-5xl">
            <Button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 z-10 rounded-full bg-white shadow-lg hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-600" />
            </Button>
            <div className="absolute right-4 bottom-4 z-10 flex gap-2">
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
            <div className="flex h-full w-full items-center justify-center">
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
