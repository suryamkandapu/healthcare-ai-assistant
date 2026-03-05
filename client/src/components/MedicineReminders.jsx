import React, { useEffect, useState } from 'react';
import styles from './MedicineReminders.module.css';

const MedicineReminders = () => {
  const [medicineName, setMedicineName] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [times, setTimes] = useState([]);
  const [note, setNote] = useState('');
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReminders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/reminders');
      const data = await response.json();
      setReminders(Array.isArray(data) ? data : []);
    } catch {
      // ignore initial load error
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const addTime = () => {
    const trimmed = timeInput.trim();
    if (!trimmed) return;
    if (!times.includes(trimmed)) {
      setTimes((prev) => [...prev, trimmed]);
    }
    setTimeInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicineName.trim() || times.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medicineName,
          times,
          note,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create reminder');
      }

      setMedicineName('');
      setTimeInput('');
      setTimes([]);
      setNote('');
      await fetchReminders();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="medicine-reminders" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <h2 className={styles.heading}>Medicine Reminder System</h2>
          <p className={styles.subheading}>
            Never miss a dose. Add medicines with exact timings and keep all your schedules in one
            place.
          </p>
        </div>

        <div className={styles.grid}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="medicineName">
                Medicine name
              </label>
              <input
                id="medicineName"
                type="text"
                className={styles.input}
                placeholder="Paracetamol 500mg"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Dose times</label>
              <div className={styles.timeRow}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="8:00 AM"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTime();
                    }
                  }}
                />
                <button type="button" className={styles.addTimeButton} onClick={addTime}>
                  Add
                </button>
              </div>
              {times.length > 0 && (
                <div className={styles.timeChips}>
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={styles.timeChip}
                      onClick={() => setTimes((prev) => prev.filter((x) => x !== t))}
                    >
                      {t} <span className={styles.chipRemove}>×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="note">
                Notes (optional)
              </label>
              <textarea
                id="note"
                className={styles.textarea}
                rows={3}
                placeholder="Before food, after food, with water etc."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={loading || !medicineName.trim() || times.length === 0}
            >
              {loading ? 'Saving...' : 'Save Reminder'}
            </button>

            {error && <p className={styles.error}>{error}</p>}

            <p className={styles.disclaimer}>
              Notifications are simulated inside this app. In a real deployment, these reminders
              can trigger push notifications or emails.
            </p>
          </form>

          <div className={styles.listPanel}>
            <h3 className={styles.listHeading}>Your reminders</h3>
            {reminders.length === 0 && (
              <p className={styles.empty}>No medicine reminders added yet.</p>
            )}

            <div className={styles.reminderList}>
              {reminders.map((reminder) => (
                <div key={reminder.id} className={styles.reminderCard}>
                  <div className={styles.reminderHeader}>
                    <h4 className={styles.medicine}>{reminder.medicineName}</h4>
                    <span className={styles.pill}>{reminder.times.length}x / day</span>
                  </div>
                  <div className={styles.reminderTimes}>
                    {reminder.times.map((t) => (
                      <span key={t} className={styles.reminderTime}>
                        {t}
                      </span>
                    ))}
                  </div>
                  {reminder.note && <p className={styles.reminderNote}>{reminder.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicineReminders;

