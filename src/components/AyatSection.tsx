import React from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { useDataContext } from "@/context/DataArchivedContext";
import { IDataSurah } from "@/utils/api.interface";
import { toArabicNumber } from "@/utils/formatter";

const AyatSection = ({
  data,
  ayatRefs,
}: {
  data?: IDataSurah;
  ayatRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}) => {
  const { setData: setDataArchived } = useDataContext(); // Access data and setData from context

  return (
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
                  JSON.parse(localStorage.getItem("archived")!).nomor ===
                    data?.nomor &&
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
  );
};

export default AyatSection;
