import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Booking.module.css';

const Booking = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const suggestedSlots = ['9:00 AM', '10:30 AM', '3:00 PM', '5:30 PM'];

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/appointments');
      const data = await response.json();
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch {
      // ignore initial fetch errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!time) return;

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          date: date.toISOString(),
          time,
          reason,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      await fetchAppointments();
      alert(`Appointment booked for ${date.toDateString()} at ${time} for ${name}`);
      setTime('');
      setReason('');
    } catch (err) {
      alert(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <section id="booking" className={styles.booking}>
      <div className={styles.bookingContainer}>
        <h2 className={styles.heading}>Book Your Appointment</h2>
        <div className={styles.grid}>
          <div>
            <h3 className={styles.heading}>Select Date</h3>
            <Calendar onChange={setDate} value={date} />
            <div style={{ marginTop: '16px' }}>
              <h4 className={styles.heading} style={{ fontSize: '1.05rem' }}>
                AI Suggested Slots
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {suggestedSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className={styles.suggestedSlot}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
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
              <div>
                <label className={styles.inputLabel}>Reason (optional)</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={styles.inputField}
                  placeholder="Check-up, chest pain, follow-up..."
                />
              </div>
              <button
                type="submit"
                className={styles.button}
                disabled={submitting}
              >
                {submitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
            {appointments.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h4 className={styles.heading} style={{ fontSize: '1.05rem' }}>
                  Upcoming Appointments
                </h4>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    marginTop: '8px',
                    lineHeight: '1.6',
                  }}
                >
                  {appointments.map((appt) => (
                    <li key={appt.id} style={{ color: '#fff', opacity: 0.9 }}>
                      {new Date(appt.date).toDateString()} • {appt.time} • {appt.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;