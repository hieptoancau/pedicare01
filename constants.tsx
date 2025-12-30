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
    bio: "Bác sĩ An là chuyên gia hàng đầu về các bệnh hô hấp nhi khoa, with hơn 15 năm kinh nghiệm tại Bệnh viện Nhi Đồng 1. Ông nổi tiếng với phương pháp điều trị hạn chế kháng sinh."
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
    bio: "Chuyên gia tâm lý nhi khoa, hỗ trợ điều trị các rối loạn phát triển, lo âu và trầm cảm ở trẻ em."
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
    bio: "Trưởng khoa Tai Mũi Họng với bề dày kinh nghiệm trong phẫu thuật Amidan và VA cho trẻ nhỏ."
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
  { id: 4, name: "Bé Na (Phạm Mỹ Linh)", age: 4, birthDate: "2020-07-05" },
  { id: 5, name: "Bé Tít (Đỗ Hoàng Nam)", age: 1, birthDate: "2023-01-12" },
  { id: 6, name: "Bé Miu (Lý Khánh Vân)", age: 6, birthDate: "2018-11-30" },
  { id: 7, name: "Bé Su (Vũ Hải Đăng)", age: 2, birthDate: "2021-12-25" },
  { id: 8, name: "Bé Bắp (Ngô Minh Khôi)", age: 4, birthDate: "2020-03-14" },
  { id: 9, name: "Bé Kem (Đặng Tú Anh)", age: 2, birthDate: "2022-04-02" },
  { id: 10, name: "Bé Bon (Phạm Gia Bảo)", age: 5, birthDate: "2019-09-09" }
];

const generateMockHistory = (): MedicalRecord[] => {
  const records: MedicalRecord[] = [];
  const diagnoses = [
    "Viêm họng cấp", "Sốt siêu vi", "Rối loạn tiêu hóa", "Viêm phế quản", 
    "Viêm tai giữa", "Chàm sữa", "Viêm mũi dị ứng", "Suy dinh dưỡng nhẹ", 
    "Tay chân miệng độ 1", "Phát ban da"
  ];
  // Fix: Renamed 'name' to 'medicineName' to satisfy the PrescriptionItem interface
  const meds = [
    { medicineName: "Hapacol 150", dosage: "1 gói", instruction: "Khi sốt > 38.5" },
    { medicineName: "Augmentin 250", dosage: "2 lần/ngày", instruction: "Sau ăn" },
    { medicineName: "Enterogermina", dosage: "1 ống/ngày", instruction: "Sáng" },
    { medicineName: "Prospan", dosage: "5ml", instruction: "Ngày 3 lần" },
    { medicineName: "Cetaphil", dosage: "Thoa ngoài da", instruction: "Khi khô" }
  ];

  for (let i = 1; i <= 50; i++) {
    const childId = (i % 10) + 1;
    const docId = (i % 5) + 1;
    const doc = MOCK_DOCTORS[docId - 1];
    
    records.push({
      id: `rec${i}`,
      childId: childId,
      date: `2023-${(i % 12) + 1 < 10 ? '0' : ''}${(i % 12) + 1}-${(i % 28) + 1 < 10 ? '0' : ''}${(i % 28) + 1}`,
      doctorName: doc.name,
      diagnosis: diagnoses[i % diagnoses.length],
      recommendation: "Theo dõi nhiệt độ bé, cho bé uống nhiều nước và nghỉ ngơi đầy đủ. Tái khám nếu có dấu hiệu bất thường.",
      prescriptions: [
        meds[i % meds.length],
        meds[(i + 1) % meds.length]
      ]
    });
  }
  return records;
};

export const MOCK_MEDICAL_HISTORY: MedicalRecord[] = generateMockHistory();