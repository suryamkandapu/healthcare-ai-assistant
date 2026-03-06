import React, { useState } from 'react';
import styles from './features.module.css';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);

    try {
      // Mock AI response - replace with actual API call
      setTimeout(() => {
        const mockDiseases = [
          { name: 'Viral Fever', probability: 85, symptoms: 'Fever, fatigue' },
          { name: 'Common Flu', probability: 70, symptoms: 'Respiratory symptoms' },
          { name: 'Dengue', probability: 45, symptoms: 'High fever, body pain' },
        ];

        setResult({
          symptoms: symptoms,
          conditions: mockDiseases,
          recommendation: 'Consult a physician if symptoms persist for 24 hours. Stay hydrated and get rest.',
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.featureContainer}>
      <h2>🔍 AI Symptom Checker</h2>
      <p>Describe your symptoms and get AI-powered suggestions</p>

      <div className={styles.inputSection}>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="E.g., I have fever, headache and body pain..."
          className={styles.textarea}
        />
        <button onClick={handleCheck} className={styles.primaryButton} disabled={loading}>
          {loading ? 'Analyzing...' : 'Check Symptoms'}
        </button>
      </div>

      {result && (
        <div className={styles.resultCard}>
          <h3>📋 Analysis Result</h3>
          <div className={styles.diseaseList}>
            {result.conditions.map((disease, idx) => (
              <div key={idx} className={styles.diseaseItem}>
                <div className={styles.diseaseName}>{disease.name}</div>
                <div className={styles.probability}>
                  <div className={styles.probabilityBar}>
                    <div
                      className={styles.probabilityFill}
                      style={{
                        width: `${disease.probability}%`,
                        background: disease.probability > 70 ? '#ef4444' : disease.probability > 50 ? '#f59e0b' : '#10b981',
                      }}
                    />
                  </div>
                  <span>{disease.probability}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.recommendationBox}>
            <strong>✅ Recommendation</strong>
            <p>{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
