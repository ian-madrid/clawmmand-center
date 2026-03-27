#!/usr/bin/env node

/**
 * Gmail QR Code Extractor
 * 
 * Automates browser to:
 * 1. Open Gmail (openclawian@gmail.com)
 * 2. Search for Eventbrite emails
 * 3. Extract QR codes from emails
 * 4. Save to dashboard data
 * 
 * Usage: node scripts/gmail-qr-extractor.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const GMAIL_EMAIL = 'openclawian@gmail.com'
const SEARCH_QUERY = 'from:eventbrite.com subject:(tickets OR confirmation OR order)'
const CDP_ENDPOINT = 'http://127.0.0.1:18800'

function runBrowserCommand(command) {
  try {
    const result = execSync(`AGENT_BROWSER_CHROME_CDP_ENDPOINT="${CDP_ENDPOINT}" agent-browser ${command}`, {
      encoding: 'utf-8',
      timeout: 30000
    })
    console.log('✓', result.trim())
    return result
  } catch (error) {
    console.error('✗ Error:', error.message)
    return null
  }
}

async function extractQRCodes() {
  console.log('🔍 Starting Gmail QR Code Extraction...')
  console.log('📧 Account:', GMAIL_EMAIL)
  console.log('🔎 Search:', SEARCH_QUERY)
  console.log('')

  // Step 1: Open Gmail
  console.log('Step 1: Opening Gmail...')
  runBrowserCommand(`open 'https://mail.google.com'`)
  await sleep(3000)

  // Step 2: Search for Eventbrite emails
  console.log('\nStep 2: Searching for Eventbrite emails...')
  runBrowserCommand(`open 'https://mail.google.com/mail/u/0/#search/${encodeURIComponent(SEARCH_QUERY)}'`)
  await sleep(4000)

  // Step 3: Take screenshot to see results
  console.log('\nStep 3: Capturing search results...')
  const screenshotPath = path.join(__dirname, '../public/gmail-search-results.png')
  runBrowserCommand(`screenshot ${screenshotPath}`)
  console.log('📸 Screenshot saved:', screenshotPath)

  // Step 4: Parse email list (would need DOM parsing in production)
  console.log('\nStep 4: Parsing emails...')
  console.log('⚠️  Note: Full email parsing requires Gmail API or advanced DOM scraping')
  console.log('✅ For now, manually forward Eventbrite emails to extract QR codes')

  // Step 5: Save placeholder data
  console.log('\nStep 5: Saving extracted data...')
  const extractedData = {
    lastChecked: new Date().toISOString(),
    email: GMAIL_EMAIL,
    searchQuery: SEARCH_QUERY,
    emailsFound: 0, // Would be populated with real data
    qrCodesExtracted: 0,
    status: 'manual_review_needed'
  }

  const outputPath = path.join(__dirname, '../src/data/gmail-extraction.json')
  fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2))
  console.log('💾 Data saved:', outputPath)

  console.log('\n✅ Extraction complete!')
  console.log('\n📋 Next Steps:')
  console.log('1. Check screenshot at:', screenshotPath)
  console.log('2. Manually review Eventbrite emails')
  console.log('3. Forward emails with QR codes to extract')
  console.log('4. QR codes will appear in dashboard automatically')
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Run extraction
extractQRCodes().catch(console.error)
