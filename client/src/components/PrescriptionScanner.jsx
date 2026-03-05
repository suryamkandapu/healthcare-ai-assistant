import React, { useState } from 'react';
import styles from './PrescriptionScanner.module.css';

const PrescriptionScanner = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setError('');
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('prescription', file);

      const response = await fetch('http://localhost:3001/api/prescription-scan', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan prescription');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="prescription-scanner" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <h2 className={styles.heading}>Prescription Scanner</h2>
          <p className={styles.subheading}>
            Upload a doctor&apos;s prescription and let AI extract your medicines, dosage and usage
            in simple language.
          </p>
        </div>

        <div className={styles.grid}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>Upload prescription image</label>
            <div className={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
                id="prescriptionFile"
              />
              <label htmlFor="prescriptionFile" className={styles.uploadButton}>
                <span className={styles.uploadIcon}>📄</span>
                <span>
                  {file ? 'Change prescription image' : 'Choose prescription image'}
                  <span className={styles.uploadHint}>JPG, PNG or HEIC up to ~5MB</span>
                </span>
              </label>
            </div>

            {previewUrl && (
              <div className={styles.previewCard}>
                <p className={styles.previewLabel}>Preview</p>
                <img src={previewUrl} alt="Prescription preview" className={styles.previewImage} />
              </div>
            )}

            <button type="submit" className={styles.button} disabled={!file || loading}>
              {loading ? 'Scanning...' : 'Scan Prescription'}
            </button>

            {error && <p className={styles.error}>{error}</p>}
          </form>

          <div className={styles.resultPanel}>
            {!result && !loading && (
              <div className={styles.placeholder}>
                <h3 className={styles.placeholderTitle}>Medicine details will appear here</h3>
                <p className={styles.placeholderText}>
                  After scanning, the AI will list each medicine with its purpose and how to take it.
                </p>
              </div>
            )}

            {loading && (
              <div className={styles.loaderWrapper}>
                <div className={styles.loaderBar}>
                  <div className={styles.loaderBarInner} />
                </div>
                <p className={styles.loaderText}>Reading your prescription with OCR and AI...</p>
              </div>
            )}

            {result && !loading && (
              <div className={styles.resultContent}>
                {result.medicines && result.medicines.length > 0 ? (
                  <div className={styles.medicineList}>
                    {result.medicines.map((med, index) => (
                      <div key={`${med.name}-${index}`} className={styles.medicineCard}>
                        <div className={styles.medicineHeader}>
                          <h3 className={styles.medicineName}>{med.name}</h3>
                          {med.dosage && <span className={styles.dosage}>{med.dosage}</span>}
                        </div>
                        {med.purpose && (
                          <p className={styles.field}>
                            <span className={styles.fieldLabel}>Used for:</span> {med.purpose}
                          </p>
                        )}
                        {med.frequency && (
                          <p className={styles.field}>
                            <span className={styles.fieldLabel}>Dose:</span> {med.frequency}
                          </p>
                        )}
                        {med.cautions && (
                          <p className={styles.cautions}>
                            <span className={styles.fieldLabel}>Caution:</span> {med.cautions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyText}>
                    We couldn&apos;t detect medicines clearly from this image, but here is the raw
                    text:
                  </p>
                )}

                {result.extractedText && (
                  <div className={styles.rawTextBlock}>
                    <p className={styles.rawTextLabel}>Extracted text (OCR)</p>
                    <p className={styles.rawText}>{result.extractedText}</p>
                  </div>
                )}

                {result.note && <p className={styles.note}>{result.note}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrescriptionScanner;

