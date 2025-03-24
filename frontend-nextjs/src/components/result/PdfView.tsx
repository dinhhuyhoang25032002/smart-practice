"use client";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import { useState } from "react";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
type PdfViewProps = {
  url: string | undefined;
};

export default function PdfView({ url }: PdfViewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
    }
  };
  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };
  return (
    <div className=" flex flex-col justify-center items-center border-2 border-gray-300 shadow rounded-md p-5 space-y-5">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="h-screen w-[500px] flex items-center justify-center">
            Loading PDF...
          </div>
        }
      >
        <Page pageNumber={pageNumber} scale={1.15} />
      </Document>
      <div className="flex gap-3 items-center">
        <Button className=" h-8 w-8" onClick={prevPage}>
          <GrFormPrevious />
        </Button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <Button className="h-8 w-8" onClick={nextPage}>
          <GrFormNext />
        </Button>
      </div>
    </div>
  );
}
