"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { toast } from "react-toastify";

import { getDetailSurah } from "@/utils/api";
import { IDataSurah } from "@/utils/api.interface";
import { toArabicNumber } from "@/utils/formatter";
import { useDataContext } from "@/context/DataArchivedContext";
import { useAyatRefs } from "@/context/AyatRefsContext";

const DetailSurahPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const ayat = searchParams.get("ayat");
  const { ayatRefs, handleScrollToItem } = useAyatRefs();

  const { setData: setDataArchived } = useDataContext(); // Access data and setData from context

  const [data, setData] = useState<IDataSurah>();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
        (item) => item.nomor === Number(ayat)
      );
      if (ayatIndex !== -1) {
        handleScrollToItem(ayatIndex);
      }
    }
  }, [ayat, data]);

  const handlePlaySound = (url: string) => {
    if (audio && isPlaying) {
      setIsPlaying(false);
      audio.pause();
      return;
    } else if (audio && !isPlaying) {
      setIsPlaying(true);
      audio.play();
      return;
    }
    const newAudio = new Audio(url);
    newAudio.play();
    setAudio(newAudio);
    setIsPlaying(true);

    newAudio.onended = () => {
      setIsPlaying(false);
    };
  };

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
                    <option key={item.nomor} value={index}>
                      {item.nomor}
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

            <div className="flex items-center gap-1 mt-4">
              <div
                className="p-1 rounded-full border border-slate-300 cursor-pointer"
                onClick={() => handlePlaySound(data?.audio!)}
              >
                <Icon
                  icon={isPlaying ? "bi:pause-fill" : "bi:play-fill"}
                  className="text-primary text-sm"
                />
              </div>
              <p className="text-sm text-slate-500">Play Surah</p>
            </div>

            <section className="flex flex-col gap-16 mt-7">
              {data?.ayat.map((item, index) => (
                <div
                  key={item.nomor}
                  ref={(el: never) =>
                    (ayatRefs.current[index] = el) as unknown as never
                  }
                  className="scroll-mt-10"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <Icon
                        icon="stash:save-ribbon-duotone"
                        className="text-lg text-slate-300 cursor-pointer opacity-60 hover:opacity-100 transition-all"
                        onClick={() => {
                          localStorage.setItem(
                            "archived",
                            JSON.stringify({
                              nomor: data.nomor,
                              nama_latin: data.nama_latin,
                              ayat: item.nomor,
                            })
                          );

                          toast.info(
                            `Surah ${data.nama_latin} ayat ${item.nomor} tersimpan`,
                            { autoClose: 2000 }
                          );
                          setDataArchived({
                            nomor: data.nomor,
                            nama_latin: data.nama_latin,
                            ayat: item.nomor,
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4">
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
                  </div>
                  <div>
                    <p className="text-sm mt-2">
                      {item.nomor}. {item.idn}
                    </p>
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
