import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { IVisible } from "./SideContent";
import { useDataContext } from "@/context/DataArchivedContext";
import { toast } from "react-toastify";

export interface IArchivedSurah {
  nomor: number;
  ayat: number;
  nama_latin: string;
}

interface IFrameSolatProps {
  isVisible: IVisible;
  setIsVisible: React.Dispatch<React.SetStateAction<IVisible>>;
}

const RecentRead = ({ isVisible, setIsVisible }: IFrameSolatProps) => {
  const router = useRouter();

  const { data, setData } = useDataContext(); // Access data and setData from context
  const [width, setWidth] = useState(1000);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, [containerRef.current, data]);

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
        left: isVisible.archived ? 0 : `-${width}px`,
      }}
    >
      <div
        ref={containerRef}
        className="bg-secondary flex justify-center items-center gap-1 ps-2 pr-1 cursor-pointer w-fit"
        onClick={() => {
          setIsVisible(() => ({
            archived: false,
            solatSchedule: false,
          }));
          if (data && (data?.nomor >= 1 || data?.nomor <= 114)) {
            router.push(`/detail/${data?.nomor}?ayat=${data?.ayat}`);
          } else {
            toast.info("Surat tidak ditemukan");
            router.push("/");
          }
        }}
      >
        <h3 className="text-sm">Lanjutkan</h3>
        <p className="text-sm font-semibold">
          {data?.nama_latin} : {data?.ayat}
        </p>
      </div>
      <div
        className="w-10 h-10 bg-secondary cursor-pointer rounded-r-lg flex justify-center items-center"
        onClick={() =>
          setIsVisible((prev) => ({
            archived: !prev.archived,
            solatSchedule: false,
          }))
        }
      >
        <Icon icon="material-symbols:book" className="text-white text-2xl" />
      </div>
    </div>
  );
};

export default RecentRead;
