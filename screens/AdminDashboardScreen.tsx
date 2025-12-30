
import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import OverviewTab from '../components/admin/OverviewTab';
import UsersTab from '../components/admin/UsersTab';
import DoctorsDataTab from '../components/admin/DoctorsDataTab';
import AppointmentsTab from '../components/admin/AppointmentsTab';
import PatientsDataTab from '../components/admin/PatientsDataTab';
import LogsTab from '../components/admin/LogsTab';
import SettingsTab from '../components/admin/SettingsTab';

type AdminTab = 'overview' | 'users' | 'data' | 'patientsData' | 'appointments' | 'analytics' | 'logs' | 'settings';

const AdminDashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'users':
        return <UsersTab />;
      case 'data':
        return <DoctorsDataTab />;
      case 'patientsData':
        return <PatientsDataTab />;
      case 'appointments':
        return <AppointmentsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'logs':
        return <LogsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  const getTabTitle = (tab: AdminTab) => {
    const titles: Record<AdminTab, string> = {
      overview: 'Tổng quan Hệ thống',
      users: 'Quản lý Tài khoản',
      data: 'Cơ sở Dữ liệu Bác sĩ',
      patientsData: 'Dữ liệu Bệnh nhân',
      appointments: 'Điều phối Lịch hẹn',
      analytics: 'Báo cáo Chiến lược',
      logs: 'Nhật ký Truy vết',
      settings: 'Cài đặt Hệ thống'
    };
    return titles[tab];
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background-dark overflow-hidden font-display antialiased">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            {getTabTitle(activeTab)}
          </h2>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">Quản trị viên</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">PediCare Admin</p>
             </div>
             <div className="size-10 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary">
               <span className="material-symbols-outlined filled-icon">verified_user</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 no-scrollbar bg-slate-50 dark:bg-background-dark">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
