'use client'

import { useState, useEffect } from 'react'

// Inline events data (avoiding JSON import issues)
const eventsData = [
  {
    "id": "evt-001",
    "emoji": "🤖",
    "title": "AI Startup Networking Rooftop Happy Hour",
    "venue": "230 Fifth Rooftop Bar",
    "datetime": "2026-04-13T17:30:00-04:00",
    "distance": 0.8,
    "price": 25,
    "type": "ai"
  },
  {
    "id": "evt-002",
    "emoji": "🤖",
    "title": "Fintech Startup Networking Rooftop Happy Hour",
    "venue": "230 Fifth Rooftop Bar",
    "datetime": "2026-03-26T17:30:00-04:00",
    "distance": 0.8,
    "price": 25,
    "type": "fintech"
  },
  {
    "id": "evt-007",
    "emoji": "🤖",
    "title": "NYC Tech Mixer 2026",
    "venue": "Arlo Williamsburg",
    "datetime": "2026-03-27T18:00:00-04:00",
    "distance": 3.2,
    "price": 0,
    "type": "tech"
  }
]

// Styles defined FIRST so all components can use them
const styles = {
  section: {
    backgroundColor: '#0d1117',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
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
  browseLink: {
    color: '#58a6ff',
    textDecoration: 'none',
    fontSize: '14px',
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
  eventsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  card: {
    border: '1px solid #30363d',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#161b22',
    transition: 'box-shadow 0.2s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  emoji: {
    fontSize: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    flex: 1,
    color: '#f0f6fc',
  },
  cardBody: {
    marginBottom: '12px',
  },
  venue: {
    fontSize: '14px',
    color: '#8b949e',
    margin: '4px 0',
  },
  datetime: {
    fontSize: '14px',
    color: '#8b949e',
    margin: '4px 0',
  },
  distance: {
    fontSize: '14px',
    color: '#8b949e',
    margin: '4px 0',
  },
  price: {
    fontSize: '14px',
    fontWeight: '500',
    margin: '4px 0',
  },
  freeBadge: {
    backgroundColor: '#238636',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  paidBadge: {
    backgroundColor: '#1f6feb',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  reserveButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#238636',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  reservedButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#6e7681',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  myTickets: {
    backgroundColor: '#161b22',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px',
    border: '1px solid #30363d',
  },
  myTicketsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  myTicketsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#f0f6fc',
  },
  checkGmailButton: {
    padding: '6px 12px',
    backgroundColor: '#1f6feb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  ticketsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  ticketCard: {
    border: '1px solid #30363d',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#0d1117',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  ticketTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#f0f6fc',
    flex: 1,
  },
  ticketBody: {
    marginBottom: '12px',
  },
  ticketVenue: {
    fontSize: '14px',
    color: '#8b949e',
    margin: '4px 0',
  },
  ticketDate: {
    fontSize: '14px',
    color: '#8b949e',
    margin: '4px 0',
  },
  qrSection: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#161b22',
    borderRadius: '8px',
    textAlign: 'center',
  },
  qrCode: {
    maxWidth: '200px',
    width: '100%',
    border: '2px solid #30363d',
    borderRadius: '8px',
  },
  qrNote: {
    fontSize: '12px',
    color: '#8b949e',
    marginTop: '8px',
  },
  noQr: {
    padding: '12px',
    backgroundColor: '#161b22',
    borderRadius: '8px',
    textAlign: 'center',
  },
  noQrText: {
    fontSize: '13px',
    color: '#8b949e',
    margin: 0,
  },
  ticketActions: {
    display: 'flex',
    gap: '8px',
  },
  checkStatusButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#1f6feb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  qrBadge: {
    backgroundColor: '#238636',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: '#9e6a03',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  pastEvents: {
    marginTop: '16px',
    borderTop: '1px solid #30363d',
    paddingTop: '16px',
  },
  pastEventsHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#8b949e',
  },
  pastEventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '12px',
  },
  pastEventItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#8b949e',
  },
  pastEventEmoji: {
    fontSize: '16px',
  },
  pastEventTitle: {
    flex: 1,
  },
  pastEventBadge: {
    backgroundColor: '#238636',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
  },
}

export default function EventbriteSection() {
  const [events, setEvents] = useState([])
  const [myTickets, setMyTickets] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, this would fetch from Gmail API
    // For now, load from mock data + localStorage
    const now = new Date()
    
    // Filter events into upcoming and past
    const upcoming = []
    const past = []
    
    eventsData.forEach(event => {
      const eventDate = new Date(event.datetime)
      if (eventDate < now) {
        past.push({ ...event, status: 'past' })
      } else {
        upcoming.push({ ...event, status: 'upcoming' })
      }
    })
    
    setEvents(upcoming)
    setPastEvents(past)
    
    // Load saved tickets from localStorage
    const saved = localStorage.getItem('myTickets')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMyTickets(parsed)
      } catch (e) {
        console.error('Failed to parse saved tickets')
      }
    }
    
    setLoading(false)
  }, [])

  const handleReserve = (event) => {
    const newTicket = {
      eventId: event.id,
      title: event.title,
      venue: event.venue,
      datetime: event.datetime,
      reservedAt: new Date().toISOString(),
      ticketCount: 1,
      status: 'reserved',
      qrCode: null // Will be populated from Gmail
    }
    
    const updated = [...myTickets, newTicket]
    setMyTickets(updated)
    localStorage.setItem('myTickets', JSON.stringify(updated))
    
    // Mark event as reserved
    setEvents(prev => prev.map(e => 
      e.id === event.id ? { ...e, reserved: true } : e
    ))
  }

  const checkEventbriteStatus = async (ticket) => {
    // TODO: Connect to Eventbrite API to verify ticket status
    alert(`Checking status for: ${ticket.title}\n\n(In production: This will verify your ticket via Eventbrite API)`)
  }

  const upcomingTickets = myTickets.filter(t => new Date(t.datetime) > new Date())

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎫 Eventbrite Events</h2>
        <a href="https://eventbrite.com" target="_blank" rel="noopener noreferrer" style={styles.browseLink}>
          Browse More ↗
        </a>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading events...</p>
      ) : (
        <>
          {/* Events Grid */}
          <div style={styles.eventsGrid}>
            {events.length === 0 ? (
              <p style={styles.empty}>No upcoming events</p>
            ) : (
              events.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onReserve={handleReserve}
                />
              ))
            )}
          </div>

          {/* My Tickets with QR Codes */}
          {upcomingTickets.length > 0 && (
            <div style={styles.myTickets}>
              <div style={styles.myTicketsHeader}>
                <h3 style={styles.myTicketsTitle}>
                  🎫 My Tickets ({upcomingTickets.length} tickets)
                </h3>
                <button 
                  style={styles.checkGmailButton}
                  onClick={async () => {
                    alert('🔍 Checking Gmail for QR codes...\n\nEmail: openclawian@gmail.com\nSearch: from:eventbrite.com')
                    // In production: call checkGmailForQRCodes()
                  }}
                >
                  📧 Check Gmail
                </button>
              </div>
              <div style={styles.ticketsList}>
                {upcomingTickets.map(ticket => (
                  <TicketCard 
                    key={ticket.eventId} 
                    ticket={ticket}
                    onCheckStatus={() => checkEventbriteStatus(ticket)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Events (Collapsible) - DISABLED FOR TESTING
          {pastEvents.length > 0 && (
            <PastEventsSection events={pastEvents} />
          )}
          */}
        </>
      )}
    </section>
  )
}

function EventCard({ event, onReserve }) {
  const formatDateTime = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = date - now
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    // Show relative date (no calendar tracking needed)
    if (diffDays === 0) {
      if (diffHours < 1) return `Today (starting soon!)`
      return `Today • ${diffHours}h from now`
    }
    if (diffDays === 1) return `Tomorrow`
    if (diffDays <= 7) return `In ${diffDays} days`
    return `In ${Math.floor(diffDays / 7)} weeks`
  }

  const formatDistance = (miles) => {
    // Convert to kilometers for visitors
    const km = (miles * 1.60934).toFixed(1)
    return `${km} km away`
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.emoji}>{event.emoji}</span>
        <h3 style={styles.cardTitle}>{event.title}</h3>
      </div>
      
      <div style={styles.cardBody}>
        <p style={styles.venue}>{event.venue}</p>
        <p style={styles.datetime}>📅 {formatDateTime(event.datetime)}</p>
        {event.distance && (
          <p style={styles.distance}>📍 {formatDistance(event.distance)}</p>
        )}
        <p style={styles.price}>
          {event.price === 0 ? (
            <span style={styles.freeBadge}>🆓 FREE</span>
          ) : (
            <span style={styles.paidBadge}>💰 Paid</span>
          )}
        </p>
      </div>

      {!event.reserved ? (
        <button 
          style={styles.reserveButton}
          onClick={() => onReserve(event)}
        >
          🎫 Reserve
        </button>
      ) : (
        <button style={styles.reservedButton} disabled>
          ⏳ Reserved
        </button>
      )}
    </div>
  )
}

function TicketCard({ ticket, onCheckStatus }) {
  return (
    <div style={styles.ticketCard}>
      <div style={styles.ticketHeader}>
        <h4 style={styles.ticketTitle}>{ticket.title}</h4>
        {ticket.qrCode ? (
          <span style={styles.qrBadge}>🎁 QR Ready</span>
        ) : (
          <span style={styles.pendingBadge}>⏳ Awaiting QR</span>
        )}
      </div>
      
      <div style={styles.ticketBody}>
        <p style={styles.ticketVenue}>{ticket.venue}</p>
        <p style={styles.ticketDate}>
          📅 {new Date(ticket.datetime).toLocaleDateString()}
        </p>
        
        {ticket.qrCode ? (
          <div style={styles.qrSection}>
            <img src={ticket.qrCode} alt="QR Code" style={styles.qrCode} />
            <p style={styles.qrNote}>Show this at the event</p>
          </div>
        ) : (
          <div style={styles.noQr}>
            <p style={styles.noQrText}>
              📧 QR code will appear here after Eventbrite confirmation email is received
            </p>
          </div>
        )}
      </div>

      <div style={styles.ticketActions}>
        <button 
          style={styles.checkStatusButton}
          onClick={onCheckStatus}
        >
          ✓ Check Eventbrite Status
        </button>
      </div>
    </div>
  )
}

function PastEventsSection({ events }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={styles.pastEvents}>
      <button 
        style={styles.pastEventsHeader}
        onClick={() => setExpanded(!expanded)}
      >
        <span>📁 Past Events ({events.length})</span>
        <span>{expanded ? '▼' : '▶'}</span>
      </button>
      
      {expanded && (
        <div style={styles.pastEventsList}>
          {events.map(event => (
            <div key={event.id} style={styles.pastEventItem}>
              <span style={styles.pastEventEmoji}>{event.emoji}</span>
              <span style={styles.pastEventTitle}>{event.title}</span>
              <span style={styles.pastEventBadge}>✓ Attended</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

