export interface IDataSurah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
  status: boolean;
  ayat: Ayat[];
  surat_selanjutnya: INextPrevSurah;
  surat_sebelumnya: INextPrevSurah;
}

export interface IDataTafsir {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audioFull: string;
  tafsir: Tafsir[];
  surat_selanjutnya: INextPrevSurah;
  surat_sebelumnya: INextPrevSurah;
}

export interface Ayat {
  id: number;
  surah: number;
  nomor: number;
  ar: string;
  tr: string;
  idn: string;
}

export interface Tafsir {
  id: number;
  surah: number;
  ayat: number;
  tafsir: string;
}

export interface INextPrevSurah {
  id: number;
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}
