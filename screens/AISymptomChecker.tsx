
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSymptoms, connectLiveConsultant, decodeBase64, decodeAudioData, createAudioBlob } from '../services/geminiService';
import BottomNav from '../components/BottomNav';

const AISymptomChecker: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Chào mẹ! Tôi là trợ lý AI PediCare. Mẹ hãy mô tả triệu chứng của bé, hoặc nhấn vào biểu tượng micro để bắt đầu tư vấn bằng giọng nói.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    const aiResponse = await checkSymptoms(userMsg);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || '' }]);
    setIsLoading(false);
  };

  const stopVoiceMode = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    if (outAudioContextRef.current) outAudioContextRef.current.close();
    setIsVoiceMode(false);
    setIsListening(false);
  };

  const startVoiceMode = async () => {
    try {
      setIsVoiceMode(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = connectLiveConsultant({
        onopen: () => {
          setIsListening(true);
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createAudioBlob(inputData);
            sessionPromise.then((session: any) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
        },
        onmessage: async (message: any) => {
          const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioBase64 && outAudioContextRef.current) {
            const ctx = outAudioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const audioBuffer = await decodeAudioData(decodeBase64(audioBase64), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }
          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => stopVoiceMode(),
        onerror: () => stopVoiceMode(),
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      stopVoiceMode();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <header className="sticky top-0 z-50 bg-primary p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1"><span className="material-symbols-outlined">arrow_back</span></button>
          <div>
            <h2 className="font-bold">AI Tư vấn sức khỏe</h2>
            <p className="text-[10px] opacity-80">{isVoiceMode ? 'Đang trong cuộc gọi thoại...' : 'Hoạt động 24/7'}</p>
          </div>
        </div>
        {isVoiceMode && (
          <button onClick={stopVoiceMode} className="bg-red-500 p-2 rounded-full animate-pulse">
            <span className="material-symbols-outlined">call_end</span>
          </button>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar pb-32">
        {isVoiceMode ? (
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="relative">
              <div className="size-40 rounded-full bg-primary/10 flex items-center justify-center animate-ping absolute"></div>
              <div className="size-40 rounded-full bg-primary/20 flex items-center justify-center animate-pulse absolute"></div>
              <div className="size-40 rounded-full bg-primary flex items-center justify-center relative z-10 shadow-xl">
                <span className="material-symbols-outlined text-6xl text-white">smart_toy</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary">Đang lắng nghe...</h3>
              <p className="text-sm text-text-sub mt-2 px-8">Mẹ có thể nói trực tiếp với bác sĩ AI ngay bây giờ</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-100 dark:border-slate-700 rounded-bl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl flex gap-1 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!isVoiceMode && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2 items-center">
            <button 
              onClick={startVoiceMode}
              className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
              title="Tư vấn bằng giọng nói"
            >
              <span className="material-symbols-outlined text-[24px]">mic</span>
            </button>
            <div className="flex-1 flex gap-2 items-center bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-inner border border-slate-200 dark:border-slate-700">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Mô tả triệu chứng..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 dark:text-white"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className={`size-8 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-2">Dịch vụ AI không thay thế chẩn đoán chuyên môn.</p>
        </div>
      )}

      <BottomNav active="chat" />
    </div>
  );
};

export default AISymptomChecker;
