import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import SymptomChecker from './dashboard/SymptomChecker';
import PrescriptionScanner from './dashboard/PrescriptionScanner';
import DoctorRecommendation from './dashboard/DoctorRecommendation';
import HealthRiskPrediction from './dashboard/HealthRiskPrediction';
import EmergencyAssistant from './dashboard/EmergencyAssistant';
import HealthMonitoring from './dashboard/HealthMonitoring';
import SmartAppointment from './dashboard/SmartAppointment';
import MedicineReminder from './dashboard/MedicineReminder';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('symptoms');

  const tabs = [
    { id: 'symptoms', label: '🩹 Symptom Checker', icon: '🔍' },
    { id: 'prescription', label: '💊 Prescription Scanner', icon: '📄' },
    { id: 'doctor', label: '👨‍⚕️ Doctor Recommendation', icon: '⭐' },
    { id: 'risk', label: '❤️ Health Risk', icon: '📊' },
    { id: 'emergency', label: '🆘 Emergency', icon: '📞' },
    { id: 'monitoring', label: '📈 Health Monitor', icon: '💓' },
    { id: 'appointment', label: '📅 Appointments', icon: '✓' },
    { id: 'medicine', label: '⏰ Medicine Reminder', icon: '💉' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'symptoms':
        return <SymptomChecker />;
      case 'prescription':
        return <PrescriptionScanner />;
      case 'doctor':
        return <DoctorRecommendation />;
      case 'risk':
        return <HealthRiskPrediction />;
      case 'emergency':
        return <EmergencyAssistant />;
      case 'monitoring':
        return <HealthMonitoring />;
      case 'appointment':
        return <SmartAppointment />;
      case 'medicine':
        return <MedicineReminder />;
      default:
        return <SymptomChecker />;
    }
  };

  return (
    <section id="dashboard" className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Healthcare AI Dashboard</h1>
          <p>Comprehensive health management powered by AI</p>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
