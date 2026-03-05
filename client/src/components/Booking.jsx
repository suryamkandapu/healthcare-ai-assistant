import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Booking.module.css';

const Booking = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Appointment booked for ${date.toDateString()} at ${time} for ${name}`);
    // Here you can integrate with backend to save the appointment
  };

  return (
    <section id="booking" className={styles.booking}>
      <div className={styles.bookingContainer}>
        <h2 className={styles.heading}>Book Your Appointment</h2>
        <div className={styles.grid}>
          <div>
            <h3 className={styles.heading}>Select Date</h3>
            <Calendar onChange={setDate} value={date} />
          </div>
          <div>
            <h3 className={styles.heading}>Appointment Details</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label className={styles.inputLabel}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              <div>
                <label className={styles.inputLabel}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              <div>
                <label className={styles.inputLabel}>Preferred Time</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={styles.selectField}
                  required
                >
                  <option value="">Select Time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                </select>
              </div>
              <button
                type="submit"
                className={styles.button}
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;