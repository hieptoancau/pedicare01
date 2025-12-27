
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DOCTORS } from '../constants';
import { Doctor } from '../types';
import BottomNav from '../components/BottomNav';

interface SelectDoctorScreenProps {
  onSelect: (doctor: Doctor) => void;
}

const SelectDoctorScreen: React.FC<SelectDoctorScreenProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tất cả');

  const specialties = ['Tất cả', 'Hô hấp', 'Dinh dưỡng', 'Tâm lý', 'Tổng quát'];

  const handleSelect = (doctor: Doctor) => {
    onSelect(doctor);
    navigate('/doctor-detail');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased pb-24 min-h-screen max-w-md mx-auto relative shadow-2xl">
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 py-2 pt-4 pb-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center text-slate-800 dark:text-white">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white absolute left-1/2 -translate-x-1/2">Chọn Bác sĩ</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center text-slate-800 dark:text-white">
          <span className="material-symbols-outlined text-[24px]">tune</span>
        </button>
      </header>

      <div className="px-4 py-4 sticky top-[60px] z-40 bg-background-light dark:bg-background-dark">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-primary">
            <span className="material-symbols-outlined text-[24px]">search</span>
          </div>
          <input className="block w-full p-4 pl-12 text-sm text-slate-900 border-none rounded-xl bg-white dark:bg-surface-dark dark:text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Tìm tên bác sĩ, chuyên khoa..." type="text"/>
        </div>
      </div>

      <div className="pl-4 pb-2 flex gap-3 overflow-x-auto no-scrollbar snap-x">
        {specialties.map(s => (
          <button 
            key={s}
            onClick={() => setFilter(s)}
            className={`snap-start shrink-0 flex h-9 items-center justify-center px-4 rounded-xl font-medium text-sm transition-all ${filter === s ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 text-slate-600 dark:text-slate-300'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 px-4 py-2 mt-2">
        {MOCK_DOCTORS.map((doctor) => (
          <div key={doctor.id} className="group bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.99] transition-all duration-200">
            <div className="flex gap-4">
              <div className="relative shrink-0">
                <div className="w-[72px] h-[72px] rounded-lg bg-center bg-cover border border-gray-100 dark:border-gray-700" style={{backgroundImage: `url("${doctor.image}")`}}></div>
              </div>
              <div className="flex flex-col flex-1 justify-between min-w-0">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-slate-900 dark:text-white font-bold text-base truncate pr-2">{doctor.name}</h3>
                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-yellow-500 text-[14px] filled-icon">star</span>
                      <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">{doctor.rating}</span>
                    </div>
                  </div>
                  <p className="text-primary text-sm font-medium">{doctor.specialty}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 truncate">{doctor.hospital}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="flex h-2 w-2 relative">
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${doctor.statusColor.includes('green') ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                </span>
                <span className={`text-xs font-medium ${doctor.statusColor}`}>{doctor.statusText}</span>
              </div>
              <button 
                onClick={() => handleSelect(doctor)}
                className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-primary/30"
              >
                Đặt lịch
              </button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="home" />
    </div>
  );
};

export default SelectDoctorScreen;
