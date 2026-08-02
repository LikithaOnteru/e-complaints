import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navbar/Navbar';
import { Footer } from './components/navbar/Footer';
import { Toast } from './components/ui/Toast';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { RegisterComplaintPage } from './pages/RegisterComplaintPage';
import { TrackComplaintPage } from './pages/TrackComplaintPage';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { EmergencyContactsPage } from './pages/EmergencyContactsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminComplaintsPage } from './pages/AdminComplaintsPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { VillageMap } from './components/map/VillageMap';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  const renderView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'citizen_dashboard':
        return <CitizenDashboard />;
      case 'register_complaint':
        return <RegisterComplaintPage />;
      case 'track_complaint':
        return <TrackComplaintPage />;
      case 'complaint_details':
        return <ComplaintDetailsPage />;
      case 'my_complaints':
        return <MyComplaintsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'emergency_contacts':
        return <EmergencyContactsPage />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      case 'admin_complaints':
        return <AdminComplaintsPage />;
      case 'admin_analytics':
        return <AdminAnalyticsPage />;
      case 'admin_reports':
        return <AdminReportsPage />;
      case 'village_map':
        return <VillageMap />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-4rem-16rem)]">
      {renderView()}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark transition-colors duration-200">
        <Navbar />
        <MainContent />
        <Footer />
        <Toast />
      </div>
    </AppProvider>
  );
}
