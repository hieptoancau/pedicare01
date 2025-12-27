
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  rating: number | string;
  image: string;
  available: string;
  statusColor: string;
  statusText: string;
  price: number;
  experience: string;
  patients: string;
  bio: string;
}

export interface ChildProfile {
  id: number;
  name: string;
  age: number;
  birthDate: string;
}

export interface Appointment {
  id: string;
  doctorId: number;
  childId: number;
  date: string;
  time: string;
  status: 'upcoming' | 'past' | 'pending';
  service: string;
  price: number;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string; // ví dụ: 2 viên/ngày
  instruction: string; // ví dụ: Sau khi ăn sáng/tối
}

export interface MedicalRecord {
  id: string;
  childId: number;
  date: string;
  doctorName: string;
  diagnosis: string;
  recommendation: string;
  prescriptions: PrescriptionItem[];
}
