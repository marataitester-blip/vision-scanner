"use client";

import React, { useState } from 'react';
import { Camera, Loader2, Sparkles } from 'lucide-react';
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
      // 1. Сжатие изображения для экономии токенов Claude
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      // Конвертируем в Base64 для отображения и отправки
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setImage(reader.result as string);
        // Здесь позже будет вызов API
        simulateAnalysis(); 
      };
    } catch (error) {
      console.error("Ошибка при сжатии:", error);
      setLoading(false);
    }
  };

  const simulateAnalysis = () => {
    // Временная заглушка, пока не настроили API
    setTimeout(() => {
      setResult({
        name: "Тестовый образец",
        verdict: "Система готова к подключению Claude 3.5"
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center p-6 font-sans">
      {/* Header */}
      <header className="w-full max-w-md py-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          VISION
        </h1>
        <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest">Universal AI Assistant</p>
      </header>

      {/* Main Action */}
      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center gap-8">
        {!image ? (
          <label className="group relative w-64 h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-full cursor-pointer hover:border-zinc-400 transition-all duration-500">
            <Camera className="w-12 h-12 text-zinc-600 group-hover:text-white transition-colors" />
            <span className="mt-4 text-xs text-zinc-500 group-hover:text-zinc-200">Нажать для сканирования</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
          </label>
        ) : (
          <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
            <img src={image} className="w-full h-full object-cover" alt="Preview" />
            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-400" />
                <p className="mt-4 text-sm font-medium animate-pulse">Анализ экспертом...</p>
              </div>
            )}
          </div>
        )}

        {/* Result Card */}
        {result && !loading && (
          <div className="w-full bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Вердикт VISION
            </div>
            <h2 className="text-xl font-semibold mb-2">{result.name}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{result.verdict}</p>
            <button 
              onClick={() => {setImage(null); setResult(null);}}
              className="mt-6 w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors"
            >
              НОВОЕ СКАНИРОВАНИЕ
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
