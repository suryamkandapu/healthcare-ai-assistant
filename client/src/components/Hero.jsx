import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>Your Health, Our Priority</h1>
        <p className={styles.subtitle}>Advanced AI-powered healthcare assistance at your fingertips.</p>
        <div className={styles.buttons}>
          <a href="#booking" className={styles.buttonPrimary}>Book Appointment</a>
          <a href="tel:+1234567890" className={styles.buttonSecondary}>Call Now</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;