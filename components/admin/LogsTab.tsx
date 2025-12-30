
import React from 'react';

const LogsTab: React.FC = () => {
  const logs = [
    { id: 1, time: '2023-12-08 14:30', user: 'admin_01', action: 'Khóa tài khoản', target: 'Phạm Văn D', level: 'danger' },
    { id: 2, time: '2023-12-08 14:15', user: 'moderator_x', action: 'Cập nhật giá', target: 'BS. An', level: 'warning' },
    { id: 3, time: '2023-12-08 13:45', user: 'admin_01', action: 'Thay đổi cấu hình', target: 'Cổng thanh toán', level: 'info' },
    { id: 4, time: '2023-12-08 12:20', user: 'system', action: 'Backup dữ liệu', target: 'Toàn hệ thống', level: 'info' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className={`size-2 rounded-full mt-2 ${log.level === 'danger' ? 'bg-red-500' : log.level === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-black text-slate-800 dark:text-white">
                    <span className="text-primary">@{log.user}</span> {log.action}
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold">{log.time}</span>
                </div>
                <p className="text-xs text-slate-500">Đối tượng: {log.target}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogsTab;
