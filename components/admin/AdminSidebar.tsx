
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Tổng quan', icon: 'dashboard' },
    { id: 'users', label: 'Người dùng', icon: 'group' },
    { id: 'data', label: 'Dữ liệu Bác sĩ', icon: 'stethoscope' },
    { id: 'patientsData', label: 'Bệnh nhân', icon: 'child_care' },
    { id: 'appointments', label: 'Lịch hẹn', icon: 'event_note' },
    { id: 'analytics', label: 'Thống kê', icon: 'monitoring' },
    { id: 'logs', label: 'Nhật ký', icon: 'history' },
    { id: 'settings', label: 'Cài đặt', icon: 'settings' },
  ];

  return (
    <div className="w-16 md:w-64 bg-slate-900 h-screen flex flex-col border-r border-slate-800 transition-all shrink-0">
      <div className="p-4 md:p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white">admin_panel_settings</span>
        </div>
        <span className="hidden md:block font-bold text-white text-xl tracking-tight">PediAdmin</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 mt-auto">
        <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
          <span className="material-symbols-outlined">logout</span>
          <span className="hidden md:block font-medium">Thoát Admin</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
