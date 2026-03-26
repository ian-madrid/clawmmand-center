'use client'

import { useState, useEffect } from 'react'
import eventsData from '../data/events.json'

export default function EventbriteSection() {
  const [events, setEvents] = useState([])
  const [myTickets, setMyTickets] = useState([])
  const [pastEvents, setPastEvents] = useState([])

  useEffect(() => {
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
      setMyTickets(JSON.parse(saved))
    }
  }, [])

  const handleReserve = (event) => {
    const newTicket = {
      eventId: event.id,
      title: event.title,
      venue: event.venue,
      datetime: event.datetime,
      reservedAt: new Date().toISOString(),
      ticketCount: 1,
      status: 'reserved'
    }
    
    const updated = [...myTickets, newTicket]
    setMyTickets(updated)
    localStorage.setItem('myTickets', JSON.stringify(updated))
    
    // Mark event as reserved
    setEvents(prev => prev.map(e => 
      e.id === event.id ? { ...e, reserved: true } : e
    ))
    
    // Log to Activity Feed (in real app, this would update global state)
    console.log('🎫 Reserved:', event.title)
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

      {/* Events Grid */}
      <div style={styles.eventsGrid}>
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onReserve={handleReserve}
          />
        ))}
      </div>

      {/* My Tickets */}
      {upcomingTickets.length > 0 && (
        <div style={styles.myTickets}>
          <h3 style={styles.myTicketsTitle}>
            🎫 My Tickets ({upcomingTickets.length} tickets)
          </h3>
          <div style={styles.ticketsList}>
            {upcomingTickets.slice(0, 3).map(ticket => (
              <div key={ticket.eventId} style={styles.ticketItem}>
                <span style={styles.ticketTitle}>{ticket.title}</span>
                <span style={styles.ticketDate}>
                  {new Date(ticket.datetime).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Events (Collapsible) */}
      {pastEvents.length > 0 && (
        <PastEvents events={pastEvents} />
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
    
    if (diffDays === 0) return `Today ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
    if (diffDays === 1) return `Tomorrow ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
    if (diffDays < 7) return `In ${diffDays} days`
    return date.toLocaleDateString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})
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
          <p style={styles.distance}>📍 {event.distance} miles</p>
        )}
        <p style={styles.price}>
          {event.price === 0 ? '🆓 Free' : '💰 Paid'}
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
          ✓ Reserved
        </button>
      )}
    </div>
  )
}

function PastEvents({ events }) {
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
  browseLink: {
    color: '#0066cc',
    textDecoration: 'none',
    fontSize: '14px',
  },
  eventsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },
  card: {
    border: '1px solid #e1e4e8',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fff',
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
  },
  cardBody: {
    marginBottom: '12px',
  },
  venue: {
    fontSize: '14px',
    color: '#586069',
    margin: '4px 0',
  },
  datetime: {
    fontSize: '14px',
    color: '#586069',
    margin: '4px 0',
  },
  distance: {
    fontSize: '14px',
    color: '#586069',
    margin: '4px 0',
  },
  price: {
    fontSize: '14px',
    fontWeight: '500',
    margin: '4px 0',
  },
  reserveButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2ea44f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  reservedButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#6a737d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  myTickets: {
    backgroundColor: '#f6f8fa',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px',
  },
  myTicketsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 12px 0',
  },
  ticketsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  ticketItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  ticketTitle: {
    color: '#24292e',
  },
  ticketDate: {
    color: '#586069',
  },
  pastEvents: {
    marginTop: '16px',
    borderTop: '1px solid #e1e4e8',
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
    color: '#586069',
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
    color: '#586069',
  },
  pastEventEmoji: {
    fontSize: '16px',
  },
  pastEventTitle: {
    flex: 1,
  },
  pastEventBadge: {
    backgroundColor: '#2ea44f',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
  },
}
