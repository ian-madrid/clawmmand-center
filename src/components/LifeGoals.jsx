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
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 12px 0',
  },
  placeholder: {
    color: '#586069',
    fontSize: '14px',
  },
}
