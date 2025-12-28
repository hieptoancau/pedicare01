
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_DOCTORS, MOCK_MEDICAL_HISTORY, MOCK_CHILDREN } from '../constants';
import { Doctor, MedicalRecord, ChildProfile } from '../types';
import { GoogleGenAI } from "@google/genai";

type AdminTab = 'overview' | 'users' | 'data' | 'appointments' | 'analytics' | 'logs' | 'settings';
type DataSubView = 'doctor-list' | 'doctor-history' | 'record-detail';
type AppointmentSubView = 'list' | 'detail' | 'patient-history' | 'patient-record-detail';

interface AdminAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

interface UserAccount {
  id: number;
  name: string;
  role: 'Admin' | 'Bác sĩ' | 'Phụ huynh';
  status: 'Active' | 'Blocked';
  email: string;
}

interface SystemLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  level: 'info' | 'warning' | 'danger';
}

const AdminDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // AI Insights State
  const [aiInsight, setAiInsight] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // States for Appointments
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [aptSubView, setAptSubView] = useState<AppointmentSubView>('list');
  const [selectedApt, setSelectedApt] = useState<AdminAppointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<ChildProfile | null>(null);
  const [selectedPatientRecord, setSelectedPatientRecord] = useState<MedicalRecord | null>(null);

  // States for Data/Doctors
  const [dataSubView, setDataSubView] = useState<DataSubView>('doctor-list');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // States for Users Tab
  const [users, setUsers] = useState<UserAccount[]>([
    { id: 1, name: 'Nguyễn Văn A', role: 'Phụ huynh', status: 'Active', email: 'a.nguyen@gmail.com' },
    { id: 2, name: 'Trần Thị B', role: 'Bác sĩ', status: 'Active', email: 'b.tran@doctor.com' },
    { id: 3, name: 'Lê Văn C', role: 'Admin', status: 'Active', email: 'c.le@admin.com' },
    { id: 4, name: 'Phạm Văn D', role: 'Phụ huynh', status: 'Blocked', email: 'd.pham@gmail.com' },
  ]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [newUser, setNewUser] = useState<Partial<UserAccount>>({ name: '', email: '', role: 'Phụ huynh', status: 'Active' });

  // States for Logs Tab
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logLevelFilter, setLogLevelFilter] = useState<string>('all');
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
    { id: 1, timestamp: '2023-12-08 14:30:22', user: 'admin_01', action: 'Khóa tài khoản', target: 'user_122 (Phạm Văn D)', level: 'danger' },
    { id: 2, timestamp: '2023-12-08 14:15:10', user: 'moderator_x', action: 'Cập nhật bác sĩ', target: 'BS. Nguyễn Văn An', level: 'info' },
    { id: 3, timestamp: '2023-12-08 13:45:05', user: 'admin_01', action: 'Thay đổi cấu hình', target: 'Hệ thống thanh toán', level: 'warning' },
    { id: 4, timestamp: '2023-12-08 12:20:15', user: 'system', action: 'Backup dữ liệu', target: 'Cloud Storage', level: 'info' },
    { id: 5, timestamp: '2023-12-08 11:05:40', user: 'BS. Trần Thị Bích', action: 'Đăng nhập', target: 'Dashboard Bác sĩ', level: 'info' },
    { id: 6, timestamp: '2023-12-08 10:30:00', user: 'admin_01', action: 'Xóa lịch hẹn', target: 'APT009', level: 'warning' },
    { id: 7, timestamp: '2023-12-08 09:15:22', user: 'system', action: 'Cảnh báo bảo mật', target: 'IP 192.168.1.105', level: 'danger' },
  ]);

  const stats = [
    { label: 'Người dùng mới', value: '1,284', trend: '+12%', icon: 'group', color: 'bg-blue-500' },
    { label: 'Doanh thu tháng', value: '450M', trend: '+8.5%', icon: 'payments', color: 'bg-green-500' },
    { label: 'Lịch hẹn mới', value: '342', trend: '+15%', icon: 'calendar_today', color: 'bg-purple-500' },
    { label: 'Tỷ lệ hài lòng', value: '98%', trend: '+1%', icon: 'star', color: 'bg-yellow-500' },
  ];

  const [mockAppointments, setMockAppointments] = useState<AdminAppointment[]>([
    { id: 'APT001', patientName: 'Bé Bi', doctorName: 'BS. Nguyễn Văn An', date: '2023-11-20', time: '09:30 AM', status: 'completed', price: 350000 },
    { id: 'APT002', patientName: 'Bé Bông', doctorName: 'BS. Trần Thị Bích', date: '2023-12-07', time: '10:45 AM', status: 'pending', price: 300000 },
    { id: 'APT003', patientName: 'Bé Tít', doctorName: 'BS. Nguyễn Văn An', date: '2023-12-08', time: '02:00 PM', status: 'pending', price: 350000 },
    { id: 'APT004', patientName: 'Bé Na', doctorName: 'BS. Trần Thị Bích', date: '2023-12-06', time: '08:00 AM', status: 'confirmed', price: 300000 },
    { id: 'APT005', patientName: 'Bé Sóc', doctorName: 'BS. Nguyễn Văn An', date: '2023-12-06', time: '04:30 PM', status: 'cancelled', price: 350000 },
  ]);

  // --- GENERIC EXPORT FUNCTION ---
  const downloadCSV = (filename: string, headers: string[], data: string[][]) => {
    const BOM = '\uFEFF';
    const csvRows = [headers.join(','), ...data.map(row => row.join(','))];
    const csvString = BOM + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- LOG FILTERING ---
  const filteredLogs = useMemo(() => {
    return systemLogs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(logSearchTerm.toLowerCase()) || 
                           log.user.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                           log.target.toLowerCase().includes(logSearchTerm.toLowerCase());
      const matchesLevel = logLevelFilter === 'all' || log.level === logLevelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [systemLogs, logSearchTerm, logLevelFilter]);

  // --- EXPORT LOGS ---
  const handleExportLogs = () => {
    if (filteredLogs.length === 0) return alert("Không có dữ liệu.");
    const headers = ['Thời gian', 'Người dùng', 'Hành động', 'Đối tượng', 'Mức độ'];
    const data = filteredLogs.map(log => [
      `"${log.timestamp}"`, `"${log.user}"`, `"${log.action}"`, `"${log.target}"`, `"${log.level.toUpperCase()}"`
    ]);
    downloadCSV(`SystemLogs_${new Date().toISOString().slice(0,10)}.csv`, headers, data);
  };

  // --- EXPORT USERS ---
  const handleExportUsers = () => {
    const headers = ['ID', 'Tên người dùng', 'Email', 'Vai trò', 'Trạng thái'];
    const data = users.map(u => [
      `"${u.id}"`, `"${u.name}"`, `"${u.email}"`, `"${u.role}"`, `"${u.status}"`
    ]);
    downloadCSV(`UsersList_${new Date().toISOString().slice(0,10)}.csv`, headers, data);
  };

  // --- EXPORT APPOINTMENTS ---
  const handleExportAppointments = () => {
    const headers = ['Mã lịch', 'Bệnh nhi', 'Bác sĩ', 'Ngày', 'Giờ', 'Trạng thái', 'Giá'];
    const data = mockAppointments.map(a => [
      `"${a.id}"`, `"${a.patientName}"`, `"${a.doctorName}"`, `"${a.date}"`, `"${a.time}"`, `"${a.status}"`, `"${a.price}"`
    ]);
    downloadCSV(`Appointments_${new Date().toISOString().slice(0,10)}.csv`, headers, data);
  };

  // --- EXPORT DATA ---
  const handleExportData = () => {
    if (dataSubView === 'doctor-list') {
      const headers = ['ID', 'Bác sĩ', 'Chuyên khoa', 'Bệnh viện', 'Kinh nghiệm'];
      const data = MOCK_DOCTORS.map(d => [
        `"${d.id}"`, `"${d.name}"`, `"${d.specialty}"`, `"${d.hospital}"`, `"${d.experience}"`
      ]);
      downloadCSV(`DoctorsList_${new Date().toISOString().slice(0,10)}.csv`, headers, data);
    }
  };

  const handleClearAllLogs = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ nhật ký hệ thống?")) {
      setSystemLogs([]);
    }
  };

  // --- AI ANALYTICS ---
  const handleAIAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const statsSummary = `
        Tổng người dùng: 1284. Doanh thu: 450M. Lịch hẹn mới: 342. 
        Top chuyên khoa: Hô hấp (40%), Dinh dưỡng (25%), Tâm lý (20%), Khác (15%).
        Tỷ lệ hủy: 5%. Tỷ lệ hài lòng: 98%.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Bạn là một chuyên gia phân tích dữ liệu y tế. Dựa trên số liệu sau của hệ thống PediCare: ${statsSummary}, hãy đưa ra 3 nhận xét ngắn gọn về tình hình vận hành và 1 dự báo/đề xuất cho tháng tới. Output bằng Tiếng Việt, định dạng Markdown.`,
      });
      setAiInsight(response.text || "Không thể tải phân tích.");
    } catch (error) {
      setAiInsight("Lỗi kết nối AI. Vui lòng kiểm tra API Key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- USER ACTIONS ---
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                            u.email.toLowerCase().includes(userSearchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearchTerm, roleFilter]);

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u));
  };

  const openAddUser = () => {
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'Phụ huynh', status: 'Active' });
    setIsUserModalOpen(true);
  };

  const openEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setNewUser(user);
    setIsUserModalOpen(true);
  };

  const deleteUser = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSaveUser = () => {
    if (!newUser.name || !newUser.email) return;

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...newUser } as UserAccount : u));
    } else {
      const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { ...newUser, id } as UserAccount]);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'Phụ huynh', status: 'Active' });
  };

  // --- APPOINTMENT ACTIONS ---
  const handleViewAptDetail = (apt: AdminAppointment) => {
    setSelectedApt(apt);
    setAptSubView('detail');
  };

  const handleViewPatientHistory = () => {
    const patientName = selectedApt?.patientName || '';
    const patient = MOCK_CHILDREN.find(c => patientName.includes(c.name.split(' ')[0]));
    if (patient) {
      setSelectedPatient(patient);
      setAptSubView('patient-history');
    } else {
      alert("Không tìm thấy hồ sơ y tế cho bệnh nhi này.");
    }
  };

  const handleViewPatientRecordDetail = (record: MedicalRecord) => {
    setSelectedPatientRecord(record);
    setAptSubView('patient-record-detail');
  };

  // --- DOCTOR ACTIONS ---
  const handleDoctorClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setDataSubView('doctor-history');
  };

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setDataSubView('record-detail');
  };

  // --- OTHER ACTIONS ---
  const updateAppointmentStatus = (id: string, status: AdminAppointment['status']) => {
    setMockAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status } : apt));
  };

  const filteredAppointments = mockAppointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesDate = !dateFilter || apt.date === dateFilter;
    const matchesSearch = !searchTerm || apt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDate && matchesSearch;
  });

  const renderSidebar = () => (
    <div className="w-16 md:w-64 bg-slate-900 h-screen flex flex-col border-r border-slate-800 transition-all shrink-0 overflow-y-auto no-scrollbar">
      <div className="p-4 md:p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white">admin_panel_settings</span>
        </div>
        <span className="hidden md:block font-bold text-white text-xl tracking-tight">PediAdmin</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {[
          { id: 'overview', label: 'Tổng quan', icon: 'dashboard' },
          { id: 'users', label: 'Người dùng', icon: 'group' },
          { id: 'data', label: 'Dữ liệu Bác sĩ', icon: 'stethoscope' },
          { id: 'appointments', label: 'Lịch hẹn', icon: 'event_note' },
          { id: 'analytics', label: 'Thống kê', icon: 'monitoring' },
          { id: 'logs', label: 'Nhật ký', icon: 'history' },
          { id: 'settings', label: 'Cài đặt', icon: 'settings' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { 
              setActiveTab(item.id as AdminTab); 
              setDataSubView('doctor-list');
              setAptSubView('list');
              setSearchTerm('');
              setUserSearchTerm('');
              setLogSearchTerm('');
            }}
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
        <button 
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="hidden md:block font-medium">Thoát Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background-dark overflow-hidden font-display antialiased text-slate-900 dark:text-white">
      {renderSidebar()}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold capitalize">
            {activeTab === 'analytics' ? 'Thống kê chi tiết' : 
             activeTab === 'users' ? 'Quản lý người dùng' : 
             activeTab === 'appointments' ? (
                aptSubView === 'detail' ? 'Chi tiết lịch hẹn' :
                aptSubView === 'patient-history' ? 'Lịch sử y tế bệnh nhi' :
                aptSubView === 'patient-record-detail' ? 'Chi tiết bệnh án cũ' :
                'Quản lý lịch hẹn'
             ) :
             activeTab === 'data' ? 'Dữ liệu Bác sĩ' : activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Quản trị viên</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Full Access</p>
              </div>
              <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-primary transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`size-12 rounded-2xl ${s.color} flex items-center justify-center text-white shadow-lg`}>
                        <span className="material-symbols-outlined">{s.icon}</span>
                      </div>
                      <span className="text-green-500 text-sm font-bold">{s.trend}</span>
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
                    <h4 className="text-2xl font-bold">{s.value}</h4>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold">Biểu đồ tăng trưởng người dùng</h3>
                    <select className="text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-lg">
                      <option>7 ngày qua</option>
                      <option>30 ngày qua</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2 pt-4 px-2">
                    {[60, 40, 80, 50, 90, 70, 100].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-primary/20 group-hover:bg-primary rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
                        <span className="text-[10px] text-slate-400">T{i+2}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold mb-4">Nhật ký mới nhất</h3>
                  <div className="space-y-4">
                    {systemLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex gap-4 items-start pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                        <div className={`size-2 rounded-full mt-2 ${log.level === 'danger' ? 'bg-red-500' : 'bg-primary'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-bold">{log.action}</p>
                          <p className="text-xs text-slate-500">Bởi {log.user}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{log.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                       <span className="material-symbols-outlined text-3xl">event_busy</span>
                    </div>
                    <div>
                       <p className="text-xs text-slate-400 font-bold uppercase">Tỷ lệ hủy lịch</p>
                       <h4 className="text-xl font-bold">4.2%</h4>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-500">
                       <span className="material-symbols-outlined text-3xl">avg_time</span>
                    </div>
                    <div>
                       <p className="text-xs text-slate-400 font-bold uppercase">Thời gian chờ TB</p>
                       <h4 className="text-xl font-bold">12 phút</h4>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                       <span className="material-symbols-outlined text-3xl">receipt_long</span>
                    </div>
                    <div>
                       <p className="text-xs text-slate-400 font-bold uppercase">Giá trị đơn khám TB</p>
                       <h4 className="text-xl font-bold">325,000đ</h4>
                    </div>
                 </div>
              </div>

              {/* AI INSIGHTS CARD */}
              <div className="bg-gradient-to-br from-indigo-500 to-primary p-1 rounded-[32px] shadow-xl shadow-primary/20">
                 <div className="bg-white dark:bg-slate-900 rounded-[28px] p-8">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                             <span className="material-symbols-outlined text-3xl filled-icon">psychology</span>
                          </div>
                          <div>
                             <h3 className="text-xl font-bold">Phân tích Insight bằng AI</h3>
                             <p className="text-xs text-slate-500">Gemini 3 Flash phân tích dữ liệu vận hành thời gian thực</p>
                          </div>
                       </div>
                       <button 
                        onClick={handleAIAnalyze}
                        disabled={isAnalyzing}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                       >
                          {isAnalyzing ? (
                             <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                             <span className="material-symbols-outlined text-lg">auto_awesome</span>
                          )}
                          Phân tích ngay
                       </button>
                    </div>

                    {aiInsight ? (
                       <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border-l-4 border-primary prose dark:prose-invert max-w-none animate-in fade-in slide-in-from-top-2 duration-500">
                          <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                             {aiInsight.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                          </div>
                       </div>
                    ) : (
                       <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                          <span className="material-symbols-outlined text-5xl text-slate-200 mb-2">analytics</span>
                          <p className="text-slate-400 text-sm italic">Nhấn "Phân tích ngay" để xem các nhận xét thông minh về hệ thống của bạn.</p>
                       </div>
                    )}
                 </div>
              </div>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                      <input 
                        placeholder="Tìm theo tên hoặc email..." 
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary transition-all shadow-inner outline-none" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleExportUsers}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all border border-slate-200 dark:border-slate-700"
                      >
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Xuất Excel
                      </button>
                      <button 
                        onClick={openAddUser}
                        className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Thêm người dùng
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Lọc Vai trò:</span>
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      {['all', 'Admin', 'Bác sĩ', 'Phụ huynh'].map(f => (
                        <button 
                          key={f}
                          onClick={() => setRoleFilter(f)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            roleFilter === f ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          {f === 'all' ? 'Tất cả' : f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Tên & Email</th>
                        <th className="px-6 py-4">Vai trò</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold">{u.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                              u.role === 'Admin' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' : 
                              u.role === 'Bác sĩ' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 
                              'bg-slate-100 text-slate-600 dark:bg-slate-800'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`size-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <span className={`text-xs font-bold ${u.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>{u.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => toggleUserStatus(u.id)} 
                              className={`p-2 rounded-lg transition-colors ${u.status === 'Active' ? 'text-orange-400 hover:bg-orange-50' : 'text-green-400 hover:bg-green-50'}`}
                              title={u.status === 'Active' ? 'Khóa' : 'Mở khóa'}
                            >
                              <span className="material-symbols-outlined text-[18px]">{u.status === 'Active' ? 'block' : 'lock_open'}</span>
                            </button>
                            <button 
                              onClick={() => openEditUser(u)}
                              className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Sửa"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button 
                              onClick={() => deleteUser(u.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* USER MODAL */}
              {isUserModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <h3 className="font-bold text-lg">{editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}</h3>
                      <button onClick={() => setIsUserModalOpen(false)} className="size-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Họ và tên</label>
                        <input 
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary"
                          placeholder="Nhập tên..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Email</label>
                        <input 
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary"
                          placeholder="example@gmail.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Vai trò</label>
                          <select 
                            value={newUser.role}
                            onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary"
                          >
                            <option value="Phụ huynh">Phụ huynh</option>
                            <option value="Bác sĩ">Bác sĩ</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Trạng thái</label>
                          <select 
                            value={newUser.status}
                            onChange={(e) => setNewUser({...newUser, status: e.target.value as any})}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary"
                          >
                            <option value="Active">Hoạt động</option>
                            <option value="Blocked">Đang khóa</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 pt-2 flex gap-3">
                      <button 
                        onClick={() => setIsUserModalOpen(false)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                      >
                        Hủy
                      </button>
                      <button 
                        onClick={handleSaveUser}
                        disabled={!newUser.name || !newUser.email}
                        className="flex-[2] py-2.5 rounded-xl text-sm font-bold text-white bg-primary shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all"
                      >
                        Lưu thông tin
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                      <input 
                        placeholder="Tìm hành động, người dùng..." 
                        value={logSearchTerm}
                        onChange={(e) => setLogSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm w-80 shadow-inner outline-none" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleExportLogs} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Xuất Excel
                      </button>
                      <button onClick={handleClearAllLogs} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">
                        <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                        Xóa tất cả
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Mức độ:</span>
                    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      {['all', 'info', 'warning', 'danger'].map(f => (
                        <button 
                          key={f}
                          onClick={() => setLogLevelFilter(f)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            logLevelFilter === f ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          {f === 'all' ? 'Tất cả' : f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Thời gian</th>
                        <th className="px-6 py-4">Người dùng</th>
                        <th className="px-6 py-4">Hành động</th>
                        <th className="px-6 py-4">Mức độ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 text-xs text-slate-500">{log.timestamp}</td>
                          <td className="px-6 py-4 text-sm font-bold text-primary">{log.user}</td>
                          <td className="px-6 py-4 text-sm font-medium">{log.action}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                              log.level === 'danger' ? 'bg-red-50 text-red-600' : 
                              log.level === 'warning' ? 'bg-orange-50 text-orange-600' : 
                              'bg-blue-50 text-blue-600'
                            }`}>
                              {log.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
               {aptSubView === 'list' ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
                          <button 
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${
                              statusFilter === f ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                          >
                            {f === 'all' ? 'Tất cả' : f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button onClick={handleExportAppointments} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Xuất Excel
                      </button>
                      <input 
                        placeholder="Tìm tên bé..." 
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs w-48 shadow-inner focus:ring-1 focus:ring-primary outline-none" 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Bệnh nhi</th>
                          <th className="px-6 py-4">Bác sĩ</th>
                          <th className="px-6 py-4">Ngày</th>
                          <th className="px-6 py-4">Trạng thái</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                        {filteredAppointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                            <td className="px-6 py-4 font-bold">{apt.patientName}</td>
                            <td className="px-6 py-4">{apt.doctorName}</td>
                            <td className="px-6 py-4 text-xs text-slate-500">{apt.date}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                                apt.status === 'confirmed' ? 'bg-green-50 text-green-600' : 
                                apt.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                                apt.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                'bg-orange-50 text-orange-600'
                              }`}>
                                {apt.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleViewAptDetail(apt)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredAppointments.length === 0 && (
                      <div className="py-20 text-center text-slate-400">
                        <p>Không có lịch hẹn nào khớp với bộ lọc.</p>
                      </div>
                    )}
                  </div>
                </div>
               ) : aptSubView === 'detail' ? (
                /* VIEW: APPOINTMENT DETAIL */
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                   <button onClick={() => setAptSubView('list')} className="flex items-center gap-2 text-primary font-bold text-sm mb-6 hover:underline">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span> Quay lại danh sách
                  </button>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full mb-3 inline-block">Mã lịch: {selectedApt?.id}</span>
                            <h3 className="text-2xl font-bold">Thông tin cuộc hẹn</h3>
                          </div>
                          <div className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase ${
                            selectedApt?.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                            selectedApt?.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                            'bg-orange-50 text-orange-600'
                          }`}>
                            {selectedApt?.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Thời gian dự kiến</p>
                             <p className="font-bold text-lg">{selectedApt?.time}</p>
                             <p className="text-xs text-slate-500">{selectedApt?.date}</p>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Trạng thái phí</p>
                             <p className="font-bold text-lg text-primary">{selectedApt?.price.toLocaleString('vi-VN')} đ</p>
                             <p className="text-xs text-green-600 font-bold uppercase">Đã thanh toán</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Summary of Medical Records if completed */}
                      {selectedApt?.status === 'completed' && (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in duration-700">
                           <div className="flex items-center gap-3 mb-6">
                              <div className="size-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                                 <span className="material-symbols-outlined">assignment</span>
                              </div>
                              <h3 className="text-lg font-bold">Kết quả khám lâm sàng</h3>
                           </div>
                           <p className="text-slate-500 italic">Tính năng xem kết quả khám trực tiếp đang được đồng bộ từ dữ liệu bác sĩ...</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Bác sĩ phụ trách</p>
                        <div className="flex items-center gap-4">
                           <img 
                            src={MOCK_DOCTORS.find(d => d.name === selectedApt?.doctorName)?.image || "https://picsum.photos/200"} 
                            className="size-14 rounded-xl object-cover" 
                           />
                           <div>
                              <p className="font-bold">{selectedApt?.doctorName}</p>
                              <p className="text-xs text-primary">{MOCK_DOCTORS.find(d => d.name === selectedApt?.doctorName)?.specialty}</p>
                           </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Thông tin bệnh nhi</p>
                        <div className="flex items-center gap-4 mb-6">
                           <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                              <span className="material-symbols-outlined text-3xl">child_care</span>
                           </div>
                           <div>
                              <p className="font-bold">{selectedApt?.patientName}</p>
                              <p className="text-xs text-slate-500">Bệnh nhi hệ thống</p>
                           </div>
                        </div>
                        <button 
                          onClick={handleViewPatientHistory}
                          className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-95"
                        >
                          Xem hồ sơ y tế đầy đủ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
               ) : aptSubView === 'patient-history' ? (
                /* VIEW: PATIENT HISTORY (FILTERED FROM APPOINTMENTS) */
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                   <button onClick={() => setAptSubView('detail')} className="flex items-center gap-2 text-primary font-bold text-sm mb-6 hover:underline">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span> Quay lại chi tiết lịch hẹn
                  </button>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl">face</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedPatient?.name}</h2>
                        <p className="text-slate-500">{selectedPatient?.age} tuổi • Sinh ngày {selectedPatient?.birthDate}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-4 ml-2">Lịch sử bệnh án lưu trữ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_MEDICAL_HISTORY.filter(h => h.childId === selectedPatient?.id).map(record => (
                      <button 
                        key={record.id}
                        onClick={() => handleViewPatientRecordDetail(record)}
                        className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-left hover:border-primary transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">description</span>
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-primary">{record.date}</p>
                             <h4 className="font-bold">{record.diagnosis}</h4>
                             <p className="text-xs text-slate-500">BS: {record.doctorName}</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary">chevron_right</span>
                      </button>
                    ))}
                  </div>
                </div>
               ) : (
                /* VIEW: PATIENT RECORD DETAIL (FROM HISTORY) */
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
                   <button onClick={() => setAptSubView('patient-history')} className="flex items-center gap-2 text-primary font-bold text-sm mb-6 hover:underline">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span> Quay lại danh sách hồ sơ
                  </button>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-8">
                       <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Mã bệnh án: {selectedPatientRecord?.id}</p>
                          <h2 className="text-2xl font-bold text-red-600">{selectedPatientRecord?.diagnosis}</h2>
                       </div>
                       <div className="text-right">
                          <p className="font-bold">{selectedPatientRecord?.date}</p>
                          <p className="text-xs text-slate-500">Khám tại PediCare</p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Lời dặn của Bác sĩ {selectedPatientRecord?.doctorName}</p>
                          <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-l-4 border-primary italic text-slate-600 dark:text-slate-300">
                            "{selectedPatientRecord?.recommendation}"
                          </div>
                       </div>

                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Danh mục thuốc điều trị</p>
                          <div className="space-y-3">
                             {selectedPatientRecord?.prescriptions.map((p, i) => (
                               <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
                                  <div>
                                     <p className="font-bold">{p.medicineName}</p>
                                     <p className="text-xs text-slate-500">{p.dosage} • {p.instruction}</p>
                                  </div>
                                  <div className="size-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                     <span className="material-symbols-outlined">pill</span>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
               )}
            </div>
          )}

          {/* TAB: DATA MANAGEMENT */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {dataSubView !== 'doctor-list' && (
                    <button 
                      onClick={() => {
                        if (dataSubView === 'record-detail') setDataSubView('doctor-history');
                        else setDataSubView('doctor-list');
                      }}
                      className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      Quay lại {dataSubView === 'record-detail' ? 'lịch sử khám' : 'danh sách bác sĩ'}
                    </button>
                  )}
                </div>
                {dataSubView !== 'record-detail' && (
                  <button onClick={handleExportData} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700">
                    <span className="material-symbols-outlined text-[20px]">download</span> Xuất Excel
                  </button>
                )}
              </div>

              {/* Sub-view: Doctor List */}
              {dataSubView === 'doctor-list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
                  {MOCK_DOCTORS.map(doctor => (
                    <div key={doctor.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group hover:border-primary transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={doctor.image} className="size-16 rounded-2xl object-cover" />
                        <div>
                          <h4 className="font-bold">{doctor.name}</h4>
                          <p className="text-xs text-primary">{doctor.specialty}</p>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 mb-6">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Kinh nghiệm</span>
                          <span className="font-bold">{doctor.experience}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Số ca đã khám</span>
                          <span className="font-bold text-primary">{MOCK_MEDICAL_HISTORY.filter(h => h.doctorName === doctor.name).length}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDoctorClick(doctor)} className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary/90">
                        Xem lịch sử khám
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Sub-view: Doctor Exam History */}
              {dataSubView === 'doctor-history' && selectedDoctor && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={selectedDoctor.image} className="size-14 rounded-xl object-cover" />
                      <div>
                        <h3 className="text-lg font-bold">Lịch sử khám: {selectedDoctor.name}</h3>
                        <p className="text-xs text-slate-500">{selectedDoctor.specialty} • Toàn bộ hồ sơ đã ghi nhận</p>
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold">
                      {MOCK_MEDICAL_HISTORY.filter(h => h.doctorName === selectedDoctor.name).length} Bệnh án
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_MEDICAL_HISTORY.filter(h => h.doctorName === selectedDoctor.name).map(record => {
                      const child = MOCK_CHILDREN.find(c => c.id === record.childId);
                      return (
                        <button 
                          key={record.id}
                          onClick={() => handleRecordClick(record)}
                          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 text-left hover:border-primary transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <span className="material-symbols-outlined text-[20px]">description</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{record.date}</span>
                                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">#{record.id}</span>
                              </div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{child?.name}</h4>
                              <p className="text-xs text-slate-500 italic mt-0.5 truncate max-w-[200px]">{record.diagnosis}</p>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-view: Medical Record Detail */}
              {dataSubView === 'record-detail' && selectedRecord && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full mb-3 inline-block">Hồ sơ bệnh án hệ thống</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedRecord.diagnosis}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedRecord.date}</p>
                        <p className="text-xs text-slate-500">Mã BA: {selectedRecord.id}</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                           <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Bệnh nhi</p>
                           <p className="font-bold">{MOCK_CHILDREN.find(c => c.id === selectedRecord.childId)?.name}</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                           <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Bác sĩ khám</p>
                           <p className="font-bold">{selectedRecord.doctorName}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Chỉ định của bác sĩ</p>
                        <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-l-4 border-primary">
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                            "{selectedRecord.recommendation}"
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Đơn thuốc</p>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedRecord.prescriptions.map((p, i) => (
                            <div key={i} className="p-4 bg-white dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600 shadow-sm flex items-start gap-4">
                              <div className="size-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                <span className="material-symbols-outlined text-[20px]">pill</span>
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">{p.medicineName}</p>
                                <p className="text-xs text-slate-500 font-medium">{p.dosage} • {p.instruction}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 animate-in fade-in duration-500">
              <h3 className="font-bold text-lg mb-6">Cấu hình Hệ thống</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold">Chế độ bảo trì</p>
                    <p className="text-xs text-slate-500">Khóa truy cập người dùng</p>
                  </div>
                  <div className="h-6 w-11 bg-slate-300 rounded-full relative"><div className="absolute left-1 top-1 size-4 bg-white rounded-full"></div></div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold">Thông báo hệ thống</p>
                    <p className="text-xs text-slate-500">Tự động gửi thông báo lịch hẹn</p>
                  </div>
                  <div className="h-6 w-11 bg-primary rounded-full relative"><div className="absolute right-1 top-1 size-4 bg-white rounded-full"></div></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
