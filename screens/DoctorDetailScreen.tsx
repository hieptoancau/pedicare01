
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Doctor } from '../types';

interface DoctorDetailScreenProps {
  doctor: Doctor;
}

const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Chi tiết Bác sĩ</h1>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-[24px]">favorite</span>
        </button>
      </header>
      
      <div className="flex flex-col items-center p-6 gap-4 bg-background-light dark:bg-background-dark">
        <div className="relative">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 border-4 border-white dark:border-slate-800 shadow-lg" style={{backgroundImage: `url("${doctor.image}")`}}></div>
          <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full w-6 h-6 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold leading-tight tracking-tight">{doctor.name}</h2>
          <p className="text-primary font-medium mt-1">{doctor.specialty}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{doctor.hospital}</p>
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="flex gap-3 justify-between">
          <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-slate-800 p-3 items-center text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="bg-blue-50 dark:bg-slate-700 p-2 rounded-full mb-1"><span className="material-symbols-outlined text-primary text-[20px]">medical_services</span></div>
            <p className="text-lg font-bold leading-tight">{doctor.experience}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Kinh nghiệm</p>
          </div>
          <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-slate-800 p-3 items-center text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="bg-yellow-50 dark:bg-slate-700 p-2 rounded-full mb-1"><span className="material-symbols-outlined text-yellow-500 text-[20px] filled-icon">star</span></div>
            <p className="text-lg font-bold leading-tight">{doctor.rating}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Đánh giá</p>
          </div>
          <div className="flex flex-1 flex-col gap-1 rounded-2xl bg-white dark:bg-slate-800 p-3 items-center text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="bg-green-50 dark:bg-slate-700 p-2 rounded-full mb-1"><span className="material-symbols-outlined text-green-500 text-[20px]">groups</span></div>
            <p className="text-lg font-bold leading-tight">{doctor.patients}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Lượt khám</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <h3 className="text-lg font-bold mb-2">Thông tin bác sĩ</h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {doctor.bio}
        </p>
        <button className="text-primary text-sm font-medium mt-1">Xem thêm</button>
      </div>

      <div className="px-4 py-4">
        <h3 className="text-lg font-bold mb-3">Địa điểm</h3>
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="relative h-32 w-full overflow-hidden rounded-xl mb-3">
            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url("https://picsum.photos/seed/map/800/400")'}}></div>
          </div>
          <div className="flex gap-3 items-start px-1">
            <div className="bg-blue-50 dark:bg-slate-700 p-2 rounded-full shrink-0"><span className="material-symbols-outlined text-primary text-[20px]">location_on</span></div>
            <div>
              <p className="font-bold text-base text-slate-900 dark:text-white">{doctor.hospital.split('(')[0]}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Địa chỉ khám bệnh chi tiết tại TP.HCM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng thanh toán</span>
            <span className="text-lg font-bold text-primary">{doctor.price.toLocaleString('vi-VN')}đ</span>
          </div>
          <button 
            onClick={() => navigate('/booking')} 
            className="flex-1 h-12 bg-primary hover:bg-sky-500 active:bg-sky-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
          >
            Tiếp tục <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailScreen;
