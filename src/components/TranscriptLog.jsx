'use client'

import { useState, useEffect } from 'react'

export default function TranscriptLog() {
  const [transcripts, setTranscripts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load transcripts from data file
    fetch('/src/data/transcripts.json')
      .then(res => res.json())
      .then(data => {
        setTranscripts(data.transcripts || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load transcripts:', err)
        setLoading(false)
      })
  }, [])
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

      {loading ? (
        <p style={styles.loading}>Loading transcripts...</p>
      ) : (
        <div style={styles.list}>
          {filtered.length === 0 ? (
            <p style={styles.empty}>No transcripts yet</p>
          ) : (
            filtered.map(t => (
              <div key={t.id} style={styles.item}>
                <span style={styles.emoji}>{t.emoji}</span>
                <div style={styles.content}>
                  <h3 style={styles.itemTitle}>{t.title}</h3>
                  <p style={styles.meta}>
                    {t.source} • {t.duration} • {t.savedAt}
                    {t.stats && (
                      <span style={styles.stats}>
                        • 👍 {t.stats.likes} • 💬 {t.stats.comments}
                      </span>
                    )}
                  </p>
                  {t.music && (
                    <p style={styles.music}>🎵 {t.music}</p>
                  )}
                </div>
                <span style={t.status === 'ready' ? styles.badgeReady : styles.badgeProcessing}>
                  {t.status === 'ready' ? '✓ Ready' : '⏳ Processing'}
                </span>
              </div>
            ))
          )}
        </div>
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
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#8b949e',
  },
  empty: {
    textAlign: 'center',
    padding: '20px',
    color: '#8b949e',
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
  filters: {
    display: 'flex',
    gap: '8px',
  },
  filter: {
    padding: '6px 12px',
    backgroundColor: '#161b22',
    color: '#c9d1d9',
    border: '1px solid #30363d',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  filterActive: {
    padding: '6px 12px',
    backgroundColor: '#1f6feb',
    color: '#ffffff',
    border: '1px solid #1f6feb',
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
    backgroundColor: '#161b22',
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
    color: '#f0f6fc',
  },
  meta: {
    fontSize: '12px',
    color: '#8b949e',
    margin: '0 0 4px 0',
  },
  stats: {
    color: '#58a6ff',
  },
  music: {
    fontSize: '11px',
    color: '#58a6ff',
    margin: '2px 0 0 0',
  },
  badgeReady: {
    padding: '4px 8px',
    backgroundColor: '#238636',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeProcessing: {
    padding: '4px 8px',
    backgroundColor: '#9e6a03',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
}
