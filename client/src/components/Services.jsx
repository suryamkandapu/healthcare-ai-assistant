import React from 'react';
import styles from './Services.module.css';

const Services = () => {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.servicesContainer}>
        <h2 className={styles.heading}>Our Services</h2>
        <p style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px', color: '#4b5563' }}>
          A connected AI-first experience that helps you understand symptoms, manage prescriptions,
          route to the right doctor, and stay on top of appointments and medicines.
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={`${styles.cardContent} ${styles.aiDiagnosis}`}>
              <h3 className={styles.cardTitle}>AI Symptom &amp; Risk Intelligence</h3>
              <p>Let AI make sense of what you are feeling.</p>
              <ul style={{ marginTop: 12, textAlign: 'left', paddingLeft: 20 }}>
                <li>AI Symptom Checker for possible conditions and precautions</li>
                <li>AI Health Risk Prediction using age, BP, sugar and weight</li>
                <li>AI Chat Doctor for quick, safe medical Q&amp;A</li>
              </ul>
            </div>
          </div>
          <div className={styles.card}>
            <div className={`${styles.cardContent} ${styles.healthMonitoring}`}>
              <h3 className={styles.cardTitle}>Prescription &amp; Document Intelligence</h3>
              <p>Turn confusing prescriptions into clear instructions.</p>
              <ul style={{ marginTop: 12, textAlign: 'left', paddingLeft: 20 }}>
                <li>Prescription Scanner with OCR to read handwritten slips</li>
                <li>AI medicine breakdown: name, use, dosage and cautions</li>
              </ul>
            </div>
          </div>
          <div className={styles.card}>
            <div className={`${styles.cardContent} ${styles.personalizedCare}`}>
              <h3 className={styles.cardTitle}>Smart Care Routing &amp; Emergency</h3>
              <p>Guide every case to the right level of care.</p>
              <ul style={{ marginTop: 12, textAlign: 'left', paddingLeft: 20 }}>
                <li>Smart Doctor Recommendation based on your symptoms</li>
                <li>Emergency AI Call Assistant to triage urgent situations</li>
              </ul>
            </div>
          </div>
          <div className={styles.card}>
            <div className={`${styles.cardContent} ${styles.healthMonitoring}`}>
              <h3 className={styles.cardTitle}>Appointments &amp; Medicine Reminders</h3>
              <p>Stay perfectly on schedule with your care plan.</p>
              <ul style={{ marginTop: 12, textAlign: 'left', paddingLeft: 20 }}>
                <li>Smart Appointment booking with suggested time slots</li>
                <li>Medicine Reminder System for multiple daily doses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;