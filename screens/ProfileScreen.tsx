
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { MOCK_CHILDREN, MOCK_MEDICAL_HISTORY } from '../constants';
import { ChildProfile, MedicalRecord } from '../types';

type ProfileView = 'main' | 'personal-info' | 'children-list' | 'edit-child' | 'medical-history' | 'record-detail';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ProfileView>('main');
  
  // State cho thông tin cá nhân
  const [parentInfo, setParentInfo] = useState({
    name: 'Chị Thu Thảo',
    phone: '0901 234 567',
    email: 'thuthao.pedicare@gmail.com'
  });

  // State cho danh sách trẻ em
  const [children, setChildren] = useState<ChildProfile[]>(MOCK_CHILDREN);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSaveChild = () => {
    if (editingChild) {
      setChildren(children.map(c => c.id === editingChild.id ? { ...editingChild, age: calculateAge(editingChild.birthDate) } : c));
      setView('children-list');
    }
  };

  // --- VIEW: EDIT PERSONAL INFO ---
  if (view === 'personal-info') {
    return (
      <div className="flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark mx-auto shadow-2xl">
        <header className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setView('main')} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold">Thông tin cá nhân</h2>
        </header>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="size-24 rounded-full bg-cover bg-center border-4 border-primary/20" style={{backgroundImage: "url('https://picsum.photos/seed/user1/400/400')"}}></div>
            <button className="text-primary text-sm font-bold">Thay đổi ảnh đại diện</button>
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-500">Họ và tên</span>
            <input 
              className="form-input rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:border-primary focus:ring-primary/20"
              value={parentInfo.name}
              onChange={(e) => setParentInfo({...parentInfo, name: e.target.value})}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-500">Số điện thoại</span>
            <input 
              className="form-input rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:border-primary focus:ring-primary/20"
              value={parentInfo.phone}
              onChange={(e) => setParentInfo({...parentInfo, phone: e.target.value})}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-500">Email</span>
            <input 
              className="form-input rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:border-primary focus:ring-primary/20"
              value={parentInfo.email}
              onChange={(e) => setParentInfo({...parentInfo, email: e.target.value})}
            />
          </label>
          <button onClick={() => setView('main')} className="mt-4 w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Lưu thay đổi</button>
        </div>
      </div>
    );
  }

  // --- VIEW: CHILDREN LIST ---
  if (view === 'children-list') {
    return (
      <div className="flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark mx-auto shadow-2xl">
        <header className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setView('main')} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold">Hồ sơ bệnh nhi</h2>
        </header>
        <div className="p-4 flex flex-col gap-4">
          <p className="text-xs font-medium text-slate-500 px-2 uppercase tracking-wider">Chọn bé để xem lịch sử khám</p>
          {children.map(child => (
            <div 
              key={child.id}
              className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">
                <div className="size-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">child_care</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{child.name}</h4>
                  <p className="text-sm text-slate-500">{child.age} tuổi • {new Date(child.birthDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <button 
                  onClick={() => { setEditingChild(child); setView('edit-child'); }}
                  className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="flex border-t border-slate-50 dark:border-slate-700">
                <button 
                  onClick={() => { setSelectedChild(child); setView('medical-history'); }}
                  className="flex-1 py-3 text-sm font-bold text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">history</span>
                  Lịch sử khám bệnh
                </button>
              </div>
            </div>
          ))}
          <button className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 font-bold hover:border-primary hover:text-primary transition-all mt-2">
            <span className="material-symbols-outlined">add_circle</span>
            Thêm hồ sơ bé mới
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW: MEDICAL HISTORY LIST ---
  if (view === 'medical-history' && selectedChild) {
    const history = MOCK_MEDICAL_HISTORY.filter(h => h.childId === selectedChild.id);
    return (
      <div className="flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark mx-auto shadow-2xl">
        <header className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md z-10">
          <button onClick={() => setView('children-list')} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-lg font-bold">Lịch sử khám: {selectedChild.name}</h2>
            <p className="text-[10px] text-slate-500 font-medium">{history.length} lần khám đã ghi nhận</p>
          </div>
        </header>
        <div className="p-4 flex flex-col gap-4">
          {history.length > 0 ? (
            history.map(record => (
              <button 
                key={record.id}
                onClick={() => { setSelectedRecord(record); setView('record-detail'); }}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-left hover:border-primary transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[16px] text-primary">event</span>
                    <span className="text-xs font-bold text-primary">{record.date}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{record.diagnosis}</h4>
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  Bác sĩ: {record.doctorName}
                </p>
                <div className="flex gap-2">
                  <div className="flex -space-x-2">
                    {record.prescriptions.slice(0, 3).map((_, i) => (
                      <div key={i} className="size-6 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[12px] text-primary">pill</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 self-center">
                    {record.prescriptions.length} loại thuốc được kê
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="material-symbols-outlined text-6xl opacity-20 mb-4">clinical_notes</span>
              <p>Chưa có dữ liệu lịch sử khám bệnh</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW: RECORD DETAIL (Chuẩn đoán & Đơn thuốc) ---
  if (view === 'record-detail' && selectedRecord) {
    return (
      <div className="flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark mx-auto shadow-2xl">
        <header className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md z-10">
          <button onClick={() => setView('medical-history')} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold">Chi tiết lần khám</h2>
        </header>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 pb-12">
          {/* Diagnosis Section */}
          <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined text-[20px]">stethoscope</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">Chuẩn đoán của bác sĩ</h3>
            </div>
            <p className="text-lg font-bold text-primary mb-2">{selectedRecord.diagnosis}</p>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{selectedRecord.recommendation}"
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <p>Khám bởi: <span className="font-bold">{selectedRecord.doctorName}</span></p>
              <p>{selectedRecord.date}</p>
            </div>
          </section>

          {/* Prescription Section */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                  <span className="material-symbols-outlined text-[20px]">pill</span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Đơn thuốc được kê</h3>
              </div>
              <span className="text-xs font-medium text-slate-400">{selectedRecord.prescriptions.length} loại</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {selectedRecord.prescriptions.map((pill, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-2xl">medication</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{pill.medicineName}</h4>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full font-bold text-slate-600 dark:text-slate-300">{pill.dosage}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{pill.instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <button className="mt-4 flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
            <span className="material-symbols-outlined">download</span>
            Tải file PDF đơn thuốc
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW: EDIT CHILD ---
  if (view === 'edit-child' && editingChild) {
    return (
      <div className="flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark mx-auto shadow-2xl">
        <header className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
          <button onClick={() => setView('children-list')} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold">Chỉnh sửa hồ sơ bé</h2>
        </header>
        <div className="p-6 flex flex-col gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-500">Họ và tên bé</span>
            <input 
              className="form-input rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:border-primary focus:ring-primary/20"
              value={editingChild.name}
              onChange={(e) => setEditingChild({...editingChild, name: e.target.value})}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-500">Ngày sinh</span>
            <input 
              type="date"
              className="form-input rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:border-primary focus:ring-primary/20"
              value={editingChild.birthDate}
              onChange={(e) => setEditingChild({...editingChild, birthDate: e.target.value})}
            />
          </label>
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-sm text-slate-600 dark:text-slate-300">Tuổi hiện tại của bé: <span className="font-bold">{calculateAge(editingChild.birthDate)} tuổi</span></p>
          </div>
          <button onClick={handleSaveChild} className="mt-4 w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Lưu hồ sơ</button>
        </div>
      </div>
    );
  }

  // --- VIEW: MAIN PROFILE ---
  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between bg-background-light/90 dark:bg-background-dark/90 px-4 py-3 backdrop-blur-md transition-colors">
        <button onClick={() => navigate('/')} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center text-lg font-bold tracking-tight text-slate-900 dark:text-white">Hồ sơ cá nhân</h2>
        <div className="w-10"></div>
      </div>
      
      <div className="flex flex-col items-center gap-4 px-4 py-6">
        <div className="relative">
          <div className="aspect-square h-28 w-28 rounded-full border-4 border-white dark:border-slate-800 shadow-lg bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/user1/400/400')"}}></div>
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90">
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{parentInfo.name}</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 bg-slate-200 dark:bg-slate-700/50 px-3 py-1 rounded-full inline-block">Mẹ bé Bi & bé Bông</p>
        </div>
      </div>

      <div className="px-4 mt-2">
        <h3 className="mb-2 ml-1 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tài khoản</h3>
        <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <button 
            onClick={() => setView('personal-info')}
            className="group flex w-full items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 active:bg-slate-100 dark:active:bg-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"><span className="material-symbols-outlined text-[20px]">person</span></div>
              <span className="text-base font-medium text-slate-900 dark:text-white">Thông tin cá nhân</span>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
          <div className="h-px w-full bg-slate-100 dark:bg-slate-700 ml-16"></div>
          <button 
            onClick={() => setView('children-list')}
            className="group flex w-full items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 active:bg-slate-100 dark:active:bg-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400"><span className="material-symbols-outlined text-[20px]">child_care</span></div>
              <span className="text-base font-medium text-slate-900 dark:text-white">Hồ sơ bệnh nhi ({children.length})</span>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="px-4 mt-6">
        <h3 className="mb-2 ml-1 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cài đặt chung</h3>
        <div className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400"><span className="material-symbols-outlined text-[20px]">notifications</span></div>
              <span className="text-base font-medium text-slate-900 dark:text-white">Thông báo nhắc lịch</span>
            </div>
            <div className="h-7 w-12 rounded-full bg-primary relative cursor-pointer"><div className="absolute right-[2px] top-[2px] h-6 w-6 rounded-full bg-white"></div></div>
          </div>
          <div className="h-px w-full bg-slate-100 dark:bg-slate-700 ml-16"></div>
          <button onClick={() => { document.documentElement.classList.toggle('dark'); }} className="group flex w-full items-center justify-between p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 active:bg-slate-100 dark:active:bg-slate-700">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"><span className="material-symbols-outlined text-[20px]">dark_mode</span></div>
              <span className="text-base font-medium text-slate-900 dark:text-white">Chế độ tối</span>
            </div>
            <span className="material-symbols-outlined text-slate-400">sync_alt</span>
          </button>
        </div>
      </div>

      {/* Demo: Switch to Doctor Dashboard */}
      <div className="px-4 mt-6">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">medical_services</span>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Chế độ Bác sĩ</p>
                <p className="text-[10px] text-indigo-700 dark:text-indigo-300">Dành cho nhân viên y tế</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/doctor-dashboard')}
              className="bg-indigo-600 text-white text-[11px] font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Chuyển ngay
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-8 mb-8">
        <button className="w-full rounded-xl bg-red-50 py-3.5 text-center text-base font-semibold text-red-600 transition-transform active:scale-[0.98] dark:bg-red-500/10 dark:text-red-400">Đăng xuất</button>
      </div>
      <BottomNav active="profile" />
    </div>
  );
};

export default ProfileScreen;
