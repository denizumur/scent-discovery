// frontend/components/HeroCard.tsx
"use client";

import { motion } from "framer-motion";
import { Star, Sparkles, Wind, ArrowRight } from "lucide-react";

// Yardımcı: İsim Düzeltme
const formatName = (str: string) => {
  if (!str) return "";
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Vibe'a göre renk seçici (Görsel yerine renk kullanacağız)
const getGradient = (vibes: string[]) => {
  const v = vibes[0] || "";
  if (v.includes("Fresh")) return "from-blue-400 to-cyan-300";
  if (v.includes("Sexy")) return "from-red-500 to-rose-400";
  if (v.includes("Woody")) return "from-emerald-600 to-green-400";
  if (v.includes("Elegant")) return "from-pink-400 to-purple-400";
  return "from-purple-500 to-indigo-500"; // Default
};

export default function HeroCard({ data, loading }: { data: any; loading: boolean }) {
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12 h-96 bg-white/5 animate-pulse rounded-3xl border border-white/10" />
    );
  }

  if (!data) return null;

  const { hero, alternatives } = data;
  const gradientColor = getGradient(hero.vibes);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-4 pb-20">
      
      {/* --- HERO SECTION --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl overflow-hidden"
      >
        {/* Arka plan renkli parlaması */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${gradientColor} opacity-20 blur-[100px] rounded-full pointer-events-none`} />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          
          {/* SOL: Bilgiler */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Top Choice
            </div>
            
            <div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-2 tracking-tight">
                {formatName(hero.name)}
              </h2>
              <p className="text-xl text-gray-400 font-medium tracking-wide">
                {formatName(hero.brand)}
              </p>
            </div>

            {/* Vibes (Etiketler) */}
            <div className="flex flex-wrap gap-2">
              {hero.vibes.map((vibe: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm"
                >
                  {vibe}
                </span>
              ))}
            </div>

            <div className="bg-black/20 rounded-xl border border-white/5 p-5">
              <p className="text-gray-300 italic text-lg mb-4">"{hero.description}"</p>
              <div className="flex items-center gap-6 text-sm">
                 <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                    <Star className="w-4 h-4 fill-yellow-400" /> {hero.rating}/5
                 </div>
                 <div className="w-px h-4 bg-white/20" />
                 <div className="flex items-center gap-1.5 text-green-400 font-bold">
                    <Wind className="w-4 h-4" /> {hero.match_score}% Match
                 </div>
              </div>
            </div>
            
            <a 
              href={hero.url} 
              target="_blank" 
              className="inline-flex items-center gap-2 text-white hover:text-purple-400 transition-colors border-b border-transparent hover:border-purple-400 pb-0.5 text-sm font-medium"
            >
              View Details on Fragrantica <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* SAĞ: Görsel Yerine Minimalist Kart */}
          <div className={`w-full md:w-64 h-64 rounded-3xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg relative overflow-hidden group`}>
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
             <span className="text-7xl drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">
               🧴
             </span>
             <div className="absolute bottom-4 text-white/80 font-mono text-xs uppercase tracking-widest">
               {hero.vibes[0]?.split(' ')[0]} vibe
             </div>
          </div>

        </div>
      </motion.div>

      {/* --- ALTERNATIVES --- */}
      <div className="mt-16">
        <h3 className="text-xl font-bold text-white mb-6 pl-1 border-l-4 border-purple-500 pl-4">
          Similar Vibes
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {alternatives.map((alt: any, idx: number) => (
            <motion.div
              key={alt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 hover:bg-white/5 hover:border-purple-500/30 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGradient(alt.vibes)} flex items-center justify-center text-lg shadow-inner`}>
                   💧
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-500/20">
                  {alt.match_score}%
                </span>
              </div>
              
              <h4 className="text-base font-bold text-white group-hover:text-purple-300 truncate">
                {formatName(alt.name)}
              </h4>
              <p className="text-xs text-gray-500 mb-3">{formatName(alt.brand)}</p>
              
              <div className="flex flex-wrap gap-1.5">
                {alt.vibes.slice(0, 2).map((vibe: string, i: number) => (
                  <span key={i} className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    {vibe.split(' ')[0]}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}