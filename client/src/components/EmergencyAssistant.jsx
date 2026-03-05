import React, { useEffect, useRef, useState } from 'react';
import styles from './EmergencyAssistant.module.css';

const EmergencyAssistant = () => {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;

    if (SpeechRecognition) {
      setSupportsSpeech(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('');
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setError('');
      setResult(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze emergency');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please call local emergency services.');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = () => {
    if (!result) return styles.levelLow;
    if (result.level === 'Critical') return styles.levelCritical;
    if (result.level === 'High') return styles.levelHigh;
    if (result.level === 'Medium') return styles.levelMedium;
    return styles.levelLow;
  };

  return (
    <section id="emergency" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <h2 className={styles.heading}>Emergency AI Call Assistant</h2>
          <p className={styles.subheading}>
            In urgent situations, describe what&apos;s happening. AI quickly assesses severity and
            guides you to call an ambulance or hospital.
          </p>
        </div>

        <div className={styles.grid}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label} htmlFor="emergencyDescription">
              What symptoms are you experiencing?
            </label>
            <textarea
              id="emergencyDescription"
              className={styles.textarea}
              rows={4}
              placeholder="Example: Severe chest pain, sweating, difficulty breathing for the last 10 minutes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className={styles.controlsRow}>
              {supportsSpeech && (
                <button
                  type="button"
                  className={`${styles.secondaryButton} ${
                    isRecording ? styles.secondaryButtonActive : ''
                  }`}
                  onClick={toggleRecording}
                >
                  {isRecording ? 'Stop Listening' : 'Speak Symptoms'}
                </button>
              )}

              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Urgency'}
              </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <p className={styles.disclaimer}>
              If you believe this is a life-threatening emergency, call your local emergency number
              immediately.
            </p>
          </form>

          <div className={styles.resultPanel}>
            <div className={styles.badgeRow}>
              <span className={`${styles.levelBadge} ${getBadgeClass()}`}>
                {result ? result.level : 'Low'}
              </span>
              <a href="tel:+112" className={styles.callNow}>
                Call Now
              </a>
            </div>

            <div className={styles.resultContent}>
              {loading && (
                <div className={styles.loaderWrapper}>
                  <div className={styles.pulseCircle} />
                  <p className={styles.loaderText}>Prioritizing your case in real-time...</p>
                </div>
              )}

              {!loading && !result && (
                <p className={styles.placeholder}>
                  Once you describe the situation, AI will highlight urgency and whether you should
                  call an ambulance.
                </p>
              )}

              {!loading && result && (
                <>
                  <p className={styles.recommendation}>{result.recommendation}</p>
                  {typeof result.shouldCallAmbulance === 'boolean' && (
                    <p className={styles.ambulance}>
                      Ambulance advice:{' '}
                      <span className={styles.ambulanceHighlight}>
                        {result.shouldCallAmbulance ? 'Call an ambulance now.' : 'Ambulance not strictly required, but seek care if unsure.'}
                      </span>
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmergencyAssistant;

