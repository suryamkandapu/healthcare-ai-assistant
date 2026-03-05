import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerGrid}>
          <div>
            <h3 className={styles.footerTitle}>Healthcare AI Assistant</h3>
            <p>Your trusted partner in health and wellness.</p>
          </div>
          <div>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <ul style={{ lineHeight: '1.75' }}>
              <li><a href="#home" className={styles.footerLink}>Home</a></li>
              <li><a href="#services" className={styles.footerLink}>Services</a></li>
              <li><a href="#symptom-checker" className={styles.footerLink}>Symptom Checker</a></li>
              <li><a href="#booking" className={styles.footerLink}>Book Appointment</a></li>
              <li><a href="#medicine-reminders" className={styles.footerLink}>Medicine Reminders</a></li>
            </ul>
          </div>
          <div>
            <h3 className={styles.footerTitle}>Contact</h3>
            <p>Phone: <a href="tel:+1234567890" className={styles.footerLink}>+1 (234) 567-890</a></p>
            <p>Email: info@healthcareai.com</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 Healthcare AI Assistant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;