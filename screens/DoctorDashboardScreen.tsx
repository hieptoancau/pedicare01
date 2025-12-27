
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MEDICAL_HISTORY, MOCK_CHILDREN } from '../constants';
import { MedicalRecord, ChildProfile } from '../types';

type DoctorView = 'appointments' | 'patients' | 'record-detail' | 'patient-detail';

const DoctorDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DoctorView>('appointments');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  // Giả lập danh sách lịch hẹn hôm nay của bác sĩ
  const todayAppointments = [
    { id: '1', childId: 1, childName: 'Bé Bi', time: '09:30 AM', reason: 'Khám ho, sốt', status: 'waiting' },
    { id: '2', childId: 2, childName: 'Bé Bông', time: '10:45 AM', reason: 'Tư vấn dinh dưỡng', status: 'waiting' },
    { id: '3', childId: 1, childName: 'Bé Tèo (Demo)', time: '02:00 PM', reason: 'Khám tổng quát', status: 'confirmed' },
  ];

  const handlePatientClick = (childId: number) => {
    const child = MOCK_CHILDREN.find(c => c.id === childId);
    if (child) {
      setSelectedChild(child);
      setActiveTab('patient-detail');
    }
  };

  const renderHeader = () => (
    <div className="bg-primary p-6 pb-12 rounded-b-[40px] shadow-lg relative z-10">
      <div className="flex justify-between items-start text-white mb-6">
        <div onClick={() => navigate('/profile')} className="cursor-pointer">
          <p className="text-white/80 text-sm font-medium">Chào bác sĩ,</p>
          <h1 className="text-2xl font-bold">BS. Nguyễn Văn An</h1>
        </div>
        <button onClick={() => navigate('/profile')} className="size-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
          <span className="material-symbols-outlined text-white">logout</span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Lịch hẹn hôm nay</p>
          <p className="text-white text-2xl font-bold">03</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Đã hoàn thành</p>
          <p className="text-white text-2xl font-bold">12</p>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="flex px-4 -mt-6 relative z-20">
      <div className="flex w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-1 border border-slate-100 dark:border-slate-700">
        <button 
          onClick={() => setActiveTab('appointments')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'appointments' || activeTab === 'patient-detail' ? 'bg-primary text-white shadow-md' : 'text-slate-500'}`}
        >
          Lịch khám
        </button>
        <button 
          onClick={() => setActiveTab('patients')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'patients' || activeTab === 'record-detail' ? 'bg-primary text-white shadow-md' : 'text-slate-500'}`}
        >
          Tất cả bệnh nhi
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark max-w-md mx-auto shadow-2xl relative overflow-hidden pb-10">
      {(activeTab === 'appointments' || activeTab === 'patients') && renderHeader()}
      {(activeTab === 'appointments' || activeTab === 'patients') && renderTabs()}

      <div className={`flex-1 overflow-y-auto p-4 ${activeTab === 'patient-detail' || activeTab === 'record-detail' ? 'pt-4' : 'pt-6'}`}>
        
        {/* VIEW: TODAY APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="flex flex-col gap-4">
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider px-2">Danh sách bệnh nhi chờ khám</h3>
            {todayAppointments.map(apt => (
              <button 
                key={apt.id} 
                onClick={() => handlePatientClick(apt.childId)}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-primary transition-all text-left w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-2xl">child_care</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{apt.childName}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {apt.time} • {apt.reason}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg">Đang chờ</span>
                   <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* VIEW: PATIENT DETAIL & HISTORY */}
        {activeTab === 'patient-detail' && selectedChild && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setActiveTab('appointments')}
                className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h2 className="text-lg font-bold">Hồ sơ chi tiết bệnh nhi</h2>
              <div className="size-10"></div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-4xl">face</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedChild.name}</h3>
                  <p className="text-sm text-slate-500">Mã BN: #PED{selectedChild.id}000</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ngày sinh</p>
                  <p className="text-sm font-bold">{new Date(selectedChild.birthDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tuổi</p>
                  <p className="text-sm font-bold">{selectedChild.age} tuổi</p>
                </div>
              </div>
            </div>

            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider px-2 mb-4">Lịch sử khám tại phòng mạch</h3>
            <div className="flex flex-col gap-3">
              {MOCK_MEDICAL_HISTORY.filter(h => h.childId === selectedChild.id).map(record => (
                <button 
                  key={record.id}
                  onClick={() => { setSelectedRecord(record); setActiveTab('record-detail'); }}
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-left hover:border-primary transition-all flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary">{record.date}</span>
                      <span className="size-1 bg-slate-300 rounded-full"></span>
                      <span className="text-[10px] text-slate-500">{record.doctorName}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{record.diagnosis}</h4>
                  </div>
                  <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                </button>
              ))}
            </div>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
               <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all">
                 BẮT ĐẦU KHÁM MỚI
               </button>
            </div>
          </div>
        )}

        {/* VIEW: ALL PATIENTS SEARCH */}
        {activeTab === 'patients' && (
          <div className="flex flex-col gap-4">
             <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
              <input 
                placeholder="Tìm tên bé hoặc mã hồ sơ..."
                className="w-full bg-white dark:bg-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm border border-slate-100 dark:border-slate-700 focus:border-primary outline-none"
              />
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider px-2">Dữ liệu bệnh nhi hệ thống</h3>
            {MOCK_CHILDREN.map(child => {
              return (
                <div 
                  key={child.id}
                  onClick={() => handlePatientClick(child.id)}
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-400">person</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{child.name}</h4>
                        <p className="text-[10px] text-slate-500">Mã BN: #BN{child.id}99</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW: RECORD DETAIL */}
        {activeTab === 'record-detail' && selectedRecord && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
            <button 
              onClick={() => setActiveTab(selectedChild ? 'patient-detail' : 'patients')}
              className="mb-4 flex items-center gap-1 text-primary text-sm font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Quay lại hồ sơ
            </button>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Chi tiết bệnh án</h3>
                <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">{selectedRecord.date}</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Chuẩn đoán</p>
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                    <p className="text-red-600 dark:text-red-400 font-bold">{selectedRecord.diagnosis}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Lời dặn & Chỉ định</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-slate-200 dark:border-slate-700 pl-4">
                    "{selectedRecord.recommendation}"
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Đơn thuốc chi tiết</p>
                  <div className="flex flex-col gap-2">
                    {selectedRecord.prescriptions.map((p, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{p.medicineName}</p>
                          <p className="text-[10px] font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">{p.dosage}</p>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">info</span>
                          {p.instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom status bar indicator for doctor mode */}
      <div className="px-6 py-2 mt-auto">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-full py-2 px-4 flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-800/30">
          <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">Trực tuyến • Bác sĩ An</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardScreen;
