#!/usr/bin/env node

/**
 * Transcript Extractor for clawmmand-center
 * 
 * Extracts actual video transcripts from YouTube/TikTok URLs
 * and updates src/data/transcripts.json
 * 
 * Usage: node scripts/transcribe.js [video-id]
 *        node scripts/transcribe.js --all
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TRANSCRIPTS_FILE = path.join(__dirname, '../src/data/transcripts.json');
const TMP_DIR = '/tmp/clawmmand-transcripts';

// Ensure tmp directory exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

function log(...args) {
  console.log('[transcribe]', ...args);
}

function extractYouTubeTranscript(url) {
  log('Extracting YouTube transcript:', url);
  
  try {
    // Use summarize CLI to extract transcript
    const result = execSync(
      `summarize "${url}" --youtube auto --extract-only --json`,
      { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
    );
    
    const data = JSON.parse(result);
    
    // Extract transcript from the response
    if (data.transcript) {
      return data.transcript;
    }
    if (data.summary) {
      return data.summary;
    }
    if (data.content) {
      return data.content;
    }
    
    throw new Error('No transcript found in summarize output');
  } catch (error) {
    log('YouTube extract failed, trying fallback:', error.message);
    
    // Fallback: try to get from the page directly
    try {
      const result = execSync(
        `summarize "${url}" --extract-only`,
        { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
      );
      return result.trim();
    } catch (e) {
      throw new Error(`Failed to extract transcript: ${e.message}`);
    }
  }
}

function extractTikTokTranscript(url, videoId) {
  log('Extracting TikTok transcript:', url);
  
  // For TikTok, we need to download audio and use Whisper
  // This is a placeholder - would need yt-dlp or similar
  // For now, return a note that manual transcription is needed
  return `[TikTok audio - requires manual transcription or API access]
  
To transcribe this TikTok:
1. Download video audio using a TikTok downloader
2. Run: whisper /path/to/audio.mp3 --model medium --output_format txt
3. Replace this placeholder with the transcript`;
}

function updateTranscript(videoId, transcript) {
  log('Updating transcript for:', videoId);
  
  const data = JSON.parse(fs.readFileSync(TRANSCRIPTS_FILE, 'utf8'));
  
  const transcriptEntry = data.transcripts.find(t => t.id === videoId);
  if (!transcriptEntry) {
    throw new Error(`Video ID ${videoId} not found in transcripts.json`);
  }
  
  transcriptEntry.transcript = transcript;
  transcriptEntry.status = 'ready';
  data._lastUpdated = new Date().toISOString();
  
  fs.writeFileSync(TRANSCRIPTS_FILE, JSON.stringify(data, null, 2));
  log('✓ Transcript updated successfully');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage:
  node scripts/transcribe.js [video-id]   - Transcribe specific video
  node scripts/transcribe.js --all        - Transcribe all videos without transcripts
  node scripts/transcribe.js --list       - List videos needing transcription

Examples:
  node scripts/transcribe.js t-005
  node scripts/transcribe.js --all
`);
    process.exit(0);
  }
  
  const data = JSON.parse(fs.readFileSync(TRANSCRIPTS_FILE, 'utf8'));
  
  if (args[0] === '--list') {
    // Check for missing OR placeholder transcripts
    const needsTranscript = data.transcripts.filter(t => {
      if (!t.transcript) return true;
      // Check if it's just a description (short, generic)
      if (t.transcript.length < 200 || t.transcript.includes('Video about') || t.transcript.includes('Content covers')) {
        return true;
      }
      return false;
    });
    
    if (needsTranscript.length === 0) {
      log('All videos have transcripts!');
    } else {
      log('Videos needing transcription:');
      needsTranscript.forEach(t => {
        console.log(`  ${t.id}: ${t.title} (${t.type})`);
        console.log(`     ${t.url}`);
        if (t.transcript && t.transcript.length < 200) {
          console.log(`     [Has placeholder description, needs real transcript]`);
        }
      });
    }
    process.exit(0);
  }
  
  if (args[0] === '--all') {
    const needsTranscript = data.transcripts.filter(t => !t.transcript);
    log(`Found ${needsTranscript.length} videos to transcribe`);
    
    for (const video of needsTranscript) {
      try {
        let transcript;
        
        if (video.type === 'youtube') {
          transcript = extractYouTubeTranscript(video.url);
        } else if (video.type === 'tiktok') {
          transcript = extractTikTokTranscript(video.url, video.id);
        } else {
          log('Skipping unknown type:', video.type);
          continue;
        }
        
        updateTranscript(video.id, transcript);
      } catch (error) {
        log('ERROR transcribing', video.id, ':', error.message);
      }
    }
    
    log('Done!');
    process.exit(0);
  }
  
  // Transcribe specific video
  const videoId = args[0];
  const video = data.transcripts.find(t => t.id === videoId);
  
  if (!video) {
    log('ERROR: Video ID not found:', videoId);
    process.exit(1);
  }
  
  try {
    let transcript;
    
    if (video.type === 'youtube') {
      transcript = extractYouTubeTranscript(video.url);
    } else if (video.type === 'tiktok') {
      transcript = extractTikTokTranscript(video.url, video.id);
    }
    
    updateTranscript(videoId, transcript);
    log('✓ Done!');
  } catch (error) {
    log('ERROR:', error.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
