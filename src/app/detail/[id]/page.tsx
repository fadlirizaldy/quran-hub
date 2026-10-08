"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { getDetailSurah } from "@/utils/api";
import { IDataSurah } from "@/utils/api.interface";
import { useAyatRefs } from "@/context/AyatRefsContext";
import AudioPlayer from "@/components/AudioPlayer";
import AyatSection from "@/components/AyatSection";

const DetailSurahPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const ayat = searchParams.get("ayat");
  const { ayatRefs, handleScrollToItem } = useAyatRefs();

  const [data, setData] = useState<IDataSurah>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    window.scroll(0, 0);
  }, [pathname]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const detailSurah = await getDetailSurah(params.id);
        if (!detailSurah) {
          setError(true);
          return;
        }
        setData(detailSurah);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (ayat && data) {
      const ayatIndex = data.ayat.findIndex(
        (item) => item.nomorAyat === Number(ayat),
      );
      if (ayatIndex !== -1) {
        handleScrollToItem(ayatIndex);
      }
    }
  }, [ayat, data]);

  if (error) {
    return (
      <>
        <div className="w-full md:w-4/5 mx-auto">
          <h2
            className="text-white text-center mt-5 text-2xl cursor-pointer"
            onClick={() => router.push("/")}
          >
            <span className="font-bold">Quran</span>Hub
          </h2>
        </div>
        <h2 className="text-center mt-10">Ops! surat tidak ditemukan</h2>
      </>
    );
  }

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
                    data?.suratSebelumnya
                      ? `/detail/${data?.suratSebelumnya?.nomor}`
                      : "/",
                  )
                }
              >
                <Icon icon="ep:arrow-left" className="text-primary" />
                <span className="text-sm italic">
                  {data?.suratSebelumnya
                    ? `${data?.suratSebelumnya.nomor}. ${data?.suratSebelumnya.namaLatin}`
                    : "Home"}
                </span>
              </button>
              <button
                className="flex items-center gap-1"
                onClick={() =>
                  router.push(
                    data?.suratSelanjutnya
                      ? `/detail/${data?.suratSelanjutnya?.nomor}`
                      : "/",
                  )
                }
              >
                <span className="text-sm italic">
                  {data?.suratSelanjutnya
                    ? `${data?.suratSelanjutnya.nomor}. ${data?.suratSelanjutnya.namaLatin}`
                    : "Home"}
                </span>
                <Icon icon="ep:arrow-right" className="text-primary" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <h2 className="font-medium text-3xl font-amiri">{data?.nama}</h2>
              <div className="flex items-center gap-1">
                <p>{data?.nomor}.</p>
                <h2 className="text-lg">{data?.namaLatin}</h2>
                <span className="font-light italic">{`(${data?.arti})`}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center justify-center mt-1">
              <p className="p-1 bg-gray-100 text-xs rounded-md border border-secondary-gray text-secondary-gray">
                {data?.tempatTurun === "mekah" ? "Makiyyah" : "Madaniyah"}
              </p>
              <p className="text-secondary-gray">•</p>
              <p className="p-1 bg-gray-100 text-xs rounded-md border border-secondary-gray text-secondary-gray">
                {data?.jumlahAyat} Ayat
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mt-2">
              <div
                className="flex items-center cursor-pointer text-slate-500 hover:text-primary transition-all"
                onClick={() => router.push(`/detail/${params.id}/tafsir`)}
              >
                <Icon
                  icon="material-symbols-light:info-outline"
                  className="text-lg"
                />
                <p className="text-sm">Tafsir</p>
              </div>
              <p className="text-slate-500">|</p>
              <div className="flex items-center gap-2">
                <h5 className="text-slate-500 text-sm">Ayat</h5>
                <select
                  className="bg-gray-100 pl-1 py-1 border-b border-slate-300 w-14 text-slate-500 text-sm"
                  onChange={(e) => handleScrollToItem(Number(e.target.value))}
                >
                  {data?.ayat.map((item, index) => (
                    <option key={item.nomorAyat} value={index}>
                      {item.nomorAyat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-4">
            <h2 className="text-center text-3xl font-amiri">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </h2>

            <AudioPlayer data={data} />

            <AyatSection data={data} ayatRefs={ayatRefs} />
          </div>
        </>
      )}
    </div>
  );
};

export default DetailSurahPage;
