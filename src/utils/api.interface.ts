export interface IApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface IDataSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audio: string;
  audioFull: Record<string, string>;
  status: boolean;
  ayat: Ayat[];
  suratSelanjutnya: INextPrevSurah;
  suratSebelumnya: INextPrevSurah;
}

export interface IDataTafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  tafsir: Tafsir[];
  suratSelanjutnya: INextPrevSurah;
  suratSebelumnya: INextPrevSurah;
}

export interface Ayat {
  id: number;
  surah: number;
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface Tafsir {
  ayat: number;
  teks: string;
}

export interface INextPrevSurah {
  id: number;
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}
