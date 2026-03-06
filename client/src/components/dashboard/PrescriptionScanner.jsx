import React, { useState } from 'react';
import styles from './features.module.css';

const PrescriptionScanner = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);

    setTimeout(() => {
      setResult({
        medicines: [
          {
            name: 'Paracetamol',
            dose: '500mg',
            frequency: '1 tablet every 6 hours',
            usage: 'Fever & Pain relief',
            warnings: 'Do not exceed 4g per day',
          },
          {
            name: 'Amoxicillin',
            dose: '250mg',
            frequency: '3 times daily',
            usage: 'Antibiotic for bacterial infection',
            warnings: 'Complete the full course',
          },
        ],
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className={styles.featureContainer}>
      <h2>📄 Prescription Scanner</h2>
      <p>Upload prescription image and get medicine details extracted by AI</p>

      <div className={styles.uploadSection}>
        <div className={styles.uploadBox}>
          {image ? (
            <div className={styles.imagePreview}>
              <img src={image} alt="prescription" />
              <button
                className={styles.removeButton}
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <label className={styles.uploadLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <div className={styles.uploadContent}>
                <span className={styles.uploadIcon}>📷</span>
                <p>Click to upload prescription image</p>
              </div>
            </label>
          )}
        </div>

        {image && (
          <button onClick={handleScan} className={styles.primaryButton} disabled={loading}>
            {loading ? 'Scanning...' : 'Scan Prescription'}
          </button>
        )}
      </div>

      {result && (
        <div className={styles.resultCard}>
          <h3>💊 Extracted Medicines</h3>
          <div className={styles.medicinesList}>
            {result.medicines.map((med, idx) => (
              <div key={idx} className={styles.medicineCard}>
                <div className={styles.medicineHeader}>
                  <h4>{med.name}</h4>
                  <span className={styles.dose}>{med.dose}</span>
                </div>
                <div className={styles.medicineDetails}>
                  <p><strong>Frequency:</strong> {med.frequency}</p>
                  <p><strong>Usage:</strong> {med.usage}</p>
                  <p className={styles.warning}><strong>⚠️ Warning:</strong> {med.warnings}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionScanner;
