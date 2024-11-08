import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export interface IArchivedSurah {
  nomor: number;
  nama_latin: string;
}

const RecentRead = () => {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState<IArchivedSurah | undefined>();
  const [width, setWidth] = useState(1000);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef.current]);

  useEffect(() => {
    // Check if 'archived' data exists in localStorage and parse it if available
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("archived");

      if (storedData) {
        try {
          setData(JSON.parse(storedData));
        } catch (error) {
          console.error("Failed to parse archived data:", error);
        }
      }
    }
  }, []);

  return (
    <div
      className={`fixed top-1/3 z-[60] flex transition-all duration-500 `}
      style={{
        left: isVisible ? 0 : `-${width}px`,
      }}
    >
      <div
        ref={containerRef}
        className="bg-secondary flex justify-center items-center gap-1 ps-2 pr-1 cursor-pointer w-fit"
        onClick={() => {
          setIsVisible(false);
          router.push(`/detail/${data?.nomor}`);
        }}
      >
        <h3 className="text-sm">Lanjutkan</h3>
        <p className="text-sm font-semibold">{data?.nama_latin}</p>
      </div>
      <div
        className="w-10 h-10 bg-secondary cursor-pointer rounded-r-lg flex justify-center items-center"
        onClick={() => setIsVisible((prev) => !prev)}
      >
        <Icon icon="material-symbols:book" className="text-white text-2xl" />
      </div>
    </div>
  );
};

export default RecentRead;
