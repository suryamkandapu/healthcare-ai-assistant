import React, { useState } from 'react';
import styles from './features.module.css';

const DoctorRecommendation = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState(null);

  const handleRecommend = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setDoctors([
        {
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiologist',
          hospital: 'City Heart Hospital',
          rating: 4.8,
          available: 'Today 2:00 PM',
          experience: '15 years',
          fee: '$50',
        },
        {
          name: 'Dr. Michael Chen',
          specialization: 'Cardiologist',
          hospital: 'Metro Health Center',
          rating: 4.7,
          available: 'Tomorrow 10:00 AM',
          experience: '12 years',
          fee: '$45',
        },
        {
          name: 'Dr. Emily Davis',
          specialization: 'General Practitioner',
          hospital: 'Community Clinic',
          rating: 4.9,
          available: 'Today 4:30 PM',
          experience: '10 years',
          fee: '$35',
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className={styles.featureContainer}>
      <h2>⭐ Smart Doctor Recommendation</h2>
      <p>Get personalized doctor suggestions based on your symptoms</p>

      <div className={styles.inputSection}>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="E.g., chest pain, shortness of breath..."
          className={styles.textarea}
        />
        <button onClick={handleRecommend} className={styles.primaryButton} disabled={loading}>
          {loading ? 'Finding doctors...' : 'Recommend Doctors'}
        </button>
      </div>

      {doctors && (
        <div className={styles.doctorsList}>
          {doctors.map((doctor, idx) => (
            <div key={idx} className={styles.doctorCard}>
              <div className={styles.doctorHeader}>
                <div>
                  <h3>{doctor.name}</h3>
                  <p className={styles.specialization}>{doctor.specialization}</p>
                </div>
                <div className={styles.rating}>
                  <span className={styles.stars}>⭐ {doctor.rating}</span>
                </div>
              </div>

              <div className={styles.doctorInfo}>
                <p><strong>🏥 Hospital:</strong> {doctor.hospital}</p>
                <p><strong>👔 Experience:</strong> {doctor.experience}</p>
                <p><strong>💰 Consultation Fee:</strong> {doctor.fee}</p>
                <p className={styles.available}><strong>📅 Available:</strong> {doctor.available}</p>
              </div>

              <button className={styles.bookButton}>Book Appointment</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorRecommendation;
