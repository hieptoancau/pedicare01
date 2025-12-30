
import React from 'react';

const OverviewTab: React.FC = () => {
  const stats = [
    { label: 'Người dùng mới', value: '1,284', trend: '+12%', icon: 'group', color: 'bg-blue-500', shadow: 'shadow-blue-200' },
    { label: 'Doanh thu tháng', value: '450M', trend: '+8.5%', icon: 'payments', color: 'bg-green-500', shadow: 'shadow-green-200' },
    { label: 'Lịch hẹn mới', value: '342', trend: '+15%', icon: 'calendar_today', color: 'bg-purple-500', shadow: 'shadow-purple-200' },
    { label: 'Tỷ lệ hài lòng', value: '98%', trend: '+1%', icon: 'star', color: 'bg-yellow-500', shadow: 'shadow-yellow-200' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`size-12 rounded-2xl ${s.color} flex items-center justify-center text-white shadow-lg ${s.shadow}`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-green-500 text-xs font-black">{s.trend}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">vs tháng trước</span>
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
            <h4 className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black mb-6">Hoạt động gần đây</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                </div>
                <div className="flex-1 border-b border-slate-50 dark:border-slate-800 pb-4">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">BS. Nguyễn Văn An vừa hoàn thành ca khám #4221</p>
                  <p className="text-[10px] text-slate-400 font-medium">10 phút trước • Hệ thống khám bệnh</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-primary rounded-[32px] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 size-48 bg-white/10 rounded-full blur-3xl"></div>
          <h3 className="text-xl font-black mb-2">Thông báo Admin</h3>
          <p className="text-sm text-white/80 leading-relaxed mb-6">Hệ thống sẽ bảo trì định kỳ vào 02:00 sáng Chủ Nhật tuần này. Vui lòng thông báo cho các bác sĩ.</p>
          <button className="w-full py-3 bg-white text-primary rounded-xl font-black text-sm shadow-lg">GỬI THÔNG BÁO NGAY</button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
