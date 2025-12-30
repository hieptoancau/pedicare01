
import React, { useState, useMemo } from 'react';
import { MOCK_DOCTORS, MOCK_MEDICAL_HISTORY } from '../../constants';
import { GoogleGenAI } from "@google/genai";

const AnalyticsTab: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const doctorPerformance = useMemo(() => {
    return MOCK_DOCTORS.map(doc => ({
      name: doc.name,
      count: MOCK_MEDICAL_HISTORY.filter(h => h.doctorName === doc.name).length
    })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, []);

  const specialtyData = useMemo(() => {
    const counts: Record<string, number> = {};
    MOCK_DOCTORS.forEach(d => {
      counts[d.specialty] = (counts[d.specialty] || 0) + 1;
    });
    const total = MOCK_DOCTORS.length;
    return Object.entries(counts).map(([name, count]) => ({
      name: name.replace('Khoa Nhi - ', ''),
      count,
      percent: Math.round((count / total) * 100)
    }));
  }, []);

  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const statsSummary = `Hệ thống có ${MOCK_DOCTORS.length} bác sĩ, ${MOCK_MEDICAL_HISTORY.length} hồ sơ bệnh án. Chuyên khoa chính: Hô hấp, Dinh dưỡng. Top bác sĩ: ${doctorPerformance[0]?.name}.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Dựa trên dữ liệu: ${statsSummary}, hãy đưa ra 3 nhận xét chiến lược ngắn gọn cho quản lý phòng khám nhi bằng tiếng Việt.`,
      });
      setAiInsight(response.text || "AI không phản hồi.");
    } catch (error) {
      setAiInsight("Lỗi kết nối AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      {/* 1. Growth Line Chart */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <span className="material-symbols-outlined text-[140px]">trending_up</span>
        </div>
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div>
            <h3 className="text-2xl font-black tracking-tight">Tăng trưởng Lịch hẹn</h3>
            <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Xu hướng 7 ngày qua</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase">Hoàn thành</span>
            </div>
          </div>
        </div>
        <div className="relative h-64 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
            <path d="M0,220 C100,210 150,230 200,160 C250,90 350,120 450,60 C550,-10 650,110 800,20" fill="none" stroke="#13a4ec" strokeWidth="6" strokeLinecap="round" />
            <path d="M0,220 C100,210 150,230 200,160 C250,90 350,120 450,60 C550,-10 650,110 800,20 V240 H0 Z" fill="#13a4ec" fillOpacity="0.1" />
          </svg>
          <div className="flex justify-between mt-6 text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">
            <span>Thứ 2</span><span>Thứ 3</span><span>Thứ 4</span><span>Thứ 5</span><span>Thứ 6</span><span>Thứ 7</span><span>CN</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Specialty Donut */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black mb-8">Phân bổ Chuyên khoa</h3>
          <div className="flex flex-col sm:flex-row items-center gap-10">
            <div className="relative size-48">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="10" className="dark:stroke-slate-800" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#13a4ec" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black">{MOCK_DOCTORS.length}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Bác sĩ</span>
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
              {specialtyData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{width: `${item.percent}%`}}></div>
                    </div>
                    <span className="text-xs font-black">{item.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Doctor Performance */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black mb-8">Top Bác sĩ Hiệu suất</h3>
          <div className="space-y-6">
            {doctorPerformance.map((doc, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black">{doc.name}</p>
                  <p className="text-xs font-black text-primary">{doc.count} ca</p>
                </div>
                <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(doc.count / (doctorPerformance[0]?.count || 1)) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. AI Strategic Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-400 p-1 rounded-[32px] shadow-2xl">
        <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-4xl">psychology_alt</span></div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">AI Strategic Analysis</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Phân tích chuyên sâu bởi Gemini</p>
              </div>
            </div>
            <button 
              onClick={handleAIAnalyze} 
              disabled={isAnalyzing}
              className="px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-primary/30"
            >
              {isAnalyzing ? "Đang phân tích..." : "PHÂN TÍCH HỆ THỐNG"}
            </button>
          </div>
          {aiInsight && (
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in duration-500">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{aiInsight}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
