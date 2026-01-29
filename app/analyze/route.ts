import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image, location } = await req.json();

    // Удаляем префикс base64 для передачи в API
    const base64Image = image.split(',')[1];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "anthropic/claude-3.5-sonnet",
        "messages": [
          {
            "role": "system",
            "content": `Ты — VISION, элитный AI-эксперт. 
            Твоя задача: анализировать товары по фото. 
            90% случаев — это алкоголь и деликатесы. 
            Отвечай строго в формате JSON:
            {
              "name": "Название товара",
              "country": "Страна",
              "price": "Примерная цена в СНГ",
              "rating": "Оценка 1-10",
              "description": "Краткое описание вкуса/качества",
              "verdict": "Стоит ли брать и почему"
            }`
          },
          {
            "role": "user",
            "content": [
              { "type": "text", "text": `Проанализируй этот товар. Локация пользователя: ${location || 'Неизвестна'}` },
              { "type": "image_url", "image_url": { "url": `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Ошибка анализа:", error);
    return NextResponse.json({ error: "Ошибка при связи с AI" }, { status: 500 });
  }
}
