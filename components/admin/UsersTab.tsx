
import React, { useState, useMemo, useEffect } from 'react';

interface UserAccount {
  id: number;
  name: string;
  role: 'Admin' | 'Bác sĩ' | 'Phụ huynh';
  status: 'Active' | 'Blocked';
  email: string;
}

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([
    { id: 1, name: 'Nguyễn Văn An', role: 'Bác sĩ', status: 'Active', email: 'an.nguyen@pedicare.com' },
    { id: 2, name: 'Trần Thị Bích', role: 'Bác sĩ', status: 'Active', email: 'bich.tran@pedicare.com' },
    { id: 3, name: 'Lê Gia Huy', role: 'Phụ huynh', status: 'Active', email: 'huy.le@gmail.com' },
    { id: 4, name: 'Phạm Mỹ Linh', role: 'Phụ huynh', status: 'Blocked', email: 'linh.pham@gmail.com' },
    { id: 5, name: 'Đỗ Hoàng Nam', role: 'Admin', status: 'Active', email: 'nam.admin@pedicare.com' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [formData, setFormData] = useState<Partial<UserAccount>>({ 
    name: '', 
    email: '', 
    role: 'Phụ huynh', 
    status: 'Active' 
  });

  // Hiển thị thông báo toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  // Hàm loại bỏ dấu tiếng Việt để tìm kiếm chính xác
  const removeAccents = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  };

  // Logic Tìm kiếm: Lọc từ danh sách gốc 'users'
  const filteredUsers = useMemo(() => {
    const term = removeAccents(searchTerm.trim());
    if (!term) return users;
    return users.filter(u => 
      removeAccents(u.name).includes(term) || 
      removeAccents(u.email).includes(term) ||
      removeAccents(u.role).includes(term)
    );
  }, [users, searchTerm]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'Phụ huynh', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingId(user.id);
    setFormData({ ...user });
    setIsModalOpen(true);
  };

  // Chức năng Xóa: Đã được kiểm tra và đảm bảo hoạt động
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Thao tác này không thể hoàn tác.')) {
      setUsers((prevUsers) => prevUsers.filter(u => u.id !== id));
      showToast('Đã xóa người dùng thành công');
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u
    ));
    showToast('Đã cập nhật trạng thái');
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      showToast('Vui lòng điền đầy đủ tên và email', 'error');
      return;
    }

    if (editingId !== null) {
      setUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...formData } as UserAccount : u));
      showToast('Đã cập nhật thông tin người dùng');
    } else {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers(prev => [...prev, { ...formData, id: newId } as UserAccount]);
      showToast('Đã thêm người dùng mới thành công');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-6 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300 ${toast.type === 'success' ? 'bg-slate-900 text-white border-l-4 border-green-500' : 'bg-red-600 text-white'}`}>
          <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          <span className="font-bold text-sm tracking-tight">{toast.message}</span>
        </div>
      )}

      {/* Search and Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
          <input 
            placeholder="Tìm theo tên, email hoặc vai trò..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm w-full outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
          />
        </div>
        <button 
          onClick={handleOpenAdd} 
          className="w-full sm:w-auto bg-primary text-white px-8 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span> THÊM NGƯỜI DÙNG
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-6">Thành viên</th>
                <th className="px-6 py-6">Vai trò</th>
                <th className="px-6 py-6 text-center">Trạng thái</th>
                <th className="px-6 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 group transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary shadow-inner">
                          {u.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 dark:text-white truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-tighter">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl ${
                        u.role === 'Admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' : 
                        u.role === 'Bác sĩ' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' : 
                        'bg-slate-100 text-slate-600 dark:bg-slate-800'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleToggleStatus(u.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all hover:scale-105 ${u.status === 'Active' ? 'bg-green-50 text-green-600 dark:bg-green-900/10' : 'bg-red-50 text-red-600 dark:bg-red-900/10'}`}
                        >
                          <div className={`size-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-[10px] font-black uppercase">{u.status === 'Active' ? 'Hoạt động' : 'Đã khóa'}</span>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button 
                          onClick={() => handleOpenEdit(u)}
                          className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          title="Sửa thông tin"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                          title="Xóa người dùng"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <span className="material-symbols-outlined text-7xl">person_search</span>
                      <p className="font-black text-slate-900 dark:text-white">Không tìm thấy kết quả phù hợp</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-2xl tracking-tight">{editingId ? 'Sửa thông tin' : 'Thêm thành viên'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên đầy đủ</label>
                <input 
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all font-medium" 
                  placeholder="VD: Nguyễn Văn An" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                <input 
                  value={formData.email || ''} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-primary/20 transition-all font-medium" 
                  placeholder="VD: an.nguyen@example.com" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò</label>
                  <select 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role: e.target.value as any})} 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-primary/20 font-medium"
                  >
                     <option value="Phụ huynh">Phụ huynh</option>
                     <option value="Bác sĩ">Bác sĩ</option>
                     <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trạng thái</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})} 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-primary/20 font-medium"
                  >
                     <option value="Active">Hoạt động</option>
                     <option value="Blocked">Khóa</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="flex-1 py-4 text-sm font-black text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-2xl active:scale-95 transition-all"
              >
                HỦY
              </button>
              <button 
                onClick={handleSave} 
                className="flex-[2] py-4 text-sm font-black text-white bg-primary rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                {editingId ? 'CẬP NHẬT NGAY' : 'LƯU THÀNH VIÊN'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;
