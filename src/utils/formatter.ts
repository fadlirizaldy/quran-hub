export function toArabicNumber(text: string) {
  return text.replace(/\d/g, (d: any) => "٠١٢٣٤٥٦٧٨٩"[d]);
}
