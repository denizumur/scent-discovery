// frontend/utils/imageMapper.ts

// Unsplash'ten elle seçilmiş, garantili kaliteli fotoğraflar
const VIBE_IMAGES: Record<string, string> = {
  "Fresh 🍋": "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop", // Fresh/Su/Narenciye
  "Woody 🌲": "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=1000&auto=format&fit=crop", // Orman/Ağaç
  "Sexy 🔥": "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop", // Gece/Neon/Deri
  "Elegant 🌸": "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?q=80&w=1000&auto=format&fit=crop", // Çiçekler
  "Bold 🌶️": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop", // Baharat/Karanlık
  "default": "https://images.unsplash.com/photo-1595425279610-d0186715f629?q=80&w=1000&auto=format&fit=crop" // Lüks Şişe (Yedek)
};

export const getPerfumeImage = (vibes: string[]) => {
  if (!vibes || vibes.length === 0) return VIBE_IMAGES["default"];

  // İlk Vibe'a göre resmi seç (Fresh ise Fresh resmi)
  const mainVibe = vibes[0];
  return VIBE_IMAGES[mainVibe] || VIBE_IMAGES["default"];
};