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
  const [hasStartedAudio, setHasStartedAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
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

  useEffect(() => {
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateCurrentTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateCurrentTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio]);

  const handlePlaySound = async (url: string) => {
    const currentAudio = audio?.src === url ? audio : new Audio(url);
    if (currentAudio !== audio) {
      currentAudio.volume = volume;
      setCurrentTime(0);
      setDuration(0);
      setAudio(currentAudio);
    }

    if (!currentAudio.paused) {
      currentAudio.pause();
      return;
    }

    try {
      if (
        currentAudio.duration > 0 &&
        currentAudio.currentTime >= currentAudio.duration
      ) {
        currentAudio.currentTime = 0;
      }
      await currentAudio.play();
      setHasStartedAudio(true);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      toast.error("Unable to play audio. Please try again.");
    }
  };

  const handleSeek = (time: number) => {
    if (!audio || !Number.isFinite(duration)) return;
    audio.currentTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(audio.currentTime);
  };

  const handleVolumeChange = (nextVolume: number) => {
    setVolume(nextVolume);
    if (audio) audio.volume = nextVolume;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
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

            {!hasStartedAudio ? (
              <button
                type="button"
                className="mt-6 flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!data?.audioFull["01"]}
                onClick={() => {
                  const url = data?.audioFull["01"];
                  if (url) void handlePlaySound(url);
                }}
              >
                <Icon icon="bi:play-fill" className="text-primary text-lg" />
                Play Surah
              </button>
            ) : (
              <div className="mt-10 rounded-lg bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-full border border-slate-300 p-2 text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Go back 10 seconds"
                      disabled={!audio || duration === 0}
                      onClick={() => handleSeek(currentTime - 10)}
                    >
                      <Icon icon="ic:round-replay-10" className="text-xl" />
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-slate-300 p-2 text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={isPlaying ? "Pause surah" : "Play surah"}
                      disabled={!data?.audioFull["01"]}
                      onClick={() => {
                        const url = data?.audioFull["01"];
                        if (url) void handlePlaySound(url);
                      }}
                    >
                      <Icon
                        icon={isPlaying ? "bi:pause-fill" : "bi:play-fill"}
                        className="text-primary text-sm"
                      />
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-slate-300 p-2 text-primary transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Skip forward 10 seconds"
                      disabled={!audio || duration === 0}
                      onClick={() => handleSeek(currentTime + 10)}
                    >
                      <Icon icon="ic:round-forward-10" className="text-xl" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Icon
                      icon={
                        volume === 0
                          ? "material-symbols:volume-off"
                          : volume < 0.5
                            ? "material-symbols:volume-down"
                            : "material-symbols:volume-up"
                      }
                      className="text-lg text-slate-500"
                      onClick={() => handleVolumeChange(volume === 0 ? 0.5 : 0)}
                    />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      aria-label="Audio volume"
                      onChange={(event) =>
                        handleVolumeChange(Number(event.target.value))
                      }
                      className="h-1 w-24 cursor-pointer accent-primary"
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="min-w-9 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={1}
                    value={Math.min(currentTime, duration || 0)}
                    aria-label="Seek through surah audio"
                    disabled={!audio || duration === 0}
                    onChange={(event) => handleSeek(Number(event.target.value))}
                    className="h-1 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
                  />
                  <span className="min-w-9">{formatTime(duration)}</span>
                </div>
              </div>
            )}

            <section className="flex flex-col gap-16 mt-7">
              {data?.ayat.map((item, index) => (
                <div
                  key={item.nomorAyat}
                  ref={(el: never) =>
                    (ayatRefs.current[index] = el) as unknown as never
                  }
                  className="scroll-mt-10"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <Icon
                        icon="stash:save-ribbon-duotone"
                        className={`text-lg cursor-pointer opacity-60 hover:opacity-100 transition-all ${
                          localStorage.getItem("archived") &&
                          JSON.parse(localStorage.getItem("archived")!)
                            .nomor === data?.nomor &&
                          JSON.parse(localStorage.getItem("archived")!).ayat ===
                            item.nomorAyat
                            ? "text-primary"
                            : "text-slate-300"
                        }`}
                        onClick={() => {
                          localStorage.setItem(
                            "archived",
                            JSON.stringify({
                              nomor: data.nomor,
                              namaLatin: data.namaLatin,
                              ayat: item.nomorAyat,
                            }),
                          );

                          toast.info(
                            `Surah ${data.namaLatin} ayat ${item.nomorAyat} tersimpan`,
                            { autoClose: 2000 },
                          );
                          setDataArchived({
                            nomor: data.nomor,
                            namaLatin: data.namaLatin,
                            ayat: item.nomorAyat,
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
                          {toArabicNumber(String(item.nomorAyat))}
                        </h4>
                      </div>
                      <div className="text-end text-3xl font-medium font-amiri leading-[2.2]">
                        {item.teksArab}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mt-2">
                      {item.nomorAyat}. {item.teksIndonesia}
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
