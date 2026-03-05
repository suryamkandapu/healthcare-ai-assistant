import React from 'react';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div>
          <h1 className={styles.brand}>Healthcare AI Assistant</h1>
        </div>
        <div className={styles.links}>
          <a href="#home" className={styles.link}>Home</a>
          <a href="#services" className={styles.link}>Services</a>
          <a href="#booking" className={styles.link}>Book Appointment</a>
          <a href="tel:+1234567890" className={styles.callButton}>Call Now</a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;