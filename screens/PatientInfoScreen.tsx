
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChildProfile } from '../types';

interface PatientInfoScreenProps {
  onNext: (child: ChildProfile) => void;
}

const PatientInfoScreen: React.FC<PatientInfoScreenProps> = ({ onNext }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Bé Bi',
    dob: '2021-05-15',
    guardian: 'Chị Thu Thảo'
  });

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleNext = () => {
    const child: ChildProfile = {
      id: Date.now(),
      name: formData.name,
      birthDate: formData.dob,
      age: calculateAge(formData.dob)
    };
    onNext(child);
    navigate('/confirmation');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen w-full flex flex-col font-display antialiased overflow-x-hidden text-text-main dark:text-gray-100 max-w-md mx-auto shadow-2xl pb-32">
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between w-full">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors group">
            <span className="material-symbols-outlined text-text-main dark:text-white group-active:scale-90 transition-transform">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">Thông tin Bệnh nhân</h2>
        </div>
      </header>
      
      <div className="w-full bg-background-light dark:bg-background-dark pt-4 pb-2">
        <div className="flex w-full flex-row items-center justify-center gap-2 max-w-[480px] mx-auto">
          <div className="h-1.5 w-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="h-1.5 w-8 rounded-full bg-primary shadow-sm shadow-blue-400/50"></div>
          <div className="h-1.5 w-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>
        <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">Bước 2/3: Nhập thông tin</p>
      </div>

      <main className="flex-1 w-full max-w-[480px] mx-auto px-4">
        <section className="mt-6">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined">child_care</span></div>
            <h3 className="text-lg font-bold leading-tight tracking-tight">Thông tin Bệnh nhi</h3>
          </div>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col w-full group">
              <p className="text-sm font-medium leading-normal pb-2 text-slate-700 dark:text-slate-300 ml-1">Họ và tên bé <span className="text-red-500">*</span></p>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-main dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base font-normal leading-normal transition-all" 
                placeholder="Ví dụ: Nguyễn Văn An" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </label>
            <div className="flex gap-3">
              <label className="flex flex-col flex-[2] min-w-0">
                <p className="text-sm font-medium leading-normal pb-2 text-slate-700 dark:text-slate-300 ml-1">Ngày sinh <span className="text-red-500">*</span></p>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 rounded-xl text-text-main dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-14 px-4 text-base font-normal leading-normal transition-all" 
                  type="date" 
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </label>
              <label className="flex flex-col flex-1 min-w-0">
                <p className="text-sm font-medium leading-normal pb-2 text-slate-700 dark:text-slate-300 ml-1">Tuổi</p>
                <div className="flex items-center justify-center h-14 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-base font-bold">
                  {calculateAge(formData.dob)}
                </div>
              </label>
            </div>
          </div>
        </section>
        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-8"></div>
        <section>
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary"><span className="material-symbols-outlined">supervisor_account</span></div>
            <h3 className="text-lg font-bold leading-tight tracking-tight">Thông tin Phụ huynh</h3>
          </div>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col w-full">
              <p className="text-sm font-medium leading-normal pb-2 text-slate-700 dark:text-slate-300 ml-1">Người giám hộ <span className="text-red-500">*</span></p>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">person</span></div>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-main dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-slate-500 pl-11 pr-4 text-base font-normal leading-normal transition-all" 
                  placeholder="Họ và tên phụ huynh" 
                  value={formData.guardian}
                  onChange={(e) => setFormData({...formData, guardian: e.target.value})}
                />
              </div>
            </label>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe pt-4 px-4">
        <div className="w-full pb-6">
          <button 
            onClick={handleNext} 
            className="w-full h-14 bg-primary hover:bg-sky-500 active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 text-white font-bold text-lg shadow-lg shadow-blue-500/30 dark:shadow-blue-900/20"
          >
            <span>Tiếp tục</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PatientInfoScreen;
