
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import BottomNav from '../components/BottomNav';

const REWARDS = [
  { id: 1, text: "Voucher 50k", color: "#FF6B6B" },
  { id: 2, text: "Khám Hô hấp", color: "#4D96FF" },
  { id: 3, text: "Voucher 10%", color: "#6BCB77" },
  { id: 4, text: "Tư vấn AI Free", color: "#FFD93D" },
  { id: 5, text: "Mất lượt", color: "#95a5a6" },
  { id: 6, text: "Voucher 100k", color: "#6c5ce7" },
];

const LuckyWheelScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    setAiMessage("");

    // Xoay ít nhất 5 vòng (1800 độ) + góc ngẫu nhiên
    const extraDegree = Math.floor(Math.random() * 360);
    const totalDegree = rotation + 1800 + extraDegree;
    
    setRotation(totalDegree);

    setTimeout(() => {
      setIsSpinning(false);
      
      // Tính toán kết quả (mỗi segment 60 độ)
      const actualDegree = totalDegree % 360;
      // Vòng quay quay theo chiều kim đồng hồ, index tính ngược lại
      const index = Math.floor(((360 - actualDegree) % 360) / 60);
      const reward = REWARDS[index];
      setResult(reward.text);
      
      if (reward.id !== 5) {
        getAiCongratulation(reward.text);
      }
    }, 4000);
  };

  const getAiCongratulation = async (rewardName: string) => {
    setLoadingAi(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Người dùng vừa trúng phần thưởng "${rewardName}" trong trò chơi Vòng quay may mắn của ứng dụng PediCare (chăm sóc nhi khoa). 
        Hãy viết 1 lời chúc mừng ngắn gọn, vui vẻ và ấm áp (khoảng 2 câu) gửi tới mẹ của bé. 
        Ngôn ngữ: Tiếng Việt.`,
      });
      setAiMessage(response.text || "");
    } catch (error) {
      setAiMessage("Chúc mừng mẹ đã nhận được món quà ý nghĩa cho bé yêu!");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark max-w-md mx-auto shadow-2xl relative overflow-hidden pb-24">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="size-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold">Vòng quay may mắn</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Thử thách vận may</h2>
          <p className="text-text-sub text-sm">Quay mỗi ngày để nhận quà cho bé</p>
        </div>

        {/* Wheel Container */}
        <div className="relative size-72">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-red-500">
            <span className="material-symbols-outlined text-4xl filled-icon">expand_more</span>
          </div>

          {/* The Wheel */}
          <div 
            className="w-full h-full rounded-full border-8 border-white dark:border-slate-800 shadow-2xl relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.1, 0, 0, 1)"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              backgroundImage: `conic-gradient(${REWARDS.map((r, i) => `${r.color} ${i * 60}deg ${(i + 1) * 60}deg`).join(', ')})`
            }}
          >
            {REWARDS.map((reward, i) => (
              <div 
                key={i}
                className="absolute top-1/2 left-1/2 w-1/2 h-8 -translate-y-1/2 origin-left flex items-center justify-end pr-4 text-[10px] font-bold text-white uppercase"
                style={{ transform: `rotate(${i * 60 + 30}deg)` }}
              >
                {reward.text}
              </div>
            ))}
            {/* Inner Circle Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white dark:bg-slate-800 z-10 shadow-inner flex items-center justify-center">
              <div className="size-8 rounded-full border-2 border-primary/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        <button 
          onClick={spinWheel}
          disabled={isSpinning}
          className={`w-full max-w-xs py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 ${isSpinning ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary text-white shadow-primary/30 hover:bg-sky-500'}`}
        >
          {isSpinning ? 'Đang quay...' : 'QUAY NGAY'}
        </button>

        {/* Result & AI Message */}
        {result && (
          <div className="w-full bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-primary/20 animate-bounce-in">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-yellow-500 filled-icon">card_giftcard</span>
              <h3 className="font-bold text-lg">Chúc mừng mẹ!</h3>
            </div>
            <p className="text-text-main dark:text-white font-medium mb-3">
              Mẹ đã trúng: <span className="text-primary font-bold">{result}</span>
            </p>
            
            {loadingAi ? (
              <div className="h-10 flex items-center gap-2">
                <div className="size-2 bg-primary rounded-full animate-bounce"></div>
                <div className="size-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <p className="text-xs text-text-sub italic">Bác sĩ AI đang viết lời chúc...</p>
              </div>
            ) : aiMessage && (
              <div className="bg-primary-soft/30 dark:bg-primary/10 p-3 rounded-xl border-l-4 border-primary">
                <p className="text-xs text-text-sub dark:text-slate-300 italic leading-relaxed">"{aiMessage}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav active="home" />
    </div>
  );
};

export default LuckyWheelScreen;
