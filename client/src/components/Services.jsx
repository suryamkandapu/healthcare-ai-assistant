import React from 'react';
import styles from './Services.module.css';

const Services = () => {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.servicesContainer}>
        <h2 className={styles.heading}>Our Services</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={`${styles.cardContent} ${styles.aiDiagnosis}`}>
              <h3 className={styles.cardTitle}>AI Diagnosis</h3>
              <p>Get preliminary diagnoses powered by advanced AI algorithms.</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={`${styles.cardContent} ${styles.healthMonitoring}`}>
              <h3 className={styles.cardTitle}>Health Monitoring</h3>
              <p>Track your health metrics with our intelligent monitoring system.</p>
            </div>
          </div>
          <div className={styles.card}>
            <div className={`${styles.cardContent} ${styles.personalizedCare}`}>
              <h3 className={styles.cardTitle}>Personalized Care</h3>
              <p>Receive tailored healthcare recommendations based on your data.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;