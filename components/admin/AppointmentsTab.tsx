
import React, { useState, useMemo } from 'react';
import { MOCK_MEDICAL_HISTORY, MOCK_CHILDREN } from '../../constants';
import { MedicalRecord } from '../../types';

type AppointmentStatus = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

interface AdminAppointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: Exclude<AppointmentStatus, 'All'>;
  price: string;
}

const AppointmentsTab: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus>('All');
  const [filterDate, setFilterDate] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const [appointments] = useState<AdminAppointment[]>([
    { id: 'APT001', patient: 'Bé Bi', doctor: 'BS. Nguyễn Văn An', date: '2023-12-08', time: '09:30 AM', status: 'Completed', price: '350.000đ' },
    { id: 'APT002', patient: 'Bé Bông', doctor: 'BS. Trần Thị Bích', date: '2023-12-08', time: '10:45 AM', status: 'Pending', price: '300.000đ' },
    { id: 'APT003', patient: 'Bé Sóc', doctor: 'BS. Hoàng My', date: '2023-12-09', time: '02:00 PM', status: 'Confirmed', price: '350.000đ' },
    { id: 'APT004', patient: 'Bé Tít', doctor: 'BS. Nguyễn Văn An', date: '2023-12-09', time: '04:15 PM', status: 'Cancelled', price: '350.000đ' },
    { id: 'APT005', patient: 'Bé Na', doctor: 'BS. Lê Thị Thu', date: '2023-12-10', time: '08:30 AM', status: 'Pending', price: '500.000đ' },
    { id: 'APT006', patient: 'Bé Su', doctor: 'BS. Phạm Nam', date: '2023-12-10', time: '11:00 AM', status: 'Confirmed', price: '400.000đ' },
  ]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchStatus = filterStatus === 'All' || apt.status === filterStatus;
      const matchDate = !filterDate || apt.date === filterDate;
      return matchStatus && matchDate;
    });
  }, [appointments, filterStatus, filterDate]);

  const handleViewRecord = (patientName: string) => {
    // Tìm childId từ tên bệnh nhi
    const child = MOCK_CHILDREN.find(c => c.name.includes(patientName));
    if (child) {
      // Tìm bản ghi y tế gần nhất của bé đó
      const record = MOCK_MEDICAL_HISTORY.find(h => h.childId === child.id);
      if (record) {
        setSelectedRecord(record);
      } else {
        alert("Hiện chưa có dữ liệu bệnh án cho ca khám này.");
      }
    }
  };

  const statusOptions: { id: AppointmentStatus; label: string; color: string }[] = [
    { id: 'All', label: 'Tất cả', color: 'bg-slate-100 text-slate-600' },
    { id: 'Pending', label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-600' },
    { id: 'Confirmed', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-600' },
    { id: 'Completed', label: 'Hoàn thành', color: 'bg-green-100 text-green-600' },
    { id: 'Cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-black text-lg tracking-tight mb-1">Bộ lọc điều phối</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quản lý và cập nhật trạng thái lịch hẹn</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-sm">calendar_month</span>
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              />
            </div>
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')}
                className="size-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilterStatus(opt.id)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                filterStatus === opt.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-6">Mã LH</th>
                <th className="px-6 py-6">Bệnh nhi</th>
                <th className="px-6 py-6">Bác sĩ</th>
                <th className="px-6 py-6">Ngày khám</th>
                <th className="px-6 py-6 text-center">Trạng thái</th>
                <th className="px-6 py-6 text-right">Doanh thu</th>
                <th className="px-6 py-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-5 font-black text-slate-400 group-hover:text-primary transition-colors">{apt.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">child_care</span>
                        </div>
                        <span className="font-black text-slate-800 dark:text-white">{apt.patient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-600 dark:text-slate-300">{apt.doctor}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-500">
                          {apt.date.split('-').reverse().join('/')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{apt.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border ${
                          apt.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/10 dark:border-green-800' :
                          apt.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/10 dark:border-orange-800' :
                          apt.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800' : 
                          'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:border-red-800'
                        }`}>
                          {apt.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="font-black text-primary text-sm">{apt.price}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        disabled={apt.status !== 'Completed'}
                        onClick={() => handleViewRecord(apt.patient)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          apt.status === 'Completed' 
                          ? 'bg-slate-900 dark:bg-slate-800 text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800/50 dark:text-slate-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                        Hồ sơ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <span className="material-symbols-outlined text-7xl">event_busy</span>
                      <p className="font-black text-slate-900 dark:text-white">Không tìm thấy lịch hẹn nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex justify-end gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
        <p>Tổng ca hiển thị: <span className="text-slate-900 dark:text-white">{filteredAppointments.length}</span></p>
        <p>Tổng doanh thu dự tính: <span className="text-primary">{(filteredAppointments.length * 350000).toLocaleString('vi-VN')}đ</span></p>
      </div>

      {/* Medical Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">medical_information</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">Chi tiết Bệnh án</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mã hồ sơ: #{selectedRecord.id.toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="size-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-8 overflow-y-auto no-scrollbar space-y-8 flex-1">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Bệnh nhi</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {MOCK_CHILDREN.find(c => c.id === selectedRecord.childId)?.name}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Ngày khám</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{selectedRecord.date}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-red-50/50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/20">
                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">stethoscope</span> CHẨN ĐOÁN
                </h4>
                <p className="text-lg font-black text-red-600 dark:text-red-400">{selectedRecord.diagnosis}</p>
                <div className="h-px bg-red-100 dark:bg-red-900/20 my-4"></div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{selectedRecord.recommendation}"
                </p>
              </div>

              {/* Prescription */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">pill</span> ĐƠN THUỐC ĐÃ KÊ
                </h4>
                <div className="space-y-3">
                  {selectedRecord.prescriptions.map((pill, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{pill.medicineName}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{pill.instruction}</p>
                      </div>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[10px] font-black rounded-lg uppercase">
                        {pill.dosage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
              <button 
                onClick={() => setSelectedRecord(null)}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                ĐÓNG BỆNH ÁN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;
