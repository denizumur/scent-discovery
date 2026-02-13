// Kelimelerin baş harfini büyütür ve tireleri kaldırır
export const formatName = (str: string) => {
  if (!str) return "";
  return str
    .split("-")                            // Tirelerden böl
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Baş harfleri büyüt
    .join(" ");                            // Boşlukla birleştir
};