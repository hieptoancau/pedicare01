
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { Appointment } from '../types';
import { MOCK_DOCTORS } from '../constants';

interface HistoryScreenProps {
  appointments: Appointment[];
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ appointments }) => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col group/design-root overflow-x-hidden pb-24 bg-background-light dark:bg-background-dark max-w-md mx-auto shadow-2xl">
      <div className="sticky top-0 z-50 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800">
        <div onClick={() => navigate('/')} className="text-text-main dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Lịch sử Đặt Lịch</h2>
      </div>

      <div className="flex px-4 py-3 sticky top-[60px] z-40 bg-background-light dark:bg-background-dark">
        <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 p-1">
          <div className="flex-1 text-center py-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-primary font-semibold text-sm">Sắp tới</div>
          <div className="flex-1 text-center py-2 text-text-sub font-medium text-sm">Đã qua</div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-sub">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">calendar_today</span>
            <p>Bạn chưa có lịch hẹn nào</p>
          </div>
        ) : (
          appointments.map((apt) => {
            const doctor = MOCK_DOCTORS.find(d => d.id === apt.doctorId);
            return (
              <div key={apt.id} className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                    <p className="text-text-main dark:text-white text-sm font-bold">{apt.date}</p>
                  </div>
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${apt.status === 'upcoming' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                    {apt.status === 'upcoming' ? 'Sắp tới' : 'Hoàn thành'}
                  </span>
                </div>
                <div className="flex items-start gap-4 pt-1">
                  <div className="relative shrink-0">
                    <div className="size-16 rounded-xl bg-slate-200 dark:bg-slate-700 bg-center bg-cover shadow-inner" style={{backgroundImage: `url("${doctor?.image}")`}}></div>
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h3 className="text-text-main dark:text-white text-base font-bold leading-tight truncate">{doctor?.name}</h3>
                    <p className="text-text-sub dark:text-slate-400 text-xs font-normal truncate">{doctor?.specialty} - {doctor?.hospital}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-text-sub text-[16px]">child_care</span>
                      <p className="text-text-main dark:text-white text-xs font-medium">Bé: Bi</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 pt-2 mt-1">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                    <span className="text-text-main dark:text-white text-sm font-bold">{apt.time}</span>
                  </div>
                  <div className="flex gap-2 flex-1 justify-end">
                    <button className="flex items-center justify-center size-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"><span className="material-symbols-outlined text-[20px]">close</span></button>
                    <button className="flex flex-1 max-w-[140px] items-center justify-center rounded-xl h-10 px-4 bg-primary hover:bg-sky-500 text-white gap-2 text-sm font-bold shadow-sm shadow-primary/30 transition-colors"><span>Chi tiết</span></button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <BottomNav active="calendar" />
    </div>
  );
};

export default HistoryScreen;
