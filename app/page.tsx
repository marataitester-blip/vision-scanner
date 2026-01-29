"use client";

import React, { useState } from 'react';
import { Camera, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function VisionScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // 1. Сжатие фото
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        setImage(base64data);

        // 2. Отправка на наш API
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64data, location: "Минск, Беларусь" })
        });

        const analysis = await res.json();
        setResult(analysis);
        setLoading(false);

        // 3. Авто-озвучка результата (базовая)
        if (analysis.verdict) {
          const speech = new SpeechSynthesisUtterance(analysis.verdict);
          speech.lang = 'ru-RU';
          window.speechSynthesis.speak(speech);
        }
      };
    } catch (error) {
      alert("Ошибка при обработке фото");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center p-6 font-sans">
      <header className="w-full max-w-md py-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-600 bg-clip-text text-transparent">
          VISION
        </h1>
        <p className="text-zinc-500 text-xs mt-3 uppercase tracking-[0.3em]">AI Luxury Assistant</p>
      </header>

      <main className="flex-1 w-full max-w-md flex flex-col items-center gap-6">
        {!image ? (
          <label className="w-full aspect-[3/4] flex flex-col items-center justify-center border border-zinc-800 rounded-[40px] bg-zinc-900/20 cursor-pointer hover:bg-zinc-900/40 transition-all">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <Camera className="w-8 h-8 text-black" />
            </div>
            <span className="mt-6 text-sm text-zinc-400 font-medium">СКАНИРОВАТЬ ОБЪЕКТ</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
          </label>
        ) : (
          <div className="w-full flex flex-col gap-4 animate-in fade-in duration-700">
            <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl">
              <img src={image} className="w-full h-full object-cover" alt="Preview" />
              {loading && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 animate-spin text-white mb-4" />
                  <p className="text-sm tracking-widest animate-pulse">АНАЛИЗ ЭКСПЕРТОМ...</p>
                </div>
              )}
            </div>

            {result && !loading && (
              <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-[32px] backdrop-blur-xl shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold leading-tight">{result.name}</h2>
                    <p className="text-zinc-500 text-sm">{result.country} • Рейтинг: {result.rating}/10</p>
                  </div>
                </div>
                <div className="h-px bg-zinc-800 my-4" />
                <p className="text-zinc-300 text-base leading-relaxed mb-6 italic">"{result.description}"</p>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-white font-semibold text-sm mb-1 uppercase tracking-tighter">Вердикт:</p>
                  <p className="text-zinc-400 text-sm leading-snug">{result.verdict}</p>
                </div>
                <button 
                  onClick={() => {setImage(null); setResult(null);}}
                  className="mt-8 w-full py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> ЕЩЕ РАЗ
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
