
import React from 'react';

const SettingsTab: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-xl font-black mb-8">Cấu hình Vận hành</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-white mb-1">Chế độ Bảo trì</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Khóa tất cả các chức năng đặt lịch khám</p>
            </div>
            <div className="h-7 w-12 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 size-5 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-white mb-1">Thông báo AI</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Tự động gợi ý bác sĩ khi phụ huynh chat</p>
            </div>
            <div className="h-7 w-12 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 size-5 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-white mb-1">Thanh toán trực tuyến</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Kích hoạt VNPay / MoMo khi xác nhận lịch</p>
            </div>
            <div className="h-7 w-12 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 size-5 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>

        <button className="mt-10 w-full py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">
          LƯU TẤT CẢ CÀI ĐẶT
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
