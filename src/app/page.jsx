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
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#0d1117',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    border: '1px solid #30363d',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: '#f0f6fc',
  },
  subtitle: {
    fontSize: '14px',
    color: '#8b949e',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '32px',
    padding: '16px',
    color: '#8b949e',
    fontSize: '13px',
  },
}

// Mobile-responsive styles
const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)') : null
if (mediaQuery && mediaQuery.matches) {
  styles.grid.gridTemplateColumns = '1fr 1fr'
  styles.grid.gap = '20px'
  styles.column.gap = '20px'
  styles.title.fontSize = '32px'
  styles.subtitle.fontSize = '16px'
  styles.container.padding = '20px'
  styles.header.padding = '20px'
  styles.header.marginBottom = '30px'
  styles.footer.marginTop = '40px'
  styles.footer.fontSize = '14px'
}
