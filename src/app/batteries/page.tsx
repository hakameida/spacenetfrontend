'use client'
import React, { useState, useEffect, useRef } from "react";
import type { Viewport } from "next";
import LoadingScreen from "@/components/loading/LoadingScreen";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export default function Home() {
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const patternIndexRef = useRef<number>(0);
  const transitionProgressRef = useRef<number>(1);
  const transitioningRef = useRef<boolean>(false);
  const nextPatternIndexRef = useRef<number>(1);
  const [patternIndex, setPatternIndex] = useState(0);

  const patterns = [
    {
      lines: [
        { points: [[0,50], [150,20], [200,80], [400,60], [600,90], [800,50]], color: [255,0,0], width: 4, speed: 0.8, phase: 0 },
        { points: [[0,120], [200,80], [250,150], [500,130], [800,160]], color: [0,100,255], width: 3.5, speed: 0.6, phase: 0.5 },
        { points: [[0,200], [180,160], [220,230], [450,210], [800,240]], color: [255,0,0], width: 4.5, speed: 0.7, phase: 1 },
        { points: [[0,280], [150,250], [200,320], [350,300], [550,330], [800,290]], color: [0,100,255], width: 3, speed: 0.5, phase: 1.5 },
        { points: [[0,360], [250,320], [300,390], [600,370], [800,400]], color: [255,0,0], width: 4, speed: 0.9, phase: 0.8 },
        { points: [[0,440], [200,400], [250,470], [450,450], [650,480], [800,440]], color: [0,100,255], width: 3.5, speed: 0.65, phase: 2 },
        { points: [[0,520], [180,490], [250,560], [500,540], [800,570]], color: [255,0,0], width: 4, speed: 0.75, phase: 1.2 },
        { points: [[0,600], [150,570], [220,640], [400,620], [600,650], [800,610]], color: [0,100,255], width: 3.5, speed: 0.55, phase: 0.3 },
        { points: [[0,680], [200,650], [300,720], [550,700], [800,730]], color: [255,0,0], width: 4, speed: 0.85, phase: 1.8 },
        { points: [[0,760], [180,730], [250,790], [450,770], [650,800], [800,760]], color: [0,100,255], width: 3, speed: 0.7, phase: 0.7 },
      ]
    },
    {
      lines: [
        { points: [[50,0], [100,80], [150,40], [250,100], [400,60], [500,120], [650,80], [750,140]], color: [255,0,0], width: 4.5, speed: 1.0, phase: 0.2 },
        { points: [[0,180], [120,140], [180,220], [300,190], [450,250], [550,210], [700,270], [800,230]], color: [0,100,255], width: 3.5, speed: 0.78, phase: 0.6 },
        { points: [[30,320], [150,280], [200,360], [350,330], [500,390], [650,350], [750,400], [800,370]], color: [255,0,0], width: 4, speed: 0.9, phase: 1.2 },
        { points: [[0,460], [100,420], [180,500], [300,470], [450,530], [600,490], [700,550], [800,510]], color: [0,100,255], width: 3.5, speed: 0.72, phase: 0.4 },
        { points: [[50,600], [200,560], [250,640], [400,610], [550,670], [700,630], [750,680], [800,650]], color: [255,0,0], width: 4, speed: 0.82, phase: 0.9 },
        { points: [[0,740], [150,700], [220,780], [380,750], [520,810], [680,770], [750,800], [800,780]], color: [0,100,255], width: 3.5, speed: 0.95, phase: 1.5 },
      ]
    },
    {
      lines: [
        { points: [[0,80], [100,40], [150,100], [300,70], [450,110], [600,80], [800,120]], color: [255,0,0], width: 4, speed: 1.1, phase: 0.3 },
        { points: [[0,160], [80,120], [130,200], [250,170], [400,230], [500,190], [650,250], [800,210]], color: [0,100,255], width: 3.5, speed: 0.68, phase: 0.8 },
        { points: [[0,250], [120,210], [180,280], [350,240], [550,290], [800,250]], color: [255,0,0], width: 4.5, speed: 0.85, phase: 1.4 },
        { points: [[0,340], [100,300], [160,380], [280,350], [430,410], [580,370], [700,430], [800,390]], color: [0,100,255], width: 3, speed: 0.75, phase: 0.5 },
        { points: [[0,430], [150,390], [220,460], [400,420], [600,470], [800,440]], color: [255,0,0], width: 4, speed: 0.98, phase: 1.1 },
        { points: [[0,520], [120,480], [190,560], [320,530], [470,590], [620,550], [720,610], [800,570]], color: [0,100,255], width: 3.5, speed: 0.64, phase: 1.7 },
        { points: [[0,610], [180,570], [250,640], [450,600], [650,650], [800,620]], color: [255,0,0], width: 4, speed: 0.8, phase: 0.9 },
        { points: [[0,700], [100,660], [170,740], [300,710], [450,770], [600,730], [700,790], [800,750]], color: [0,100,255], width: 3.5, speed: 0.88, phase: 1.3 },
      ]
    },
  ];

  // KEY FIX: each line gets its own localTime that runs continuously forever
  // even when its pattern is not active — so curves never "restart" on transition
  const lineTimesRef = useRef<number[][]>(
    patterns.map(p => p.lines.map(() => Math.random() * 100))
  );

  const drawCurve = (
    ctx: CanvasRenderingContext2D,
    patIdx: number,
    lineIdx: number,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const line = patterns[patIdx].lines[lineIdx];
    if (!line) return;

    // Use this line's own continuously-running local time
    const t = lineTimesRef.current[patIdx][lineIdx];
    const time = t * line.speed + line.phase;

    const osc = Math.sin(time * Math.PI);
    const opacity = 0.3 + (osc + 1) / 2 * 0.7;
    const glowIntensity = Math.abs(osc) * 12;

    const scaledPoints = line.points.map(p => [
      p[0] * canvasWidth / 800,
      p[1] * canvasHeight / 800,
    ]);

    ctx.beginPath();
    ctx.moveTo(scaledPoints[0][0], scaledPoints[0][1]);

    for (let i = 0; i < scaledPoints.length - 1; i++) {
      const x1 = scaledPoints[i][0];
      const y1 = scaledPoints[i][1];
      const x2 = scaledPoints[i + 1][0];
      const y2 = scaledPoints[i + 1][1];

      const cp1x = x1 + (x2 - x1) * 0.3 + Math.sin(time + i) * 20;
      const cp1y = y1 + (y2 - y1) * 0.2 + Math.cos(time * 0.8 + i) * 15;
      const cp2x = x2 - (x2 - x1) * 0.3 + Math.cos(time * 0.6 + i) * 20;
      const cp2y = y2 - (y2 - y1) * 0.2 + Math.sin(time * 0.7 + i) * 15;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    }

    ctx.strokeStyle = `rgba(${line.color[0]}, ${line.color[1]}, ${line.color[2]}, ${opacity})`;
    ctx.lineWidth = line.width;
    ctx.lineCap = 'round';
    ctx.shadowBlur = glowIntensity;
    ctx.shadowColor = `rgba(${line.color[0]}, ${line.color[1]}, ${line.color[2]}, 0.8)`;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  // Pattern auto-switch every 20s
  useEffect(() => {
    const interval = setInterval(() => {
      if (transitioningRef.current) return;
      transitioningRef.current = true;
      nextPatternIndexRef.current = (patternIndexRef.current + 1) % patterns.length;
      transitionProgressRef.current = 1;
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      // Advance ALL lines in ALL patterns every frame — this is the key fix
      patterns.forEach((p, pi) => {
        p.lines.forEach((_, li) => {
          lineTimesRef.current[pi][li] += delta;
        });
      });

      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      const curIdx = patternIndexRef.current;
      const nxtIdx = nextPatternIndexRef.current;

      if (transitioningRef.current) {
        // Fade out current, fade in next — 1.5s crossfade
        transitionProgressRef.current -= delta / 1.5;

        if (transitionProgressRef.current <= 0) {
          // Transition complete
          transitionProgressRef.current = 1;
          patternIndexRef.current = nxtIdx;
          nextPatternIndexRef.current = (nxtIdx + 1) % patterns.length;
          transitioningRef.current = false;
          setPatternIndex(patternIndexRef.current);

          // Draw the now-current pattern normally
          patterns[patternIndexRef.current].lines.forEach((_, li) => {
            drawCurve(ctx, patternIndexRef.current, li, width, height);
          });
        } else {
          const progress = transitionProgressRef.current;

          // Next pattern fading IN
          ctx.save();
          ctx.globalAlpha = 1 - progress;
          patterns[nxtIdx].lines.forEach((_, li) => {
            drawCurve(ctx, nxtIdx, li, width, height);
          });
          ctx.restore();

          // Current pattern fading OUT
          ctx.save();
          ctx.globalAlpha = progress;
          patterns[curIdx].lines.forEach((_, li) => {
            drawCurve(ctx, curIdx, li, width, height);
          });
          ctx.restore();
        }
      } else {
        // Normal draw
        patterns[curIdx].lines.forEach((_, li) => {
          drawCurve(ctx, curIdx, li, width, height);
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const message = `📞 رقم الهاتف: ${phone}\n🔋 موديل البطارية: ${model}`;

    const BOT_TOKEN = '7899813819:AAEbzndOkH6dA0qiwYd-BckHA7PZu-17w14';
    const CHAT_ID = '773627573';

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      });
      alert("تم الإرسال بنجاح ✅");
      setPhone("");
      setModel("");
    } catch (error) {
      alert("حدث خطأ! حاول مرة أخرى.");
    }
  };

  return (
    
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white">
            {/* 🔵 Loading Screen */}
            <LoadingScreen />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ display: 'block' }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-gray-100/30 pointer-events-none" />

      <div className="container mx-auto w-[90%] pt-20 pb-16 relative z-10">
        <div
          className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl max-w-md w-full mx-auto transition-all duration-500 hover:shadow-2xl border border-gray-200"
          style={{
            boxShadow: '0 -8px 30px rgba(0,0,0,0.05), 0 8px 30px rgba(0,0,0,0.08)'
          }}
        >
          <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
            فقط ضع رقمك و موديل البطارية وسوف نرد برساله
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 text-right bg-white/90 text-gray-800 placeholder-gray-400 transition-all"
              required
            />
            <input
              type="text"
              placeholder="موديل البطارية"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right bg-white/90 text-gray-800 placeholder-gray-400 transition-all"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-red-500 to-blue-500 text-white py-3 rounded-xl hover:from-red-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] font-semibold text-lg"
            >
              ارسال
            </button>
          </form>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {patterns.map((_, idx) => (
          <div
            key={idx}
            className={`h-0.5 rounded-full transition-all duration-700 ${
              idx === patternIndex
                ? 'bg-gradient-to-r from-red-500 to-blue-500 w-6'
                : 'bg-gray-300 w-2'
            }`}
          />
        ))}
      </div>
    </main>
  );
}