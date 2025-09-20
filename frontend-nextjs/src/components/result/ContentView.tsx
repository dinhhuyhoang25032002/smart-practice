"use client";

type PdfViewProps = {
  url: string | undefined;
};

export default function ContentView({ url }: PdfViewProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center border-2 border-gray-300 bg-amber-300 shadow">
      {url && <iframe src={url} className="h-full w-full" />}
    </div>
  );
}
