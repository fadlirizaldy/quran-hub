import { IDataSurah } from "./api.interface";

const BASE_URL = "https://equran.id/api";
export async function getAllSurah(): Promise<IDataSurah[]> {
  const res = await fetch(`${BASE_URL}/surat`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getDetailSurah(id: string): Promise<IDataSurah> {
  const res = await fetch(`${BASE_URL}/surat/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
