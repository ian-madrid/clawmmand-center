'use client'

import EventbriteSection from '../components/EventbriteSection'
import TranscriptLog from '../components/TranscriptLog'
import ActivityFeed from '../components/ActivityFeed'
import LifeGoals from '../components/LifeGoals'

export default function Dashboard() {
  return (
    <main style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🧠 Clawmmand Center</h1>
        <p style={styles.subtitle}>One Organism - Living System</p>
      </header>

      {/* Main Grid */}
      <div style={styles.grid}>
        {/* Left Column */}
        <div style={styles.column}>
          <LifeGoals />
          <EventbriteSection />
        </div>

        {/* Right Column */}
        <div style={styles.column}>
          <TranscriptLog />
          <ActivityFeed />
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>🦅 The Dashboard is ONE ORGANISM - Activity Logs are the pulse</p>
      </footer>
    </main>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#010409',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#0d1117',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    border: '1px solid #30363d',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#f0f6fc',
  },
  subtitle: {
    fontSize: '16px',
    color: '#8b949e',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    padding: '20px',
    color: '#8b949e',
    fontSize: '14px',
  },
}
// Force rebuild Thu Mar 26 19:57:14 PDT 2026
