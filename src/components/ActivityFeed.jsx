'use client'

import { useState, useEffect } from 'react'

// Mock developments - in real app this would come from global state or API
const mockDevelopments = [
  {
    id: 'dev-001',
    section: 'eventbrite',
    action: 'Added auto-filter for past events',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
    status: 'completed'
  },
  {
    id: 'dev-002',
    section: 'eventbrite',
    action: 'Updated Eventbrite prompts with NYC location',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
    status: 'completed'
  },
  {
    id: 'dev-003',
    section: 'system',
    action: 'Restored SOUL.md and identity files',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-004',
    section: 'transcript',
    action: 'Added transcript filter buttons',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'completed'
  }
]

const sectionEmojis = {
  eventbrite: '🎫',
  transcript: '📋',
  tasks: '✅',
  schedule: '📅',
  dashboard: '🧠',
  system: '⚙️'
}

export default function ActivityFeed() {
  const [developments, setDevelopments] = useState([])

  useEffect(() => {
    setDevelopments(mockDevelopments)
  }, [])

  const timeAgo = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>📊 Activity Logs</h2>
        <a href="#" style={styles.viewAll}>View all →</a>
      </div>

      <div style={styles.feed}>
        {developments.map(dev => (
          <div key={dev.id} style={styles.item}>
            <span style={styles.emoji}>
              {sectionEmojis[dev.section] || '📝'}
            </span>
            <div style={styles.content}>
              <p style={styles.action}>{dev.action}</p>
              <p style={styles.time}>{timeAgo(dev.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>

      {developments.length === 0 && (
        <p style={styles.empty}>No recent activity</p>
      )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
  },
  viewAll: {
    color: '#0066cc',
    textDecoration: 'none',
    fontSize: '14px',
  },
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
  },
  emoji: {
    fontSize: '20px',
  },
  content: {
    flex: 1,
  },
  action: {
    fontSize: '14px',
    color: '#24292e',
    margin: '0 0 4px 0',
  },
  time: {
    fontSize: '12px',
    color: '#586069',
    margin: 0,
  },
  empty: {
    textAlign: 'center',
    color: '#586069',
    padding: '20px',
  },
}
