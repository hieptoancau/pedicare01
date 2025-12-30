
import React, { useState, useMemo } from 'react';
import { MOCK_DOCTORS, MOCK_MEDICAL_HISTORY, MOCK_CHILDREN } from '../../constants';
import { Doctor } from '../../types';

const DoctorsDataTab: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Lấy danh sách lịch sử khám của bác sĩ hiện tại
  const doctorHistory = useMemo(() => {
    if (!selectedDoctor) return [];
    return MOCK_MEDICAL_HISTORY.filter(h => h.doctorName === selectedDoctor.name);
  }, [selectedDoctor]);

  const getChildName = (childId: number) => {
    return MOCK_CHILDREN.find(c => c.id === childId)?.name || "Bệnh nhi ẩn danh";
  };

  const getDoctorExamCount = (doctorName: string) => {
    return MOCK_MEDICAL_HISTORY.filter(h => h.doctorName === doctorName).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Search & Filter Header (Optional but good for UX) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="font-black text-xl tracking-tight">Danh sách Bác sĩ Hệ thống</h3>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng cộng: {MOCK_DOCTORS.length} bác sĩ</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-6">Bác sĩ</th>
                <th className="px-6 py-6">Chuyên khoa</th>
                <th className="px-6 py-6">Kinh nghiệm</th>
                <th className="px-6 py-6 text-center">Đánh giá</th>
                <th className="px-6 py-6 text-center">Tổng ca khám</th>
                <th className="px-6 py-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {MOCK_DOCTORS.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-inner shrink-0">
                        <img src={doc.image} alt={doc.name} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 dark:text-white truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-tighter">{doc.hospital.split('(')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-primary/10 text-primary uppercase">
                      {doc.specialty.replace('Khoa Nhi - ', '')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{doc.experience}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-yellow-500 text-[16px] filled-icon">star</span>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">{doc.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                      {getDoctorExamCount(doc.name)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => setSelectedDoctor(doc)}
                      className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 ml-auto"
                    >
                      <span className="material-symbols-outlined text-[16px]">history</span>
                      LỊCH SỬ KHÁM BỆNH
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Profile & History Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 h-[85vh] flex flex-col">
            {/* Modal Header/Banner */}
            <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative shrink-0">
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-6 right-6 size-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all z-20"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="px-8 pb-10 -mt-16 relative flex-1 overflow-y-auto no-scrollbar">
              {/* Profile Basic Info */}
              <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
                <div className="size-32 rounded-[40px] border-8 border-white dark:border-slate-900 overflow-hidden bg-white shrink-0 shadow-xl">
                  <img src={selectedDoctor.image} alt={selectedDoctor.name} className="size-full object-cover" />
                </div>
                <div className="flex-1 pb-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedDoctor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase">{selectedDoctor.specialty}</span>
                    <span className="text-slate-400 text-xs font-bold">• {selectedDoctor.experience} kinh nghiệm</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Hài lòng</span>
                  <p className="text-2xl font-black text-yellow-500">{selectedDoctor.rating} ★</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Đã chữa trị</span>
                  <p className="text-2xl font-black text-green-500">{selectedDoctor.patients}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Lượt khám</span>
                  <p className="text-2xl font-black text-primary">{doctorHistory.length}</p>
                </div>
              </div>

              {/* Tab Content Areas */}
              <div className="space-y-10">
                {/* Bio Section */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">info</span> GIỚI THIỆU CHUYÊN MÔN
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800">
                    {selectedDoctor.bio}
                  </p>
                </div>

                {/* MEDICAL HISTORY & PRESCRIPTIONS SECTION */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">history</span> HOẠT ĐỘNG KHÁM & KÊ ĐƠN GẦN ĐÂY
                  </h4>
                  <div className="space-y-4">
                    {doctorHistory.length > 0 ? (
                      doctorHistory.slice(0, 5).map((record) => (
                        <div key={record.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[24px] p-5 shadow-sm">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-xl">child_care</span>
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{getChildName(record.childId)}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{record.date}</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 text-[10px] font-black rounded-lg uppercase">
                              {record.diagnosis}
                            </span>
                          </div>
                          
                          <div className="pl-13 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {record.prescriptions.map((pill, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                  <span className="material-symbols-outlined text-green-500 text-[14px]">pill</span>
                                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{pill.medicineName}</span>
                                  <span className="text-[9px] text-slate-400 ml-1">({pill.dosage})</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                              "{record.recommendation}"
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 opacity-30">
                        <span className="material-symbols-outlined text-5xl">event_busy</span>
                        <p className="text-xs font-black mt-2">CHƯA CÓ LỊCH SỬ KHÁM BỆNH</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-12 flex gap-4 sticky bottom-0 bg-white dark:bg-slate-900 pt-4 pb-2">
                <button 
                  onClick={() => setSelectedDoctor(null)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-sm active:scale-95 transition-all"
                >
                  ĐÓNG HỒ SƠ
                </button>
                <button 
                  className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">edit_square</span>
                  CHỈNH SỬA THÔNG TIN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsDataTab;
