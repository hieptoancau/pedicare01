
import React, { useState, useMemo } from 'react';
import { MOCK_CHILDREN, MOCK_MEDICAL_HISTORY } from '../../constants';
import { ChildProfile, MedicalRecord } from '../../types';

const PatientsDataTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  const filteredChildren = useMemo(() => {
    return MOCK_CHILDREN.filter(child => 
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.id.toString().includes(searchTerm)
    );
  }, [searchTerm]);

  const getChildStats = (childId: number) => {
    const history = MOCK_MEDICAL_HISTORY.filter(h => h.childId === childId);
    return {
      totalExams: history.length,
      lastVisit: history.length > 0 ? history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date : 'Chưa khám'
    };
  };

  const childHistory = useMemo(() => {
    if (!selectedChild) return [];
    return MOCK_MEDICAL_HISTORY.filter(h => h.childId === selectedChild.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedChild]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Stats & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input 
              placeholder="Tìm tên bé hoặc mã BN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm w-full outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
            />
          </div>
          <div className="flex gap-6 px-4">
             <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tổng Bệnh nhi</p>
                <p className="text-2xl font-black text-primary">{MOCK_CHILDREN.length}</p>
             </div>
             <div className="w-px h-10 bg-slate-100 dark:bg-slate-800"></div>
             <div className="text-center">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Tổng lượt khám</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{MOCK_MEDICAL_HISTORY.length}</p>
             </div>
          </div>
        </div>

        <div className="bg-primary rounded-[32px] p-6 text-white shadow-xl shadow-primary/20 flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
            <span className="material-symbols-outlined text-3xl">analytics</span>
          </div>
          <div>
            <h4 className="font-black text-lg leading-tight">Phân tích Bệnh nhi</h4>
            <p className="text-xs text-white/70">Đang theo dõi sự tăng trưởng định kỳ</p>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-6">Mã BN</th>
                <th className="px-6 py-6">Tên Bệnh nhi</th>
                <th className="px-6 py-6 text-center">Tuổi</th>
                <th className="px-6 py-6 text-center">Lượt khám</th>
                <th className="px-6 py-6">Ngày khám gần nhất</th>
                <th className="px-6 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredChildren.map((child) => {
                const stats = getChildStats(child.id);
                return (
                  <tr key={child.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 group transition-colors">
                    <td className="px-6 py-5 font-black text-slate-400">#BN{child.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary font-black">
                          {child.name.charAt(0)}
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">{child.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{child.age} tuổi</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-black">
                        {stats.totalExams}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-medium text-slate-500 text-sm">
                      {stats.lastVisit}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => setSelectedChild(child)}
                        className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 flex items-center gap-2 ml-auto"
                      >
                        <span className="material-symbols-outlined text-[16px]">history</span>
                        Lịch sử khám
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Medical History Modal */}
      {selectedChild && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 h-[85vh] flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">clinical_notes</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{selectedChild.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hồ sơ sức khỏe điện tử • {selectedChild.age} tuổi</p>
                </div>
              </div>
              <button onClick={() => setSelectedChild(null)} className="size-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="space-y-8">
                {childHistory.length > 0 ? (
                  childHistory.map((record, idx) => (
                    <div key={record.id} className="relative pl-12">
                      {/* Timeline Line */}
                      {idx !== childHistory.length - 1 && (
                        <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                      )}
                      
                      {/* Timeline Node */}
                      <div className="absolute left-0 top-0 size-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-primary flex items-center justify-center z-10 shadow-sm">
                        <span className="text-[10px] font-black text-primary">#{childHistory.length - idx}</span>
                      </div>

                      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{record.date}</span>
                            <h4 className="text-lg font-black text-primary">{record.diagnosis}</h4>
                            <p className="text-xs font-bold text-slate-500 mt-1">Khám bởi: {record.doctorName}</p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Mã ca khám</p>
                             <p className="text-xs font-black text-slate-800 dark:text-white">#{record.id.toUpperCase()}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl mb-4 italic text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          "{record.recommendation}"
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {record.prescriptions.map((pill, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl">
                              <div className="size-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                <span className="material-symbols-outlined text-[18px]">pill</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-slate-800 dark:text-white truncate">{pill.medicineName}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase">{pill.dosage}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30">
                     <span className="material-symbols-outlined text-7xl">history</span>
                     <p className="font-black text-lg mt-4 uppercase tracking-widest">Chưa có lịch sử khám</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex gap-4">
              <button 
                onClick={() => setSelectedChild(null)}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black text-sm rounded-2xl active:scale-95 transition-all"
              >
                ĐÓNG LỊCH SỬ
              </button>
              <button 
                className="flex-[2] py-4 bg-primary text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">print</span>
                XUẤT BÁO CÁO Y TẾ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsDataTab;
