'use client'

import { useState, useEffect } from 'react'

// Build: 2026-03-27 07:45 AM
export default function TranscriptLog() {
  const [transcripts, setTranscripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expandedTranscript, setExpandedTranscript] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    // Load transcripts from public/data/transcripts.json (served at /data/)
    // NOTE: Only edit public/data/*.json files - src/data/ doesn't exist
    fetch('/data/transcripts.json?t=' + Date.now())
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

  const filtered = transcripts.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDelete = (id) => {
    if (confirm('Delete this transcript?')) {
      const updated = transcripts.filter(t => t.id !== id)
      setTranscripts(updated)
      // Update localStorage
      localStorage.setItem('transcripts', JSON.stringify(updated))
      // Also update the main data file reference if needed
      if (expandedTranscript === id) {
        setExpandedTranscript(null)
      }
    }
  }

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
            filtered.map(t => {
              const thumbnailInfo = getThumbnailInfo(t)
              
              return (
                <div key={t.id} style={styles.item}>
                  <div style={styles.thumbnailContainer}>
                    {thumbnailInfo.type === 'image' ? (
                      <img 
                        src={thumbnailInfo.url} 
                        alt={t.title}
                        style={styles.thumbnail}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextElementSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div style={{
                      ...styles.thumbnailFallback,
                      ...(thumbnailInfo.type === 'image' ? {display: 'none'} : {}),
                      background: thumbnailInfo.gradient
                    }}>
                      <span style={styles.fallbackEmoji}>{t.type === 'youtube' ? '📺' : '🎵'}</span>
                    </div>
                    <div style={styles.typeBadge}>{t.type === 'youtube' ? '📺' : '🎵'}</div>
                  </div>
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
                  
                  {/* Transcript Section - Collapsible */}
                  {t.transcript && (
                    <div style={styles.transcriptContainer}>
                      <div style={styles.transcriptActions}>
                        <button 
                          style={styles.transcriptToggle}
                          onClick={() => setExpandedTranscript(expandedTranscript === t.id ? null : t.id)}
                        >
                          {expandedTranscript === t.id ? '▼ Hide' : '▶ Show Transcript'}
                        </button>
                        
                        <button 
                          style={styles.copyButton}
                          onClick={() => handleCopy(t.transcript, t.id)}
                          title="Copy transcript"
                        >
                          {copiedId === t.id ? '✓ Copied!' : '📋 Copy'}
                        </button>
                        
                        <button 
                          style={styles.deleteButton}
                          onClick={() => handleDelete(t.id)}
                          title="Delete transcript"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                      
                      {expandedTranscript === t.id && (
                        <div style={styles.transcript}>
                          <div style={styles.transcriptScroll}>
                            {formatTranscript(t.transcript).map((paragraph, idx) => (
                              <p key={idx} style={styles.transcriptParagraph}>
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  </div>
                  <span style={t.status === 'ready' ? styles.badgeReady : styles.badgeProcessing}>
                    {t.status === 'ready' ? '✓ Ready' : '⏳ Processing'}
                  </span>
                </div>
              )
            })
          )}
        </div>
      )}
    </section>
  )
}

// Format transcript text into readable paragraphs
function formatTranscript(text) {
  if (!text) return []
  
  // Split by common paragraph breaks
  const paragraphs = text.split(/\n\n+|\.\s+(?=[A-Z])|\.\s*$/).filter(p => p.trim())
  
  return paragraphs.map(p => {
    // Clean up and format
    return p.trim()
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
  }).filter(p => p.length > 0)
}

// Generate thumbnail info from transcript data
function getThumbnailInfo(transcript) {
  if (!transcript) return { type: 'fallback', gradient: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)' }
  
  // Custom thumbnail (if provided)
  if (transcript.thumbnail) {
    return {
      type: 'image',
      url: transcript.thumbnail,
      gradient: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)'
    }
  }
  
  // YouTube thumbnails
  if (transcript.type === 'youtube' && transcript.url) {
    // Extract video ID from YouTube URL
    const videoIdMatch = transcript.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    if (videoIdMatch && videoIdMatch[1]) {
      return {
        type: 'image',
        url: `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`,
        gradient: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)'
      }
    }
  }
  
  // TikTok thumbnails - use gradient fallbacks
  if (transcript.type === 'tiktok') {
    // Generate consistent gradient based on transcript ID
    const gradients = [
      'linear-gradient(135deg, #ff0050 0%, #00f2ea 100%)',
      'linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)',
      'linear-gradient(135deg, #ff0050 0%, #ff0050 50%, #00f2ea 100%)',
      'linear-gradient(135deg, #00f2ea 0%, #ff0050 50%, #00f2ea 100%)'
    ]
    const colorIndex = transcript.id.charCodeAt(transcript.id.length - 1) % gradients.length
    return {
      type: 'fallback',
      gradient: gradients[colorIndex]
    }
  }
  
  // Default fallback
  return { type: 'fallback', gradient: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)' }
}

const styles = {
  section: {
    backgroundColor: '#0d1117',
    borderRadius: '12px',
    padding: '16px',
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
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#f0f6fc',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
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
    gap: '16px',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#161b22',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid #30363d',
  },
  thumbnailContainer: {
    position: 'relative',
    flexShrink: 0,
    width: '160px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid #30363d',
  },
  thumbnail: {
    width: '100%',
    height: '90px',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '6px',
  },
  thumbnailFallback: {
    width: '100%',
    height: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
  },
  fallbackEmoji: {
    fontSize: '32px',
    opacity: 0.8,
  },
  typeBadge: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '16px',
    lineHeight: 1,
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
  transcriptContainer: {
    marginTop: '12px',
  },
  transcriptActions: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  transcriptToggle: {
    backgroundColor: 'transparent',
    border: '1px solid #30363d',
    borderRadius: '6px',
    padding: '6px 12px',
    color: '#58a6ff',
    fontSize: '12px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '100px',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  copyButton: {
    backgroundColor: '#238636',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    color: '#ffffff',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  deleteButton: {
    backgroundColor: '#da3633',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    color: '#ffffff',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  transcript: {
    marginTop: '8px',
    padding: '16px',
    backgroundColor: '#010409',
    borderRadius: '6px',
    border: '1px solid #30363d',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  transcriptScroll: {
    maxHeight: '260px',
    overflowY: 'auto',
    paddingRight: '8px',
  },
  transcriptParagraph: {
    fontSize: '13px',
    color: '#c9d1d9',
    lineHeight: 1.8,
    marginBottom: '16px',
    textAlign: 'left',
  },
  badgeReady: {
    padding: '4px 8px',
    backgroundColor: '#238636',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  badgeProcessing: {
    padding: '4px 8px',
    backgroundColor: '#9e6a03',
    color: '#ffffff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
}
