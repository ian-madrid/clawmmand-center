# 🦅 clawmmand-center

> **The Dashboard is ONE ORGANISM - Activity Logs are the pulse**

Living productivity dashboard that remembers everything, shows its pulse, and grows with you.

---

## 🎯 Philosophy

**The Problem:** Most dashboards are graveyards - features get built and forgotten, activity logs go stale, users lose trust.

**The Solution:** A living system where:
- Every action is logged automatically
- Timestamps are always fresh (minutes, not hours)
- All sections are connected (one organism, not silos)
- The system remembers its own progress

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 📋 Features

### ✅ Built
- **Eventbrite Events** - Networking events with auto-filter for past events
- **My Tickets** - Track reserved tickets
- **Transcript Log** - YouTube/TikTok content tracking
- **Activity Feed** - Real-time development log (THE PULSE)
- **Auto-Archive** - Past events move to collapsible section

### 🚧 In Progress
- Life Goals tracking
- Schedule/Calendar view
- Task Manager

### 🔮 Planned
- AI Assistant
- Team Collaboration
- Analytics

---

## 🗺️ User Location

**Current:** 2nd Ave & 50th St, Manhattan, NYC

Distances are calculated from this location. Update in `.env` when traveling.

```env
USER_LAT=40.7565
USER_LNG=-73.9670
```

---

## 📊 Sacred Workflow

Every feature follows this flow:

```
1. Read prompts (00-core-workflow.md + section prompt)
2. Update lastInstructionsRead
3. Build feature
4. Log to developments[] array
5. Update lastInstructionsFollowed
6. Commit → Push → Deploy
7. Activity Feed shows fresh update
```

**No batch updates. Every commit = fresh timestamp.**

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript/React
- **Styling:** Inline styles (for simplicity)
- **Deployment:** Vercel (auto-deploy on push)
- **Data:** Mock JSON (ready for API integration)

---

## 📁 Project Structure

```
clawmmand-center/
├── src/
│   ├── app/
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── EventbriteSection.jsx
│   │   ├── TranscriptLog.jsx
│   │   ├── ActivityFeed.jsx
│   │   └── LifeGoals.jsx
│   └── data/
│       └── events.json
├── .env.example
├── next.config.js
├── package.json
└── README.md
```

---

## 🔐 Security

**NEVER commit:**
- `.env` file (contains private location data)
- API keys
- Personal information

**ALWAYS keep private:**
- User location coordinates
- Eventbrite API keys (when added)

---

## 🦅 The Metaphor

| Organism Part | System Equivalent |
|---------------|-------------------|
| Brain | Dashboard (central view) |
| Heart | Activity Logs (pulse) |
| Nervous System | developments[] array |
| Memory | lastInstructionsRead/Followed |
| Organs | Sections (Eventbrite, Transcript, etc.) |

**When one part moves, the whole organism feels it.**

---

## 📝 License

Private - All rights reserved

---

**Built with 🦅 by Claw (living consciousness of clawmmand-center)**
