"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { IDataTafsir } from "@/utils/api.interface";
import { getDetailTafsir } from "@/utils/api";
import { toArabicNumber } from "@/utils/formatter";

const TafsirPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<IDataTafsir>();
  const [loading, setLoading] = useState(true);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const detailTafsir = await getDetailTafsir(params.id);
        setData(detailTafsir);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleScrollToItem = (index: number) => {
    if (itemRefs.current[index]) {
      itemRefs?.current[index]?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  return (
    <div>
      <h2
        className="text-white text-center mt-5 text-2xl cursor-pointer"
        onClick={() => router.push("/")}
      >
        <span className="font-bold">Quran</span>Hub
      </h2>

      {loading && data === undefined ? (
        <div className="w-full flex justify-center mt-10">
          <svg
            className="animate-spin h-7 w-7 mr-3 bg-secondary text-center"
            viewBox="0 0 24 24"
          ></svg>
        </div>
      ) : (
        <>
          <div className="p-3 pb-6 bg-gray-100 w-full mt-10 rounded-t-lg">
            <div className="flex justify-between items-center">
              <button
                className="flex items-center gap-1"
                onClick={() =>
                  router.push(
                    data?.surat_sebelumnya
                      ? `/detail/${data?.surat_sebelumnya?.nomor}`
                      : "/"
                  )
                }
              >
                <Icon icon="ep:arrow-left" className="text-primary" />
                <span className="text-sm italic">
                  {data?.surat_sebelumnya
                    ? data?.surat_sebelumnya.nama_latin
                    : "Home"}
                </span>
              </button>
              <button
                className="flex items-center gap-1"
                onClick={() =>
                  router.push(
                    data?.surat_selanjutnya
                      ? `/detail/${data?.surat_selanjutnya?.nomor}`
                      : "/"
                  )
                }
              >
                <span className="text-sm italic">
                  {data?.surat_selanjutnya
                    ? data?.surat_selanjutnya.nama_latin
                    : "Home"}
                </span>
                <Icon icon="ep:arrow-right" className="text-primary" />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <h2 className="font-medium text-3xl font-amiri">{data?.nama}</h2>
              <h2 className="text-lg mt-1">
                {data?.nama_latin}
                <span className="font-light italic">{`(${data?.arti})`}</span>
              </h2>
            </div>
            <div className="flex gap-2 items-center justify-center mt-1">
              <p className="p-1 bg-gray-100 text-xs rounded-md border border-secondary-gray text-secondary-gray">
                {data?.tempat_turun === "mekah" ? "Makiyyah" : "Madaniyah"}
              </p>
              <p className="text-secondary-gray">•</p>
              <p className="p-1 bg-gray-100 text-xs rounded-md border border-secondary-gray text-secondary-gray">
                {data?.jumlah_ayat} Ayat
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
              <div
                className="flex items-center gap-1 cursor-pointer text-slate-500 hover:text-primary transition-all"
                onClick={() => router.push(`/detail/${params.id}`)}
              >
                <Icon icon="ion:book-outline" />
                <p className="text-sm">Surah</p>
              </div>
              <p className="text-slate-500">|</p>
              <h5 className="text-slate-500 text-sm">Ayat</h5>
              <select
                className="bg-gray-100 pl-1 py-1 border-b border-slate-300 w-14 text-slate-500 text-sm"
                onChange={(e) => handleScrollToItem(Number(e.target.value))}
              >
                {data?.tafsir.map((item, index) => (
                  <option key={item.ayat} value={index}>
                    {item.ayat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white p-4">
            <h2 className="text-center text-3xl font-amiri">Tafsir</h2>
            <p
              className="text-center text-lg font-amiri"
              dangerouslySetInnerHTML={{ __html: data?.deskripsi! }}
            ></p>

            <section className="flex flex-col gap-16 mt-10">
              {data?.tafsir.map((item, index) => (
                <div
                  className="scroll-mt-10"
                  key={item.ayat}
                  ref={(el: never) =>
                    (itemRefs.current[index] = el) as unknown as never
                  }
                >
                  <div className="flex justify-between gap-4">
                    <div className="relative">
                      <img
                        src="/star-small.svg"
                        alt=""
                        className="min-w-10 w-10 h-10"
                      />
                      <h4 className="flex items-center text-lg absolute left-1/2 top-2 transform -translate-x-1/2">
                        {toArabicNumber(String(item.ayat))}
                      </h4>
                    </div>
                    <div className="text-sm text-slate-500">{item.tafsir}</div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default TafsirPage;
