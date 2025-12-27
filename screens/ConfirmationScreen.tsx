
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Doctor, Appointment, ChildProfile } from '../types';

interface ConfirmationScreenProps {
  doctor: Doctor;
  child: ChildProfile;
  bookingData: Partial<Appointment>;
  onConfirm: (appointment: Appointment) => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ doctor, child, bookingData, onConfirm }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: doctor.id,
      childId: child.id,
      date: bookingData.date || '',
      time: bookingData.time || '',
      status: 'upcoming',
      service: bookingData.service || 'Khám tổng quát',
      price: bookingData.price || 0,
    };
    onConfirm(newAppointment);
    navigate('/history');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-32 bg-background-light dark:bg-background-dark max-w-md mx-auto shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="text-text-main-light dark:text-text-main-dark flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Xác nhận Đặt Lịch</h2>
      </header>

      <main className="flex-1 flex flex-col gap-5 p-4">
        <section className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-text-sub dark:text-slate-400 mb-3 uppercase tracking-wider">Thông tin bác sĩ</h3>
          <div className="flex gap-4 items-center">
            <div className="relative shrink-0">
              <div className="bg-center bg-no-repeat bg-cover rounded-full h-20 w-20 ring-2 ring-primary/20" style={{backgroundImage: `url("${doctor.image}")`}}></div>
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">verified</span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-lg font-bold leading-tight">{doctor.name}</p>
              <p className="text-primary font-medium text-sm mt-0.5">{doctor.specialty}</p>
              <div className="flex items-center gap-1 mt-1 text-text-sub dark:text-slate-400 text-xs">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                <span className="truncate">{doctor.hospital}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-text-sub dark:text-slate-400 mb-4 uppercase tracking-wider">Lịch hẹn & Chi phí</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined">calendar_month</span></div>
                <div><p className="text-xs text-text-sub dark:text-slate-400">Ngày khám</p><p className="font-medium text-sm">{bookingData.date}</p></div>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500"><span className="material-symbols-outlined">schedule</span></div>
                <div><p className="text-xs text-text-sub dark:text-slate-400">Giờ khám</p><p className="font-medium text-sm">{bookingData.time}</p></div>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600"><span className="material-symbols-outlined">child_care</span></div>
                <div><p className="text-xs text-text-sub dark:text-slate-400">Bệnh nhi</p><p className="font-medium text-sm">{child.name}</p></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600"><span className="material-symbols-outlined">payments</span></div>
                <div><p className="text-xs text-text-sub dark:text-slate-400">Phí tư vấn</p><p className="font-bold text-primary text-base">{bookingData.price?.toLocaleString('vi-VN')}đ</p></div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 mt-2 mb-4 opacity-70">
          <span className="material-symbols-outlined text-[16px] text-green-600">lock</span>
          <p className="text-xs text-text-sub dark:text-slate-400">Thông tin của bạn được bảo mật an toàn</p>
        </div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 pt-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="flex-1 py-3 px-4 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Hủy bỏ</button>
          <button 
            onClick={handleConfirm} 
            className="flex-[2] py-3 px-4 rounded-lg bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Xác nhận đặt lịch</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
