"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";

import { getDetailSurah } from "@/utils/api";
import { IDataSurah } from "@/utils/api.interface";
import { toArabicNumber } from "@/utils/formatter";

const DetailSurahPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<IDataSurah>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const detailSurah = await getDetailSurah(params.id);
        setData(detailSurah);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="w-full md:w-4/5 mx-auto">
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
          </div>

          <div className="bg-white p-4">
            <h2 className="text-center text-3xl font-amiri">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </h2>

            <section className="flex flex-col gap-16 mt-10">
              {data?.ayat.map((item) => (
                <div className="" key={item.nomor}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative">
                      <img
                        src="../star-small.svg"
                        alt=""
                        className="min-w-10 w-10 h-10"
                      />
                      <h4 className="flex items-center text-lg absolute left-1/2 top-2 transform -translate-x-1/2">
                        {toArabicNumber(String(item.nomor))}
                      </h4>
                    </div>
                    <div className="text-end text-3xl font-medium font-amiri leading-loose">
                      {item.ar}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mt-2">{item.idn}</p>
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

export default DetailSurahPage;
