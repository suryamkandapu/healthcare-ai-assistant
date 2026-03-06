import React, { useState } from 'react';
import styles from './features.module.css';

const EmergencyAssistant = () => {
  const [isActive, setIsActive] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);

  const handleEmergency = async () => {
    setIsActive(true);

    setTimeout(() => {
      setEmergencyData({
        status: 'Emergency detected',
        severity: 'High',
        location: 'Getting location...',
        nearestAmbulance: 'Ambulance dispatched to your location',
        eta: '5 minutes',
        hospital: 'City General Hospital - 0.8 km away',
        emergency_contact: '+1-800-EMERGENCY',
      });
    }, 1500);
  };

  return (\n    <div className={styles.featureContainer}>\n      <h2>🆘 Emergency AI Assistant</h2>\n      <p>Quick access to emergency services with AI-powered dispatch</p>\n\n      {!isActive ? (\n        <div className={styles.emergencySection}>\n          <div className={styles.emergencyWarning}>\n            <p>Press below to activate emergency assistance</p>\n          </div>\n          <button onClick={handleEmergency} className={styles.emergencyButton}>\n            🚨 CALL EMERGENCY\n          </button>\n        </div>\n      ) : (\n        <div className={styles.emergencyActive}>\n          {emergencyData && (\n            <>\n              <div className={styles.emergencyStatus}>\n                <div className={styles.statusBadge}>{emergencyData.status}</div>\n                <div className={styles.severity}>Severity: {emergencyData.severity}</div>\n              </div>\n\n              <div className={styles.emergencyInfo}>\n                <div className={styles.infoCard}>\n                  <span className={styles.icon}>📍</span>\n                  <div>\n                    <strong>Location</strong>\n                    <p>{emergencyData.location}</p>\n                  </div>\n                </div>\n\n                <div className={styles.infoCard}>\n                  <span className={styles.icon}>🚑</span>\n                  <div>\n                    <strong>Ambulance Status</strong>\n                    <p>{emergencyData.nearestAmbulance}</p>\n                    <p className={styles.eta}>ETA: {emergencyData.eta}</p>\n                  </div>\n                </div>\n\n                <div className={styles.infoCard}>\n                  <span className={styles.icon}>🏥</span>\n                  <div>\n                    <strong>Nearest Hospital</strong>\n                    <p>{emergencyData.hospital}</p>\n                  </div>\n                </div>\n\n                <div className={styles.infoCard}>\n                  <span className={styles.icon}>📞</span>\n                  <div>\n                    <strong>Emergency Contact</strong>\n                    <p>{emergencyData.emergency_contact}</p>\n                  </div>\n                </div>\n              </div>\n\n              <button\n                onClick={() => setIsActive(false)}\n                className={styles.cancelButton}\n              >\n                Cancel Emergency\n              </button>\n            </>\n          )}\n        </div>\n      )}\n    </div>\n  );\n};\n\nexport default EmergencyAssistant;\n