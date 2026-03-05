import React, { useState } from 'react';
import styles from './RiskPrediction.module.css';

const RiskPrediction = () => {
  const [form, setForm] = useState({
    age: '',
    weight: '',
    bp: '',
    sugar: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/api/risk-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: form.age,
          weight: form.weight,
          bp: form.bp,
          sugar: form.sugar,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to predict risk');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGaugeClass = () => {
    if (!result) return styles.gaugeLow;
    if (result.level === 'High') return styles.gaugeHigh;
    if (result.level === 'Medium') return styles.gaugeMedium;
    return styles.gaugeLow;
  };

  return (
    <section id="risk-prediction" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <h2 className={styles.heading}>AI Health Risk Prediction</h2>
          <p className={styles.subheading}>
            Combine your age, weight, blood pressure and sugar levels to see a quick risk profile
            for lifestyle diseases.
          </p>
        </div>

        <div className={styles.grid}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  className={styles.input}
                  placeholder="e.g. 45"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="weight">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  className={styles.input}
                  placeholder="e.g. 82"
                  value={form.weight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="bp">
                  Systolic BP
                </label>
                <input
                  id="bp"
                  name="bp"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  className={styles.input}
                  placeholder="e.g. 135"
                  value={form.bp}
                  onChange={handleChange}
                  required
                />
                <p className={styles.hint}>Upper number, in mmHg</p>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="sugar">
                  Fasting Sugar
                </label>
                <input
                  id="sugar"
                  name="sugar"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  className={styles.input}
                  placeholder="e.g. 160"
                  value={form.sugar}
                  onChange={handleChange}
                  required
                />
                <p className={styles.hint}>mg/dL</p>
              </div>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Calculating risk...' : 'Predict Risk'}
            </button>

            {error && <p className={styles.error}>{error}</p>}
          </form>

          <div className={styles.visualPanel}>
            <div className={`${styles.gauge} ${getGaugeClass()}`}>
              <div className={styles.gaugeInner}>
                <span className={styles.gaugeLabel}>Risk Level</span>
                <span className={styles.gaugeValue}>{result ? result.level : 'Low'}</span>
                <span className={styles.gaugeScore}>
                  Score {result ? result.score : 0}
                  <span className={styles.gaugeScoreMax}>/ 7</span>
                </span>
              </div>
            </div>

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dotLow}`} />
                <span>Low</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dotMedium}`} />
                <span>Medium</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dotHigh}`} />
                <span>High</span>
              </div>
            </div>

            <p className={styles.message}>
              {result
                ? result.message
                : 'Enter your values to see a quick, AI-assisted risk overview. This is not a diagnosis, only a guide.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiskPrediction;

