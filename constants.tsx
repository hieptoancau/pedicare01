
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
    bio: "Bác sĩ An là chuyên gia hàng đầu về các bệnh hô hấp nhi khoa, với hơn 15 năm kinh nghiệm tại Bệnh viện Nhi Đồng 1."
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
    bio: "Chuyên tư vấn dinh dưỡng cho trẻ biếng ăn, chậm lớn và các vấn đề tiêu hóa."
  }
];

export const MOCK_CHILDREN: ChildProfile[] = [
  { id: 1, name: "Bé Bi (Nguyễn Văn An)", age: 3, birthDate: "2021-05-15" },
  { id: 2, name: "Bé Bông (Trần Thị Bích)", age: 5, birthDate: "2019-02-20" }
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
  }
];
