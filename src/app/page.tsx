"use client";

import { Icon } from "@iconify/react";
import MainLayout from "@/components/MainLayout";
import { getAllSurah } from "@/utils/api";
import { useEffect, useState } from "react";
import { IDataSurah } from "@/utils/api.interface";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<IDataSurah[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const allSurahs = await getAllSurah();
        setData(allSurahs);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearchChange = (event: any) => {
    setSearchText(event.target.value);
  };

  return (
    <MainLayout>
      <h2 className="text-white text-center mt-5 text-2xl">
        <span className="font-bold">Quran</span>Hub
      </h2>

      <div className="w-full flex flex-col items-center mt-8">
        <div className="relative w-10/12 sm:w-1/2">
          <input
            type="text"
            placeholder="Search surah.."
            className="py-2 pl-3 pr-8 rounded-2xl w-full focus:outline-primary"
            value={searchText}
            onChange={handleSearchChange}
          />
          <Icon
            icon="material-symbols:search"
            className="absolute top-2 right-2 text-primary text-2xl"
          />
        </div>

        <div className="mt-3 w-10/12 sm:w-1/2 flex items-center gap-3 flex-wrap justify-center">
          <div
            className="cursor-pointer hover:shadow-md bg-tertiary rounded-3xl py-2 px-3 text-txt-yellow font-medium"
            onClick={() => router.push(`/detail/${18}`)}
          >
            Alkahfi
          </div>
          <div
            className="cursor-pointer hover:shadow-md bg-tertiary rounded-3xl py-2 px-3 text-txt-yellow font-medium"
            onClick={() => router.push(`/detail/${56}`)}
          >
            Alwaqiah
          </div>
          <div
            className="cursor-pointer hover:shadow-md bg-tertiary rounded-3xl py-2 px-3 text-txt-yellow font-medium"
            onClick={() => router.push(`/detail/${36}`)}
          >
            Yaseen
          </div>
          <div
            className="cursor-pointer hover:shadow-md bg-tertiary rounded-3xl py-2 px-3 text-txt-yellow font-medium"
            onClick={() => router.push(`/detail/${2}`)}
          >
            Albaqarah
          </div>
          <div
            className="cursor-pointer hover:shadow-md bg-tertiary rounded-3xl py-2 px-3 text-txt-yellow font-medium"
            onClick={() => router.push(`/detail/${50}`)}
          >
            Qaf
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-4 px-4">
        {loading ? (
          <div className="w-full flex justify-center mt-5">
            <svg
              className="animate-spin h-5 w-5 mr-3 bg-secondary text-center"
              viewBox="0 0 24 24"
            ></svg>
          </div>
        ) : (
          data
            ?.filter((item) =>
              item.nama_latin.toLowerCase().includes(searchText.trim())
            )
            .map((item) => (
              <div
                className="py-3 pl-3 pr-4 shadow-md cursor-pointer rounded-md bg-white flex items-center justify-between gap-3"
                onClick={() => {
                  router.push(`/detail/${item.nomor}`);
                }}
                key={item.nomor}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="star-small.svg"
                      alt=""
                      className="min-w-10 w-10 h-10"
                    />
                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      {item.nomor}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm">
                      {item.nama_latin}{" "}
                      <span className="text-secondary-text italic">{`(${item.arti})`}</span>
                    </h3>
                    <div className="flex gap-2 items-center">
                      <p className="p-1 text-xs rounded-md bg-primary-gray text-secondary-gray">
                        {item.tempat_turun === "mekah"
                          ? "Makiyyah"
                          : "Madaniyah"}
                      </p>
                      <p className="text-secondary-gray">•</p>
                      <p className="p-1 text-xs rounded-md bg-primary-gray text-secondary-gray">
                        {item.jumlah_ayat} Ayat
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xl font-amiri">{item.nama}</p>
              </div>
            ))
        )}
      </div>
    </MainLayout>
  );
}
