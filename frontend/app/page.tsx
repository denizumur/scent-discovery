// frontend/app/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import HeroCard from "@/components/HeroCard";

export default function Home() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (id: number) => {
    setLoading(true);
    setRecommendation(null); // Önceki sonucu temizle
    try {
      // Backend'e ID'yi gönderiyoruz
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await axios.get(`${apiUrl}/recommend/${id}`);
      setRecommendation(res.data);
    } catch (error) {
      console.error("Öneri hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-24 px-4 overflow-x-hidden">
      {/* Başlık Alanı */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 tracking-tight">
          Scent Discovery
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto font-light">
          AI-powered engine to find your next signature scent based on the molecular DNA of perfumes you already love.
        </p>
      </div>

      {/* Arama Kutusu */}
      <SearchBar onSelect={handleSelect} />

      {/* Sonuç Alanı */}
      <HeroCard data={recommendation} loading={loading} />
      
      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-gray-600 text-sm">
        Powered by TF-IDF Vectorization & Cosine Similarity
      </footer>
    </main>
  );
}