'use client'

import { useState, useEffect } from 'react'

// Build: 2026-03-27 11:55 AM - Mobile optimized, clean transcript view
export default function TranscriptLog() {
  const [transcripts, setTranscripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expandedTranscript, setExpandedTranscript] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  // Auto-expand most recent transcript when loaded
  useEffect(() => {
    if (transcripts.length > 0 && expandedTranscript === null) {
      // Expand the first (most recent) transcript
      setExpandedTranscript(transcripts[0].id)
    }
  }, [transcripts])

  useEffect(() => {
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
      localStorage.setItem('transcripts', JSON.stringify(updated))
      if (expandedTranscript === id) {
        setExpandedTranscript(null)
      }
    }
  }

  return (
    <section style={styles.section}>
      <style>{styles.hoverStyles}</style>
      
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
        <p style={styles.loading}>Loading...</p>
      ) : (
        <div style={styles.list}>
          {filtered.length === 0 ? (
            <p style={styles.empty}>No transcripts yet</p>
          ) : (
            filtered.map(t => (
              <div key={t.id} style={styles.item}>
                {/* Header: Thumbnail + Title + Status */}
                <div style={styles.headerRow}>
                  <a 
                    href={t.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="thumbnail-link"
                    style={styles.thumbnailLink}
                    title="Watch video"
                  >
                    <div className="thumbnail-container" style={styles.thumbnailContainer}>
                      <Thumbnail thumbnailInfo={getThumbnailInfo(t)} type={t.type} />
                      <div className="play-overlay" style={styles.playOverlay}>▶</div>
                    </div>
                  </a>
                  
                  <div style={styles.titleSection}>
                    <h3 style={styles.itemTitle}>{t.title}</h3>
                    <span style={t.status === 'ready' ? styles.badgeReady : styles.badgeProcessing}>
                      {t.status === 'ready' ? '✓ Ready' : '⏳ Processing'}
                    </span>
                  </div>
                </div>

                {/* Transcript Section */}
                {t.transcript && (
                  <div style={styles.transcriptSection}>
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
                      >
                        {copiedId === t.id ? '✓ Copied!' : '📋 Copy'}
                      </button>
                      
                      <button 
                        style={styles.deleteButton}
                        onClick={() => handleDelete(t.id)}
                      >
                        🗑️
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
            ))
          )}
        </div>
      )}
    </section>
  )
}

// Thumbnail component
function Thumbnail({ thumbnailInfo, type }) {
  if (thumbnailInfo.type === 'image') {
    return (
      <>
        <img 
          src={thumbnailInfo.url} 
          alt="Video thumbnail"
          style={styles.thumbnail}
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.nextElementSibling.style.display = 'flex'
          }}
        />
        <div style={{
          ...styles.thumbnailFallback,
          display: 'none',
          background: thumbnailInfo.gradient
        }}>
          <span style={styles.fallbackEmoji}>{type === 'youtube' ? '📺' : '🎵'}</span>
        </div>
      </>
    )
  }
  
  return (
    <div style={{
      ...styles.thumbnailFallback,
      background: thumbnailInfo.gradient
    }}>
      <span style={styles.fallbackEmoji}>{type === 'youtube' ? '📺' : '🎵'}</span>
    </div>
  )
}

// Format transcript into readable paragraphs
function formatTranscript(text) {
  if (!text) return []
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim())
  return paragraphs.map(p => p.trim().replace(/\s+/g, ' ')).filter(p => p.length > 0)
}

// Generate thumbnail URL
function getThumbnailInfo(transcript) {
  if (!transcript) return { type: 'fallback', gradient: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)' }
  
  if (transcript.thumbnail) {
    return { type: 'image', url: transcript.thumbnail }
  }
  
  if (transcript.type === 'youtube' && transcript.url) {
    const videoIdMatch = transcript.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    if (videoIdMatch && videoIdMatch[1]) {
      return {
        type: 'image',
        url: `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`,
        gradient: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)'
      }
    }
  }
  
  if (transcript.type === 'tiktok') {
    const gradients = [
      'linear-gradient(135deg, #ff0050 0%, #00f2ea 100%)',
      'linear-gradient(135deg, #00f2ea 0%, #ff0050 100%)',
      'linear-gradient(135deg, #ff0050 0%, #ff0050 50%, #00f2ea 100%)',
      'linear-gradient(135deg, #00f2ea 0%, #ff0050 50%, #00f2ea 100%)'
    ]
    const colorIndex = transcript.id.charCodeAt(transcript.id.length - 1) % gradients.length
    return { type: 'fallback', gradient: gradients[colorIndex] }
  }
  
  return { type: 'fallback', gradient: 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)' }
}

// Mobile-first responsive styles
const styles = {
  section: {
    backgroundColor: '#0d1117',
    borderRadius: '12px',
    padding: '12px',
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
    gap: '8px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#f0f6fc',
  },
  filters: {
    display: 'flex',
    gap: '6px',
  },
  filter: {
    padding: '6px 10px',
    backgroundColor: '#161b22',
    color: '#c9d1d9',
    border: '1px solid #30363d',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    flex: '1',
  },
  filterActive: {
    padding: '6px 10px',
    backgroundColor: '#1f6feb',
    color: '#ffffff',
    border: '1px solid #1f6feb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    flex: '1',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#161b22',
    borderRadius: '10px',
    border: '1px solid #30363d',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  thumbnailLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
  thumbnailContainer: {
    position: 'relative',
    flexShrink: 0,
    width: '100px',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '2px solid #30363d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d1117',
    transition: 'all 0.2s ease',
  },
  thumbnail: {
    width: '100%',
    height: 'auto',
    maxHeight: '100px',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '4px',
  },
  thumbnailFallback: {
    width: '100%',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  },
  fallbackEmoji: {
    fontSize: '24px',
    opacity: 0.8,
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '24px',
    color: '#ffffff',
    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    pointerEvents: 'none',
  },
  titleSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0,
  },
  itemTitle: {
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
    color: '#f0f6fc',
    lineHeight: 1.4,
    wordBreak: 'break-word',
  },
  badgeReady: {
    alignSelf: 'flex-start',
    padding: '3px 8px',
    backgroundColor: '#238636',
    color: '#ffffff',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '500',
  },
  badgeProcessing: {
    alignSelf: 'flex-start',
    padding: '3px 8px',
    backgroundColor: '#9e6a03',
    color: '#ffffff',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '500',
  },
  transcriptSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  transcriptActions: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  transcriptToggle: {
    backgroundColor: 'transparent',
    border: '1px solid #30363d',
    borderRadius: '6px',
    padding: '5px 10px',
    color: '#58a6ff',
    fontSize: '12px',
    cursor: 'pointer',
    flex: '1',
    minWidth: '80px',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  copyButton: {
    backgroundColor: '#238636',
    border: 'none',
    borderRadius: '6px',
    padding: '5px 10px',
    color: '#ffffff',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#da3633',
    border: 'none',
    borderRadius: '6px',
    padding: '5px 10px',
    color: '#ffffff',
    fontSize: '12px',
    cursor: 'pointer',
  },
  transcript: {
    padding: '10px',
    backgroundColor: '#010409',
    borderRadius: '6px',
    border: '1px solid #30363d',
  },
  transcriptScroll: {
    maxHeight: '300px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  transcriptParagraph: {
    fontSize: '13px',
    color: '#c9d1d9',
    lineHeight: 1.6,
    marginBottom: '12px',
    textAlign: 'left',
  },
  hoverStyles: `
    .thumbnail-link:hover .play-overlay {
      opacity: 0.9;
    }
    .thumbnail-link:hover .thumbnail-container {
      border-color: #1f6feb;
      box-shadow: 0 0 0 3px rgba(31,111,235,0.3);
    }
  `,
}
