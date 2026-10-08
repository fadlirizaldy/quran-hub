import type { IApiResponse, IDataSurah, IDataTafsir } from "./api.interface";

const BASE_URL = "https://equran.id/api/v2";
export async function getAllSurah(): Promise<IDataSurah[]> {
  const res: Response = await fetch(`${BASE_URL}/surat`, {
    next: { revalidate: 10 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: IApiResponse<IDataSurah[]> = await res.json();
  return data.data;
}

export async function getDetailSurah(id: string): Promise<IDataSurah> {
  const res: Response = await fetch(`${BASE_URL}/surat/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: IApiResponse<IDataSurah> = await res.json();
  return data.data;
}

export async function getDetailTafsir(id: string): Promise<IDataTafsir> {
  const res: Response = await fetch(`${BASE_URL}/tafsir/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: IApiResponse<IDataTafsir> = await res.json();
  return data.data;
}
