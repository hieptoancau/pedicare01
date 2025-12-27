
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import SelectDoctorScreen from './screens/SelectDoctorScreen';
import DoctorDetailScreen from './screens/DoctorDetailScreen';
import BookingScreen from './screens/BookingScreen';
import PatientInfoScreen from './screens/PatientInfoScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import AISymptomChecker from './screens/AISymptomChecker';
import LuckyWheelScreen from './screens/LuckyWheelScreen';
import DoctorDashboardScreen from './screens/DoctorDashboardScreen';
import { Doctor, Appointment, ChildProfile } from './types';
import { MOCK_CHILDREN } from './constants';

const App: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildProfile>(MOCK_CHILDREN[0]);
  const [bookingData, setBookingData] = useState<Partial<Appointment>>({});
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorId: 1,
      childId: 1,
      date: '2023-12-06',
      time: '09:30 AM',
      status: 'upcoming',
      service: 'Khám tổng quát',
      price: 350000
    }
  ]);

  const handleBookingConfirm = (appointment: Appointment) => {
    setAppointments([appointment, ...appointments]);
  };

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/select-doctor" element={<SelectDoctorScreen onSelect={setSelectedDoctor} />} />
          <Route 
            path="/doctor-detail" 
            element={selectedDoctor ? <DoctorDetailScreen doctor={selectedDoctor} /> : <Navigate to="/select-doctor" />} 
          />
          <Route 
            path="/booking" 
            element={selectedDoctor ? <BookingScreen doctor={selectedDoctor} onNext={(data) => setBookingData({...bookingData, ...data})} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/patient-info" 
            element={<PatientInfoScreen onNext={(child) => setSelectedChild(child)} />} 
          />
          <Route 
            path="/confirmation" 
            element={
              selectedDoctor && selectedChild ? (
                <ConfirmationScreen 
                  doctor={selectedDoctor} 
                  child={selectedChild} 
                  bookingData={bookingData}
                  onConfirm={handleBookingConfirm}
                />
              ) : <Navigate to="/" />
            } 
          />
          <Route path="/history" element={<HistoryScreen appointments={appointments} />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/ai-checker" element={<AISymptomChecker />} />
          <Route path="/lucky-wheel" element={<LuckyWheelScreen />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboardScreen />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
