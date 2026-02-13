// frontend/components/SearchBar.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSelect: (id: number) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        // Backend'e istek atıyoruz
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await axios.get(`${apiUrl}/search?q=${query}`);
        setResults(res.data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Arama hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    // Kullanıcı yazarken sürekli istek gitmesin diye 300ms bekletiyoruz (Debounce)
    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative w-full max-w-xl mx-auto z-50">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a perfume you love (e.g. Aventus)..."
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-lg text-lg"
          onFocus={() => setShowDropdown(true)}
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto"
          >
            {results.map((perfume) => (
              <li
                key={perfume.id}
                onClick={() => {
                  onSelect(perfume.id);
                  setQuery(perfume.full_name);
                  setShowDropdown(false);
                }}
                className="px-6 py-3 hover:bg-purple-600/30 cursor-pointer transition-colors border-b border-white/5 last:border-none group"
              >
                <div className="font-medium text-white group-hover:text-purple-200 transition-colors">
                  {perfume.name}
                </div>
                <div className="text-sm text-gray-400">{perfume.brand}</div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}