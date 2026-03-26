'use client'

import { useState } from 'react'

const mockTranscripts = [
  {
    id: 't-001',
    type: 'youtube',
    emoji: '📺',
    title: 'The Ground Will Rewild Your Body - Natural Mobility',
    source: 'YouTube',
    duration: 'N/A',
    savedAt: '2026-03-24',
    status: 'ready'
  },
  {
    id: 't-002',
    type: 'tiktok',
    emoji: '🎵',
    title: 'Importante magkaroon ng mayaman na kaibigan',
    source: '@victoranastacio',
    duration: '35s',
    savedAt: '2026-03-24',
    status: 'ready'
  },
  {
    id: 't-003',
    type: 'tiktok',
    emoji: '🎵',
    title: 'TikTok Video - Make the Right Decision',
    source: 'TikTok',
    duration: '24s',
    savedAt: '2026-03-24',
    status: 'ready'
  },
  {
    id: 't-004',
    type: 'youtube',
    emoji: '📺',
    title: 'INDUSTRY ALERT: Apple co-founder drops BLUNT warning on the future of AI',
    source: 'Liz Claman Interview',
    duration: '12:30',
    savedAt: '2026-03-25',
    status: 'processing'
  }
]

export default function TranscriptLog() {
  const [transcripts] = useState(mockTranscripts)
  const [filter, setFilter] = useState('all')

  const filtered = transcripts.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Transcript Log</h2>
        <div style={styles.filters}>
          <button 
            style={filter === 'all' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            style={filter === 'youtube' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('youtube')}
          >
            📺
          </button>
          <button 
            style={filter === 'tiktok' ? styles.filterActive : styles.filter}
            onClick={() => setFilter('tiktok')}
          >
            🎵
          </button>
        </div>
      </div>

      <div style={styles.list}>
        {filtered.map(t => (
          <div key={t.id} style={styles.item}>
            <span style={styles.emoji}>{t.emoji}</span>
            <div style={styles.content}>
              <h3 style={styles.itemTitle}>{t.title}</h3>
              <p style={styles.meta}>
                {t.source} • {t.duration} • {t.savedAt}
              </p>
            </div>
            <span style={t.status === 'ready' ? styles.badgeReady : styles.badgeProcessing}>
              {t.status === 'ready' ? '✓ Ready' : '⏳ Processing'}
            </span>
          </div>
        ))}
      </div>
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
  filters: {
    display: 'flex',
    gap: '8px',
  },
  filter: {
    padding: '6px 12px',
    backgroundColor: '#f6f8fa',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  filterActive: {
    padding: '6px 12px',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: '1px solid #0066cc',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  list: {
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
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  emoji: {
    fontSize: '24px',
  },
  content: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 0 4px 0',
    color: '#24292e',
  },
  meta: {
    fontSize: '12px',
    color: '#586069',
    margin: 0,
  },
  badgeReady: {
    padding: '4px 8px',
    backgroundColor: '#2ea44f',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeProcessing: {
    padding: '4px 8px',
    backgroundColor: '#f9c513',
    color: '#1a1a1a',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
}
