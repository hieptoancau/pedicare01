
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doctor, Appointment } from '../types';
import { MOCK_CHILDREN } from '../constants';

interface BookingScreenProps {
  doctor: Doctor;
  onNext: (data: Partial<Appointment>) => void;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ doctor, onNext }) => {
  const navigate = useNavigate();
  
  // Generate real dates for the next 7 days
  const dates = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      list.push({
        full: d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }),
        day: d.getDate().toString(),
        weekday: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
        iso: d.toISOString().split('T')[0]
      });
    }
    return list;
  }, []);

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState('09:00');

  const handleNext = () => {
    onNext({
      date: dates[selectedDateIndex].full,
      time: selectedTime,
      service: 'Khám tổng quát',
      price: doctor.price
    });
    navigate('/patient-info');
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-32 max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-10 text-slate-900 dark:text-white">Đặt Lịch Hẹn</h2>
      </div>
      
      <div className="h-4"></div>
      <div className="px-4">
        <label className="block">
          <p className="text-base font-medium leading-normal pb-2 text-slate-900 dark:text-slate-200">Chọn hồ sơ bé</p>
          <div className="relative">
            <select className="appearance-none w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-4 pr-10 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
              {MOCK_CHILDREN.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.age} tuổi)</option>
              ))}
              <option value="add">+ Thêm hồ sơ mới</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-primary">
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </label>
      </div>
      
      <div className="mt-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white">Chọn ngày</h3>
          <span className="text-sm font-medium text-primary">Tháng {new Date().getMonth() + 1}, {new Date().getFullYear()}</span>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 pb-2 snap-x">
          {dates.map((date, idx) => (
            <div key={date.iso} className="flex-none w-[70px] snap-center">
              <button 
                onClick={() => setSelectedDateIndex(idx)}
                className={`flex flex-col items-center justify-center h-20 w-full rounded-xl transition-all ${selectedDateIndex === idx ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}`}
              >
                <span className={`text-xs font-medium uppercase ${selectedDateIndex === idx ? 'opacity-90' : 'text-slate-500'}`}>{date.weekday}</span>
                <span className="text-xl font-bold">{date.day}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 px-4">
        <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white mb-4">Chọn giờ</h3>
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-orange-400 text-lg">wb_sunny</span>
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Thời gian còn trống</h4>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '14:00', '14:30', '15:00', '15:30'].map(t => (
              <button 
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${selectedTime === t ? 'bg-primary text-white shadow-md shadow-primary/30 transform scale-[1.05]' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md z-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400">Dịch vụ: Khám tổng quát</span>
            <span className="text-lg font-bold text-primary">{doctor.price.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>
        <button 
          onClick={handleNext} 
          className="w-full bg-primary hover:bg-sky-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>Tiếp tục</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default BookingScreen;
