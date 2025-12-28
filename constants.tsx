
import { Doctor, ChildProfile, MedicalRecord } from './types';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "BS. Nguyễn Văn An",
    specialty: "Khoa Nhi - Hô hấp",
    hospital: "Bệnh viện Nhi Đồng 1 (2.5km)",
    rating: 4.9,
    image: "https://picsum.photos/seed/doc1/400/400",
    available: "Hôm nay",
    statusColor: "text-green-600",
    statusText: "Lịch trống hôm nay",
    price: 350000,
    experience: "15 năm",
    patients: "2.5k+",
    bio: "Bác sĩ An là chuyên gia hàng đầu về các bệnh hô hấp nhi khoa, với hơn 15 năm kinh nghiệm tại Bệnh viện Nhi Đồng 1. Ông nổi tiếng với phương pháp điều trị hạn chế kháng sinh."
  },
  {
    id: 2,
    name: "BS. Trần Thị Bích",
    specialty: "Khoa Nhi - Dinh dưỡng",
    hospital: "Phòng khám Nhi Việt (1.2km)",
    rating: 4.8,
    image: "https://picsum.photos/seed/doc2/400/400",
    available: "Chiều nay",
    statusColor: "text-slate-500",
    statusText: "Trống: 14:00 Chiều nay",
    price: 300000,
    experience: "10 năm",
    patients: "1.8k+",
    bio: "Chuyên tư vấn dinh dưỡng cho trẻ biếng ăn, chậm lớn và các vấn đề tiêu hóa phức tạp ở trẻ sơ sinh."
  },
  {
    id: 3,
    name: "BS. Lê Thị Thu",
    specialty: "Khoa Nhi - Tâm lý",
    hospital: "Bệnh viện Quốc tế Hạnh Phúc (5km)",
    rating: 4.7,
    image: "https://picsum.photos/seed/doc3/400/400",
    available: "Sáng mai",
    statusColor: "text-orange-500",
    statusText: "Trống: 08:30 Sáng mai",
    price: 500000,
    experience: "8 năm",
    patients: "1.2k+",
    bio: "Chuyên gia tâm lý nhi khoa, hỗ trợ điều trị các rối loạn phát triển, lo âu và trầm cảm ở trẻ em và thanh thiếu niên."
  },
  {
    id: 4,
    name: "BS. Phạm Nam",
    specialty: "Khoa Nhi - Tai Mũi Họng",
    hospital: "Bệnh viện Tai Mũi Họng TW (3.5km)",
    rating: 4.9,
    image: "https://picsum.photos/seed/doc4/400/400",
    available: "Hôm nay",
    statusColor: "text-green-600",
    statusText: "Lịch trống hôm nay",
    price: 400000,
    experience: "20 năm",
    patients: "5k+",
    bio: "Trưởng khoa Tai Mũi Họng với bề dày kinh nghiệm trong phẫu thuật Amidan và VA bằng phương pháp Coblator hiện đại cho trẻ."
  },
  {
    id: 5,
    name: "BS. Hoàng My",
    specialty: "Khoa Nhi - Da liễu",
    hospital: "Bệnh viện Da Liễu TP.HCM (4.2km)",
    rating: 4.6,
    image: "https://picsum.photos/seed/doc5/400/400",
    available: "Hôm nay",
    statusColor: "text-green-600",
    statusText: "Lịch trống hôm nay",
    price: 350000,
    experience: "12 năm",
    patients: "2k+",
    bio: "Chuyên điều trị chàm sữa, viêm da cơ địa và các bệnh lý da liễu phổ biến ở trẻ nhỏ."
  }
];

export const MOCK_CHILDREN: ChildProfile[] = [
  { id: 1, name: "Bé Bi (Nguyễn Văn An)", age: 3, birthDate: "2021-05-15" },
  { id: 2, name: "Bé Bông (Trần Thị Bích)", age: 5, birthDate: "2019-02-20" },
  { id: 3, name: "Bé Sóc (Lê Gia Huy)", age: 2, birthDate: "2022-10-10" },
  { id: 4, name: "Bé Na (Phạm Mỹ Linh)", age: 4, birthDate: "2020-07-05" }
];

export const MOCK_MEDICAL_HISTORY: MedicalRecord[] = [
  {
    id: "rec1",
    childId: 1,
    date: "2023-11-20",
    doctorName: "BS. Nguyễn Văn An",
    diagnosis: "Viêm phế quản cấp tính",
    recommendation: "Cho bé uống nhiều nước ấm, giữ ấm cổ họng, tái khám sau 3 ngày nếu sốt không giảm.",
    prescriptions: [
      { medicineName: "Augmentin 250mg", dosage: "2 gói/ngày", instruction: "Sáng 1, Chiều 1 sau ăn" },
      { medicineName: "Prospan (Siro ho)", dosage: "5ml/lần", instruction: "Ngày 3 lần" },
      { medicineName: "Hapacol 150", dosage: "1 gói/lần", instruction: "Chỉ uống khi sốt > 38.5 độ" }
    ]
  },
  {
    id: "rec2",
    childId: 1,
    date: "2023-08-15",
    doctorName: "BS. Trần Thị Bích",
    diagnosis: "Rối loạn tiêu hóa nhẹ",
    recommendation: "Hạn chế đồ dầu mỡ, bổ sung men vi sinh.",
    prescriptions: [
      { medicineName: "Enterogermina", dosage: "1 ống/ngày", instruction: "Uống trực tiếp buổi sáng" },
      { medicineName: "Hydrite (Oresol)", dosage: "Pha 1 gói/200ml", instruction: "Uống rải rác trong ngày" }
    ]
  },
  {
    id: "rec3",
    childId: 2,
    date: "2023-12-01",
    doctorName: "BS. Lê Thị Thu",
    diagnosis: "Rối loạn giấc ngủ",
    recommendation: "Giảm thời gian sử dụng thiết bị điện tử trước khi ngủ 2 tiếng. Tạo không gian ngủ yên tĩnh.",
    prescriptions: [
      { medicineName: "Siro thảo dược giúp ngủ ngon", dosage: "10ml/ngày", instruction: "Uống trước khi ngủ 30 phút" }
    ]
  },
  {
    id: "rec4",
    childId: 3,
    date: "2023-12-05",
    doctorName: "BS. Phạm Nam",
    diagnosis: "Viêm tai giữa",
    recommendation: "Vệ sinh mũi họng sạch sẽ. Không cho bé nằm bú bình.",
    prescriptions: [
      { medicineName: "Zinnat 125mg", dosage: "2 lần/ngày", instruction: "Sáng 1, Chiều 1 sau ăn" },
      { medicineName: "Otrivin 0.05%", dosage: "Nhỏ 2 lần/ngày", instruction: "Mỗi bên 1 giọt" }
    ]
  },
  {
    id: "rec5",
    childId: 4,
    date: "2023-12-07",
    doctorName: "BS. Hoàng My",
    diagnosis: "Chàm sữa (Viêm da cơ địa)",
    recommendation: "Dưỡng ẩm da thường xuyên 4-5 lần/ngày. Tránh các tác nhân gây dị ứng như bụi bẩn, lông thú.",
    prescriptions: [
      { medicineName: "Cetaphil Moisturizing Cream", dosage: "Thoa nhiều lần", instruction: "Thoa sau khi tắm và khi da khô" },
      { medicineName: "Fucidin H", dosage: "Thoa 2 lần/ngày", instruction: "Thoa lớp mỏng vùng da viêm nặng" }
    ]
  },
  {
    id: "rec6",
    childId: 2,
    date: "2023-09-10",
    doctorName: "BS. Nguyễn Văn An",
    diagnosis: "Cúm mùa",
    recommendation: "Cách ly bé tại phòng thoáng mát. Theo dõi sát nhiệt độ.",
    prescriptions: [
      { medicineName: "Tamiflu 30mg", dosage: "2 lần/ngày", instruction: "Uống liên tục 5 ngày" },
      { medicineName: "Efferalgan 250mg", dosage: "Khi cần", instruction: "Sốt trên 38.5 độ" }
    ]
  },
  {
    id: "rec7",
    childId: 3,
    date: "2023-10-25",
    doctorName: "BS. Trần Thị Bích",
    diagnosis: "Thiếu sắt & Suy dinh dưỡng nhẹ",
    recommendation: "Bổ sung thực phẩm giàu sắt như thịt bò, gan, trứng. Uống nhiều nước cam để hấp thụ sắt tốt hơn.",
    prescriptions: [
      { medicineName: "Ferlatum", dosage: "1 chai/ngày", instruction: "Uống trong bữa ăn sáng" },
      { medicineName: "Pedia Poly-vite", dosage: "1ml/ngày", instruction: "Uống buổi sáng" }
    ]
  }
];
