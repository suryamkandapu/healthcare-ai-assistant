import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './HealthDashboard.module.css';

const weeklyData = [
  { day: 'Mon', heartRate: 78, bp: 126, sleep: 6.5, steps: 5200 },
  { day: 'Tue', heartRate: 74, bp: 120, sleep: 7.1, steps: 8200 },
  { day: 'Wed', heartRate: 80, bp: 132, sleep: 6.2, steps: 6400 },
  { day: 'Thu', heartRate: 76, bp: 124, sleep: 7.4, steps: 9100 },
  { day: 'Fri', heartRate: 82, bp: 136, sleep: 5.9, steps: 4800 },
  { day: 'Sat', heartRate: 70, bp: 118, sleep: 8.1, steps: 10050 },
  { day: 'Sun', heartRate: 72, bp: 122, sleep: 7.8, steps: 7600 },
];

const HealthDashboard = () => {
  const latest = weeklyData[weeklyData.length - 1];

  return (
    <section id="health-dashboard" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <h2 className={styles.heading}>Health Monitoring Dashboard</h2>
          <p className={styles.subheading}>
            Visualize your weekly heart rate, blood pressure, sleep and activity to understand your
            overall health score.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.scoreCard}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreLabel}>Weekly Score</span>
              <span className={styles.scoreValue}>87</span>
              <span className={styles.scoreSub}>out of 100</span>
            </div>
            <div className={styles.scoreDetails}>
              <div className={styles.scoreRow}>
                <span>Heart rate</span>
                <span>{latest.heartRate} bpm</span>
              </div>
              <div className={styles.scoreRow}>
                <span>Blood pressure</span>
                <span>{latest.bp}/80 mmHg</span>
              </div>
              <div className={styles.scoreRow}>
                <span>Sleep</span>
                <span>{latest.sleep} hrs</span>
              </div>
              <div className={styles.scoreRow}>
                <span>Steps</span>
                <span>{latest.steps.toLocaleString()} / 8,000</span>
              </div>
            </div>
          </div>

          <div className={styles.charts}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>Heart Rate (bpm)</span>
                <span className={styles.metricTag}>Calm</span>
              </div>
              <div className={styles.chartBody}>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f56565" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#fed7d7" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" opacity={0.3} />
                    <XAxis dataKey="day" stroke="#cbd5e0" />
                    <YAxis stroke="#cbd5e0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a202c',
                        borderRadius: 12,
                        border: '1px solid #4a5568',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="heartRate"
                      stroke="#feb2b2"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#heartGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <span className={styles.chartTitle}>Sleep (hrs)</span>
                  <span className={styles.metricTag}>Recovery</span>
                </div>
                <div className={styles.chartBodySmall}>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#9f7aea" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#e9d8fd" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#cbd5e0" />
                      <YAxis stroke="#cbd5e0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a202c',
                          borderRadius: 12,
                          border: '1px solid #4a5568',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sleep"
                        stroke="#d6bcfa"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#sleepGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.chartCard}>
                <div className={styles.chartHeader}>
                  <span className={styles.chartTitle}>Steps</span>
                  <span className={styles.metricTag}>Activity</span>
                </div>
                <div className={styles.chartBodySmall}>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#48bb78" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#c6f6d5" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#cbd5e0" />
                      <YAxis stroke="#cbd5e0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a202c',
                          borderRadius: 12,
                          border: '1px solid #4a5568',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="steps"
                        stroke="#9ae6b4"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#stepsGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthDashboard;

