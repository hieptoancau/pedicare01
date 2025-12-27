
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { MOCK_DOCTORS } from '../constants';
import { getDailyHealthTip } from '../services/geminiService';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [healthTip, setHealthTip] = useState<string>("Đang tải lời khuyên hôm nay...");

  useEffect(() => {
    const fetchTip = async () => {
      const tip = await getDailyHealthTip();
      setHealthTip(tip || '');
    };
    fetchTip();
  }, []);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-x-hidden shadow-2xl pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md transition-all">
        <div className="flex items-center p-4 pb-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer" onClick={() => navigate('/profile')}>
              <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-primary" style={{backgroundImage: 'url("https://picsum.photos/seed/user1/200/200")'}}></div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark"></div>
            </div>
            <div>
              <p className="text-xs text-text-sub font-medium">Xin chào,</p>
              <h3 className="text-sm font-bold text-text-main dark:text-white">Chị Thu Thảo</h3>
            </div>
          </div>
          <button className="flex items-center justify-center rounded-full size-10 bg-background-light dark:bg-gray-800 hover:bg-primary-soft transition-colors relative group">
            <span className="material-symbols-outlined text-text-main dark:text-white group-hover:text-primary">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-4 pb-2 pt-4">
        <h2 className="text-text-main dark:text-white text-[28px] font-bold leading-tight tracking-tight">
          Chào mẹ, <br/><span className="text-primary">bé hôm nay thế nào? 👋</span>
        </h2>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4 sticky top-[64px] z-40">
        <div className="flex w-full items-center rounded-xl h-12 bg-white dark:bg-gray-800 shadow-sm border border-transparent focus-within:border-primary/50 transition-all">
          <div className="flex items-center justify-center pl-4 pr-2">
            <span className="material-symbols-outlined text-primary">search</span>
          </div>
          <input 
            className="w-full bg-transparent border-none text-text-main dark:text-white placeholder:text-text-sub focus:ring-0 text-base font-normal leading-normal outline-none" 
            placeholder="Tìm bác sĩ, chuyên khoa..."
          />
          <button className="pr-4 pl-2 border-l border-gray-200 dark:border-gray-700 h-6 flex items-center">
            <span className="material-symbols-outlined text-text-sub">tune</span>
          </button>
        </div>
      </div>

      {/* Quick Promotion: Lucky Wheel */}
      <div className="px-4 mb-4">
        <div 
          onClick={() => navigate('/lucky-wheel')}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 shadow-lg text-white relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="absolute -right-4 -bottom-4 size-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-yellow-300 filled-icon">auto_awesome</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">Vòng quay may mắn</h4>
              <p className="text-[10px] text-white/80">Quay ngay nhận Voucher khám bệnh!</p>
            </div>
            <button className="bg-white text-indigo-600 text-[10px] font-bold px-3 py-1.5 rounded-full">Chơi ngay</button>
          </div>
        </div>
      </div>

      {/* AI Symptom Checker Banner */}
      <div className="px-4 mt-2">
        <div 
          onClick={() => navigate('/ai-checker')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 shadow-lg text-white relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="absolute -right-4 -bottom-4 size-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">Kiểm tra triệu chứng AI</h4>
              <p className="text-sm text-blue-100">Hỏi AI về sức khỏe của bé ngay</p>
            </div>
            <span className="material-symbols-outlined">chevron_right</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'book', label: 'Đặt lịch', icon: 'calendar_month', color: 'primary', path: '/select-doctor' },
            { id: 'find', label: 'Tìm bác sĩ', icon: 'stethoscope', color: 'orange-500', path: '/select-doctor' },
            { id: 'file', label: 'Hồ sơ', icon: 'folder_shared', color: 'green-500', path: '/profile' },
            { id: 'video', label: 'Tư vấn', icon: 'video_call', color: 'purple-500', path: '/select-doctor' },
          ].map((action) => (
            <button key={action.id} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-2 group">
              <div className={`size-16 rounded-2xl bg-${action.id === 'book' ? 'primary' : action.color}/10 flex items-center justify-center group-hover:bg-primary group-hover:shadow-lg transition-all duration-300`}>
                <span className={`material-symbols-outlined text-${action.id === 'book' ? 'primary' : action.color} text-3xl group-hover:text-white filled-icon`}>{action.icon}</span>
              </div>
              <span className="text-xs font-medium text-text-main dark:text-gray-300 text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Health Tip Section */}
      <div className="mt-2 px-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl p-4 flex gap-3">
          <span className="material-symbols-outlined text-amber-500 filled-icon">lightbulb</span>
          <div>
            <h5 className="text-sm font-bold text-amber-900 dark:text-amber-100">Lời khuyên hôm nay</h5>
            <p className="text-xs text-amber-800 dark:text-amber-200 mt-1 leading-relaxed">
              {healthTip}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Doctors */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-lg font-bold text-text-main dark:text-white">Bác sĩ nổi bật</h3>
          <button onClick={() => navigate('/select-doctor')} className="text-sm text-primary font-bold">Xem tất cả</button>
        </div>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar snap-x">
          {MOCK_DOCTORS.slice(0, 3).map(doctor => (
            <div key={doctor.id} className="min-w-[160px] bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm snap-start">
              <div className="relative mb-3">
                <div className="w-full aspect-square bg-gray-100 rounded-xl bg-center bg-cover mb-2" style={{backgroundImage: `url("${doctor.image}")`}}></div>
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-sm">
                  <span className="material-symbols-outlined text-yellow-400 text-[10px] filled-icon">star</span>
                  <span className="text-[10px] font-bold">{doctor.rating}</span>
                </div>
              </div>
              <h4 className="font-bold text-sm text-text-main dark:text-white truncate">{doctor.name}</h4>
              <p className="text-xs text-text-sub truncate mb-2">{doctor.specialty}</p>
              <button 
                onClick={() => navigate('/doctor-detail')}
                className="w-full py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Đặt lịch
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
};

export default HomeScreen;
