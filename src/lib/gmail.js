/**
 * Gmail Integration for clawmmand-center
 * Extracts Eventbrite QR codes from confirmation emails
 * 
 * Email: openclawian@gmail.com
 */

const EVENTBRITE_SENDER = 'from:eventbrite.com OR from:@eventbrite.com'
const QR_SEARCH_QUERY = `${EVENTBRITE_SENDER} subject:(tickets OR confirmation OR order)`

/**
 * Search Gmail for Eventbrite confirmation emails
 * @returns {Array} Array of emails with QR codes
 */
export async function searchEventbriteEmails() {
  try {
    // In production, use Gmail API
    // For now, this is a placeholder for browser automation
    
    const response = await fetch('/api/gmail/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QR_SEARCH_QUERY })
    })
    
    if (!response.ok) {
      throw new Error('Gmail API error')
    }
    
    const data = await response.json()
    return data.emails || []
  } catch (error) {
    console.error('Failed to search Eventbrite emails:', error)
    return []
  }
}

/**
 * Extract QR code from an email
 * @param {string} emailId - Gmail message ID
 * @returns {Object} Email data with QR code
 */
export async function extractQRCode(emailId) {
  try {
    const response = await fetch(`/api/gmail/message/${emailId}`, {
      method: 'GET'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch email')
    }
    
    const data = await response.json()
    
    // Extract QR code from email HTML
    const qrCode = extractQRFromHTML(data.html)
    
    return {
      id: data.id,
      subject: data.subject,
      from: data.from,
      date: data.date,
      qrCode: qrCode,
      html: data.html
    }
  } catch (error) {
    console.error('Failed to extract QR code:', error)
    return null
  }
}

/**
 * Extract QR code image URL or data from email HTML
 * @param {string} html - Email HTML content
 * @returns {string|null} QR code image URL or data URL
 */
function extractQRFromHTML(html) {
  if (!html) return null
  
  // Look for QR code patterns in Eventbrite emails
  const qrPatterns = [
    /<img[^>]*src="([^"]*qr[^"]*)"[^>]*>/i,
    /<img[^>]*src="([^"]*barcode[^"]*)"[^>]*>/i,
    /<img[^>]*class="[^"]*qr[^"]*"[^>]*src="([^"]*)"[^>]*>/i,
    /data:image\/png;base64,([A-Za-z0-9+/=]+)/i
  ]
  
  for (const pattern of qrPatterns) {
    const match = html.match(pattern)
    if (match) {
      // Return the QR code URL or data URL
      return match[1] || match[0]
    }
  }
  
  return null
}

/**
 * Sync Eventbrite emails with dashboard tickets
 * @param {Array} tickets - Current tickets in dashboard
 * @returns {Array} Updated tickets with QR codes
 */
export async function syncEventbriteTickets(tickets) {
  const emails = await searchEventbriteEmails()
  
  const updatedTickets = tickets.map(ticket => {
    // Find matching email for this ticket
    const matchingEmail = emails.find(email => 
      email.subject.includes(ticket.title) ||
      email.subject.includes(ticket.eventId)
    )
    
    if (matchingEmail && matchingEmail.qrCode) {
      return {
        ...ticket,
        qrCode: matchingEmail.qrCode,
        status: 'confirmed'
      }
    }
    
    return ticket
  })
  
  return updatedTickets
}

/**
 * Poll Gmail for new Eventbrite emails
 * @param {Function} callback - Function to call with new emails
 * @param {number} interval - Polling interval in ms (default: 60000 = 1 min)
 */
export function startGmailPoll(callback, interval = 60000) {
  // Initial fetch
  searchEventbriteEmails().then(callback)
  
  // Set up polling
  const pollId = setInterval(() => {
    searchEventbriteEmails().then(callback)
  }, interval)
  
  return () => clearInterval(pollId)
}
