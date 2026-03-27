'use client'

import { useState, useEffect } from 'react'

// Activity Log - THE PULSE of the system
// Following sacred workflow: Every action logged immediately
export default function ActivityFeed() {
  const [developments, setDevelopments] = useState([])

  useEffect(() => {
    // Load from developments.json
    fetch('/src/data/developments.json')
      .then(res => res.json())
      .then(data => {
        setDevelopments(data.developments || [])
      })
      .catch(err => {
        console.error('Failed to load activity log:', err)
      })
  }, [])

  // Function to add new development (call this after every action!)
  const logDevelopment = async (section, action) => {
    const newDev = {
      id: `dev-${Date.now()}`,
      section,
      action,
      timestamp: new Date().toISOString(),
      status: 'completed'
    }
    
    // Update local state immediately
    setDevelopments(prev => [newDev, ...prev])
    
    // TODO: Also append to developments.json file (requires API call)
    console.log('📝 Logged:', action)
  }

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
        {developments.length === 0 ? (
          <p style={styles.empty}>No recent activity</p>
        ) : (
          developments.map(dev => (
            <div key={dev.id} style={styles.item}>
              <span style={styles.emoji}>
                {sectionEmojis[dev.section] || '📝'}
              </span>
              <div style={styles.content}>
                <p style={styles.action}>{dev.action}</p>
                <p style={styles.time}>{timeAgo(dev.timestamp)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

const initialDevelopments = [
  {
    id: 'dev-001',
    section: 'system',
    action: 'Restored SOUL.md and identity files',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-002',
    section: 'eventbrite',
    action: 'Rebuilt with dark theme + QR code support',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-003',
    section: 'eventbrite',
    action: 'Added relative dates (Today, Tomorrow, In X days)',
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-004',
    section: 'eventbrite',
    action: 'Changed distance to kilometers for visitors',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-005',
    section: 'gmail',
    action: 'Built Gmail QR automation script',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-006',
    section: 'gmail',
    action: 'Added "Check Gmail" button to My Tickets',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-007',
    section: 'transcript',
    action: 'Processed TikTok: Manipulación: Evita las Trampas (310K likes)',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-008',
    section: 'transcript',
    action: 'Updated TranscriptLog to load from JSON',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-009',
    section: 'system',
    action: 'Committed and pushed to GitHub',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    status: 'completed'
  },
  {
    id: 'dev-010',
    section: 'system',
    action: 'Vercel deploying updates',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: 'deploying'
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
    backgroundColor: '#0d1117',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    border: '1px solid #30363d',
    color: '#c9d1d9',
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
    color: '#f0f6fc',
  },
  viewAll: {
    color: '#58a6ff',
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
    backgroundColor: '#161b22',
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
    color: '#f0f6fc',
    margin: '0 0 4px 0',
  },
  time: {
    fontSize: '12px',
    color: '#8b949e',
    margin: 0,
  },
  empty: {
    textAlign: 'center',
    color: '#8b949e',
    padding: '20px',
  },
}
