import React, { useState } from 'react';
import styles from './DoctorRecommendation.module.css';

const DoctorRecommendation = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const params = new URLSearchParams({ symptoms });
      const response = await fetch(`http://localhost:3001/api/recommend-doctor?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to recommend doctor');
      }
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="doctor-recommendation" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <h2 className={styles.heading}>Smart Doctor Recommendation</h2>
          <p className={styles.subheading}>
            Tell us your symptoms and we&apos;ll connect you to the most relevant specialist and
            nearby doctors.
          </p>
        </div>

        <div className={styles.grid}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label} htmlFor="doctorSymptoms">
              Symptoms
            </label>
            <textarea
              id="doctorSymptoms"
              className={styles.textarea}
              rows={4}
              placeholder="Example: chest pain, shortness of breath when walking..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Finding doctors...' : 'Find Specialist'}
            </button>

            {error && <p className={styles.error}>{error}</p>}
          </form>

          <div className={styles.resultPanel}>
            {!result && !loading && (
              <div className={styles.placeholder}>
                <h3 className={styles.placeholderTitle}>Recommended specialists will appear here</h3>
                <p className={styles.placeholderText}>
                  We will suggest the right department and some sample doctors with ratings and
                  availability.
                </p>
              </div>
            )}

            {loading && (
              <div className={styles.loaderWrapper}>
                <div className={styles.spinner} />
                <p className={styles.loaderText}>Scanning specialties and matching doctors...</p>
              </div>
            )}

            {result && !loading && (
              <div className={styles.resultContent}>
                <div className={styles.specialistCard}>
                  <p className={styles.labelSmall}>Suggested Specialist</p>
                  <p className={styles.specialist}>{result.suggestedSpecialist}</p>
                </div>

                <div className={styles.doctorGrid}>
                  {result.doctors &&
                    result.doctors.map((doc) => (
                      <div key={doc.id} className={styles.doctorCard}>
                        <div className={styles.doctorHeader}>
                          <h3 className={styles.doctorName}>{doc.name}</h3>
                          <span className={styles.rating}>{doc.rating.toFixed(1)}★</span>
                        </div>
                        <p className={styles.specialization}>{doc.specialization}</p>
                        <p className={styles.hospital}>{doc.hospital}</p>
                        <p className={styles.availability}>{doc.availability}</p>
                        <button
                          type="button"
                          className={styles.bookButton}
                          onClick={() => {
                            const bookingSection = document.querySelector('#booking');
                            if (bookingSection) {
                              bookingSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          Book with this doctor
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorRecommendation;

