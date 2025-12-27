
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BottomNavProps {
  active: 'home' | 'calendar' | 'chat' | 'profile';
}

const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const navigate = useNavigate();
  
  const getIconClass = (name: string) => 
    active === name ? "filled-icon text-primary" : "text-text-sub dark:text-gray-400";
  
  const getTextClass = (name: string) => 
    active === name ? "text-primary font-bold" : "text-text-sub dark:text-gray-400 font-medium";

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 px-6 py-2 pb-5 z-50">
      <div className="flex justify-between items-center h-12">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 group w-16">
          <span className={`material-symbols-outlined text-[26px] ${getIconClass('home')}`}>home</span>
          <span className={`text-[10px] ${getTextClass('home')}`}>Trang chủ</span>
        </button>
        <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 group w-16">
          <span className={`material-symbols-outlined text-[26px] ${getIconClass('calendar')}`}>calendar_today</span>
          <span className={`text-[10px] ${getTextClass('calendar')}`}>Lịch hẹn</span>
        </button>
        
        <div className="relative -top-6">
          <button onClick={() => navigate('/select-doctor')} className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg shadow-blue-400/40 hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95">
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>

        <button onClick={() => navigate('/ai-checker')} className="flex flex-col items-center gap-1 group w-16">
          <span className={`material-symbols-outlined text-[26px] ${getIconClass('chat')}`}>smart_toy</span>
          <span className={`text-[10px] ${getTextClass('chat')}`}>AI Tư vấn</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 group w-16">
          <span className={`material-symbols-outlined text-[26px] ${getIconClass('profile')}`}>person</span>
          <span className={`text-[10px] ${getTextClass('profile')}`}>Cá nhân</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
