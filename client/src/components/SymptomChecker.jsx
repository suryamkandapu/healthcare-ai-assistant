import React, { useState } from 'react';
import styles from './SymptomChecker.module.css';

const SymptomChecker = () => {
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
      const response = await fetch('http://localhost:3001/api/symptom-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze symptoms');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="symptom-checker" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <h2 className={styles.heading}>AI Symptom Checker</h2>
          <p className={styles.subheading}>
            Describe what you&apos;re feeling and our AI will suggest possible conditions and when to
            see a doctor.
          </p>
        </div>

        <div className={styles.grid}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label} htmlFor="symptoms">
              Your symptoms
            </label>
            <textarea
              id="symptoms"
              className={styles.textarea}
              rows={5}
              placeholder="Example: I have fever, headache and body pain since yesterday..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Analyzing...' : 'Check Symptoms'}
            </button>

            {error && <p className={styles.error}>{error}</p>}
            <p className={styles.disclaimer}>
              This tool does not provide a medical diagnosis. It only suggests possibilities and
              safety advice. Always consult a healthcare professional for serious concerns.
            </p>
          </form>

          <div className={styles.resultCard}>
            {!result && !loading && (
              <div className={styles.placeholder}>
                <h3 className={styles.placeholderTitle}>Possible conditions will appear here</h3>
                <p className={styles.placeholderText}>
                  Once you describe your symptoms, the AI will list likely conditions and what to do
                  next.
                </p>
              </div>
            )}

            {loading && (
              <div className={styles.loaderWrapper}>
                <div className={styles.loader} />
                <p className={styles.loaderText}>Thinking like a digital doctor...</p>
              </div>
            )}

            {result && !loading && (
              <div className={styles.resultContent}>
                {result.possibleConditions && (
                  <div className={styles.block}>
                    <h3 className={styles.blockTitle}>Possible Conditions</h3>
                    <ul className={styles.chipList}>
                      {result.possibleConditions.map((condition) => (
                        <li key={condition} className={styles.chip}>
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.suggestedSpecialist && (
                  <div className={styles.block}>
                    <h3 className={styles.blockTitle}>Suggested Specialist</h3>
                    <p className={styles.highlight}>{result.suggestedSpecialist}</p>
                  </div>
                )}

                {result.recommendation && (
                  <div className={styles.block}>
                    <h3 className={styles.blockTitle}>Recommendation</h3>
                    <p className={styles.recommendation}>{result.recommendation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymptomChecker;

