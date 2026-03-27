'use client'

export default function LifeGoals() {
  return (
    <section style={styles.section}>
      <h2 style={styles.title}>🎯 Life Goals</h2>
      <p style={styles.placeholder}>
        Life goals tracking coming soon...
      </p>
    </section>
  )
}

const styles = {
  section: {
    backgroundColor: '#0d1117',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    border: '1px solid #30363d',
    color: '#c9d1d9',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 12px 0',
    color: '#f0f6fc',
  },
  placeholder: {
    color: '#8b949e',
    fontSize: '14px',
  },
}
