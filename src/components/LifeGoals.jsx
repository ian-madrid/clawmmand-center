'use client'

import { useState, useEffect } from 'react'

// Build: 2026-03-27 17:21 - Research to Action Pipeline
export default function LifeGoals() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedProject, setExpandedProject] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // First try localStorage (for saved changes)
    const saved = localStorage.getItem('life-goals')
    if (saved) {
      try {
        setProjects(JSON.parse(saved))
        setLoading(false)
        return
      } catch (e) {
        console.error('Failed to parse saved life goals:', e)
      }
    }
    
    // Fall back to fetching from server
    fetch('/data/life-goals.json?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load life goals:', err)
        setLoading(false)
      })
  }, [])

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#3fb950'
    if (progress >= 50) return '#d29922'
    return '#1f6feb'
  }

  const getStatusBadge = (status) => {
    const colors = {
      researching: '#1f6feb',
      planning: '#d29922',
      executing: '#ff7b72',
      completed: '#3fb950'
    }
    return colors[status] || '#6e7681'
  }

  const getDaysUntil = (dateStr) => {
    const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
    if (days < 0) return { text: `${Math.abs(days)}d overdue`, color: '#ff7b72' }
    if (days === 0) return { text: 'DUE TODAY', color: '#ff7b72' }
    if (days <= 7) return { text: `${days}d left`, color: '#d29922' }
    return { text: `${days}d`, color: '#8b949e' }
  }

  // Update task status and save to localStorage
  const updateTaskStatus = (projectId, taskType, taskId, updates) => {
    setProjects(prevProjects => {
      const newProjects = prevProjects.map(project => {
        if (project.id !== projectId) return project
        
        const newProject = { ...project }
        if (taskType === 'deadline') {
          newProject.deadlines = project.deadlines.map(d => 
            d.id === taskId ? { ...d, ...updates } : d
          )
        } else if (taskType === 'action') {
          newProject.actions = project.actions.map(a => 
            a.id === taskId ? { ...a, ...updates } : a
          )
        }
        
        return newProject
      })
      
      // Save ALL projects to localStorage after the map completes
      localStorage.setItem('life-goals', JSON.stringify(newProjects))
      return newProjects
    })
  }

  const updateDeadline = (projectId, taskId, updates) => updateTaskStatus(projectId, 'deadline', taskId, updates)
  const updateAction = (projectId, taskId, updates) => updateTaskStatus(projectId, 'action', taskId, updates)

  if (loading) {
    return (
      <section style={styles.section}>
        <p style={styles.loading}>Loading life goals...</p>
      </section>
    )
  }

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 Life Goals</h2>
        <button style={styles.addButton}>+ New Goal</button>
      </div>

      {projects.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyTitle}>No goals yet</p>
          <p style={styles.emptyText}>Add your first life goal to get started</p>
          <button style={styles.emptyButton}>+ Create Goal</button>
        </div>
      ) : (
        <div style={styles.projectsList}>
          {projects.map(project => (
            <div key={project.id} style={styles.projectCard}>
              {/* Header */}
              <div style={styles.projectHeader}>
                <div style={styles.projectInfo}>
                  <h3 style={styles.projectTitle}>{project.title}</h3>
                  <span 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusBadge(project.status)
                    }}
                  >
                    {project.status}
                  </span>
                </div>
                <div style={styles.progressSection}>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${project.progress}%`,
                        backgroundColor: getProgressColor(project.progress)
                      }}
                    />
                  </div>
                  <span style={styles.progressText}>{project.progress}%</span>
                </div>
              </div>

              {/* Expandable Content */}
              <button
                style={styles.expandButton}
                onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              >
                {expandedProject === project.id ? '▼ Collapse' : '▶ Expand Details'}
              </button>

              {expandedProject === project.id && (
                <div style={styles.projectDetails}>
                  {/* Tabs */}
                  <div style={styles.tabs}>
                    {['overview', 'deadlines', 'actions', 'contacts', 'costs'].map(tab => (
                      <button
                        key={tab}
                        style={activeTab === tab ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div style={styles.tabContent}>
                    {activeTab === 'overview' && (
                      <OverviewTab project={project} getDaysUntil={getDaysUntil} />
                    )}
                    {activeTab === 'deadlines' && (
                      <DeadlinesTab 
                        projectId={project.id}
                        deadlines={project.deadlines} 
                        getDaysUntil={getDaysUntil}
                        onUpdateDeadline={(taskId, updates) => updateDeadline(project.id, taskId, updates)}
                      />
                    )}
                    {activeTab === 'actions' && (
                      <ActionsTab 
                        projectId={project.id}
                        actions={project.actions}
                        onUpdateAction={(taskId, updates) => updateAction(project.id, taskId, updates)}
                      />
                    )}
                    {activeTab === 'contacts' && (
                      <ContactsTab contacts={project.contacts} />
                    )}
                    {activeTab === 'costs' && (
                      <CostsTab costs={project.costs} scholarships={project.scholarships} />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// Helper functions
function getStatusColor(status) {
  const colors = {
    pending: '#8b949e',
    processing: '#1f6feb',
    completed: '#3fb950',
    deferred: '#d29922',
    cancelled: '#6e7681'
  }
  return colors[status] || '#8b949e'
}

// Tab Components
function OverviewTab({ project, getDaysUntil }) {
  const upcomingDeadlines = (project.deadlines || [])
    .filter(d => d.status !== 'completed')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)

  const pendingActions = (project.actions || [])
    .filter(a => a.status === 'pending')
    .slice(0, 5)

  return (
    <div style={styles.tabPanel}>
      {/* Next Action */}
      {pendingActions.length > 0 && (
        <div style={styles.nextActionCard}>
          <h4 style={styles.cardTitle}>🎯 Next Action</h4>
          <p style={styles.nextActionText}>{pendingActions[0].title}</p>
          {pendingActions[0].dueDate && (
            <span style={styles.dueBadge}>
              Due: {new Date(pendingActions[0].dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>📅 Upcoming Deadlines</h4>
          {upcomingDeadlines.map(d => {
            const days = getDaysUntil(d.date)
            return (
              <div key={d.id} style={styles.deadlineItem}>
                <span style={styles.deadlineTitle}>{d.title}</span>
                <span style={{...styles.daysBadge, backgroundColor: days.color}}>
                  {days.text}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{project.deadlines?.filter(d => d.status === 'completed').length || 0}</div>
          <div style={styles.statLabel}>Deadlines Met</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{project.actions?.filter(a => a.status === 'completed').length || 0}</div>
          <div style={styles.statLabel}>Tasks Done</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{project.contacts?.length || 0}</div>
          <div style={styles.statLabel}>Contacts</div>
        </div>
      </div>
    </div>
  )
}

function DeadlinesTab({ projectId, deadlines, getDaysUntil, onUpdateDeadline }) {
  if (!deadlines || deadlines.length === 0) {
    return <p style={styles.emptyText}>No deadlines yet</p>
  }

  const sorted = [...deadlines].sort((a, b) => new Date(a.date) - new Date(b.date))

  const handleStatusChange = (id, newStatus) => {
    if (onUpdateDeadline) onUpdateDeadline(id, { status: newStatus })
  }

  return (
    <div style={styles.deadlinesList}>
      {sorted.map(d => {
        const days = getDaysUntil(d.date)
        return (
          <div key={d.id} style={{
            ...styles.deadlineRow,
            opacity: d.status === 'cancelled' ? 0.5 : 1,
            backgroundColor: d.status === 'completed' ? '#0d1117' : '#0d1117'
          }}>
            <div style={styles.deadlineInfo}>
              <select
                value={d.status || 'pending'}
                onChange={(e) => handleStatusChange(d.id, e.target.value)}
                style={{
                  ...styles.statusSelect,
                  borderColor: getStatusColor(d.status)
                }}
              >
                <option value="pending">⏳ Pending</option>
                <option value="processing">🔄 Processing</option>
                <option value="completed">✅ Done</option>
                <option value="deferred">⏸️ Deferred</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
              <span style={{
                ...styles.deadlineText,
                textDecoration: d.status === 'completed' || d.status === 'cancelled' ? 'line-through' : 'none',
                color: d.status === 'completed' ? '#3fb950' : d.status === 'cancelled' ? '#8b949e' : '#c9d1d9'
              }}>
                {d.title}
              </span>
            </div>
            <div style={styles.deadlineMeta}>
              <span style={styles.deadlineDate}>
                {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              {d.status !== 'completed' && d.status !== 'cancelled' && (
                <span style={{...styles.daysBadge, backgroundColor: days.color}}>
                  {days.text}
                </span>
              )}
              {d.priority && (
                <span style={{
                  ...styles.priorityBadge,
                  backgroundColor: d.priority === 'high' ? '#ff7b72' : '#d29922'
                }}>
                  {d.priority}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ActionsTab({ projectId, actions, onUpdateAction }) {
  const [copiedId, setCopiedId] = useState(null)
  const [showTemplate, setShowTemplate] = useState(null)

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleStatusChange = (id, newStatus) => {
    if (onUpdateAction) onUpdateAction(id, { status: newStatus })
  }

  if (!actions || actions.length === 0) {
    return <p style={styles.emptyText}>No action items yet</p>
  }

  return (
    <div style={styles.actionsList}>
      {actions.map(a => (
        <div key={a.id} style={styles.actionItem}>
          <div style={styles.actionRow}>
            <select
              value={a.status || 'pending'}
              onChange={(e) => handleStatusChange(a.id, e.target.value)}
              style={{
                ...styles.statusSelect,
                borderColor: getStatusColor(a.status),
                minWidth: '120px'
              }}
            >
              <option value="pending">⏳ Pending</option>
              <option value="processing">🔄 Processing</option>
              <option value="completed">✅ Done</option>
              <option value="deferred">⏸️ Deferred</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
            <span style={{
              ...styles.actionText,
              textDecoration: a.status === 'completed' || a.status === 'cancelled' ? 'line-through' : 'none',
              color: a.status === 'completed' ? '#3fb950' : a.status === 'cancelled' ? '#8b949e' : '#c9d1d9',
              flex: 1
            }}>
              {a.title}
            </span>
            {a.template && (
              <button 
                style={styles.templateButton}
                onClick={() => setShowTemplate(showTemplate === a.id ? null : a.id)}
              >
                📝 {a.template}
              </button>
            )}
          </div>
          
          {/* Template Preview with Copy */}
          {showTemplate === a.id && a.templateContent && (
            <div style={styles.templatePreview}>
              <div style={styles.templateHeader}>
                <span style={styles.templateLabel}>{a.template} Template</span>
                <button
                  style={copiedId === a.id ? styles.copyButtonSuccess : styles.copyButton}
                  onClick={() => handleCopy(a.templateContent, a.id)}
                >
                  {copiedId === a.id ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre style={styles.templateContent}>{a.templateContent}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ContactsTab({ contacts }) {
  if (!contacts || contacts.length === 0) {
    return <p style={styles.emptyText}>No contacts yet</p>
  }

  return (
    <div style={styles.contactsList}>
      {contacts.map(c => (
        <div key={c.id} style={styles.contactCard}>
          <div style={styles.contactHeader}>
            <h4 style={styles.contactName}>{c.name}</h4>
            {c.role && <span style={styles.contactRole}>{c.role}</span>}
          </div>
          <div style={styles.contactDetails}>
            {c.email && (
              <a href={`mailto:${c.email}`} style={styles.contactLink}>
                📧 {c.email}
              </a>
            )}
            {c.phone && (
              <a href={`tel:${c.phone}`} style={styles.contactLink}>
                📞 {c.phone}
              </a>
            )}
          </div>
          {c.lastContact && (
            <div style={styles.contactMeta}>
              Last contact: {new Date(c.lastContact).toLocaleDateString()}
              {c.followUp && ` • Follow up: ${new Date(c.followUp).toLocaleDateString()}`}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CostsTab({ costs, scholarships }) {
  const totalCost = costs?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0
  const totalScholarships = scholarships?.filter(s => s.status === 'awarded').reduce((sum, s) => sum + (s.amount || 0), 0) || 0
  const remaining = totalCost - totalScholarships

  return (
    <div style={styles.costsSection}>
      {/* Summary */}
      <div style={styles.costSummary}>
        <div style={styles.costRow}>
          <span>Total Cost:</span>
          <span style={styles.costAmount}>${totalCost.toLocaleString()}</span>
        </div>
        <div style={styles.costRow}>
          <span>Scholarships:</span>
          <span style={{...styles.costAmount, color: '#3fb950'}}>
            -${totalScholarships.toLocaleString()}
          </span>
        </div>
        <div style={{...styles.costRow, borderTop: '1px solid #30363d', paddingTop: '12px'}}>
          <span>Remaining:</span>
          <span style={{...styles.costAmount, color: remaining > 0 ? '#ff7b72' : '#3fb950'}}>
            ${remaining.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Scholarships */}
      {scholarships && scholarships.length > 0 && (
        <div style={styles.scholarshipsList}>
          <h4 style={styles.cardTitle}>💰 Scholarships</h4>
          {scholarships.map(s => (
            <div key={s.id} style={styles.scholarshipRow}>
              <div style={styles.scholarshipInfo}>
                <span style={styles.scholarshipName}>{s.name}</span>
                <span style={styles.scholarshipAmount}>${s.amount?.toLocaleString()}</span>
              </div>
              <span style={{
                ...styles.scholarshipStatus,
                backgroundColor: s.status === 'awarded' ? '#3fb950' : s.status === 'pending' ? '#d29922' : '#6e7681'
              }}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#f0f6fc',
  },
  addButton: {
    backgroundColor: '#238636',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    color: '#ffffff',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f0f6fc',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#8b949e',
    marginBottom: '16px',
  },
  emptyButton: {
    backgroundColor: '#1f6feb',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  projectCard: {
    backgroundColor: '#161b22',
    borderRadius: '10px',
    padding: '12px',
    border: '1px solid #30363d',
  },
  projectHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  projectInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: '15px',
    fontWeight: '600',
    margin: 0,
    color: '#f0f6fc',
  },
  statusBadge: {
    padding: '3px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  progressSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  progressBar: {
    flex: 1,
    height: '6px',
    backgroundColor: '#21262d',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '12px',
    color: '#8b949e',
    minWidth: '35px',
    textAlign: 'right',
  },
  expandButton: {
    width: '100%',
    backgroundColor: 'transparent',
    border: '1px dashed #30363d',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#8b949e',
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '10px',
    transition: 'all 0.2s',
  },
  projectDetails: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #30363d',
  },
  tabs: {
    display: 'flex',
    gap: '6px',
    marginBottom: '12px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  tab: {
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '6px',
    padding: '6px 10px',
    color: '#8b949e',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabActive: {
    backgroundColor: '#1f6feb',
    border: '1px solid #1f6feb',
    borderRadius: '6px',
    padding: '6px 10px',
    color: '#ffffff',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  tabContent: {
    minHeight: '100px',
  },
  tabPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    backgroundColor: '#0d1117',
    borderRadius: '8px',
    padding: '10px',
    border: '1px solid #21262d',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#f0f6fc',
  },
  nextActionCard: {
    backgroundColor: '#1f6feb20',
    border: '1px solid #1f6feb',
    borderRadius: '8px',
    padding: '10px',
  },
  nextActionText: {
    fontSize: '14px',
    color: '#f0f6fc',
    margin: '0 0 8px 0',
  },
  dueBadge: {
    fontSize: '11px',
    color: '#8b949e',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  statCard: {
    backgroundColor: '#0d1117',
    borderRadius: '8px',
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #21262d',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#f0f6fc',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: '#8b949e',
  },
  deadlinesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  deadlineRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#0d1117',
    borderRadius: '6px',
    border: '1px solid #21262d',
  },
  deadlineInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  statusSelect: {
    padding: '4px 8px',
    backgroundColor: '#0d1117',
    border: '1px solid',
    borderRadius: '4px',
    color: '#c9d1d9',
    fontSize: '12px',
    cursor: 'pointer',
    outline: 'none',
  },
  deadlineText: {
    fontSize: '13px',
    flex: 1,
  },
  deadlineMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  deadlineDate: {
    fontSize: '12px',
    color: '#8b949e',
  },
  daysBadge: {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#ffffff',
  },
  priorityBadge: {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  actionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  actionItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    backgroundColor: '#0d1117',
    borderRadius: '6px',
    border: '1px solid #21262d',
  },
  actionText: {
    fontSize: '13px',
    flex: 1,
    color: '#c9d1d9',
  },
  templateButton: {
    backgroundColor: '#1f6feb',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 8px',
    color: '#ffffff',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  templatePreview: {
    backgroundColor: '#0d1117',
    borderRadius: '6px',
    border: '1px solid #30363d',
    overflow: 'hidden',
  },
  templateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    backgroundColor: '#161b22',
    borderBottom: '1px solid #30363d',
  },
  templateLabel: {
    fontSize: '12px',
    color: '#8b949e',
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: '#238636',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 10px',
    color: '#ffffff',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  copyButtonSuccess: {
    backgroundColor: '#3fb950',
    border: 'none',
    borderRadius: '4px',
    padding: '4px 10px',
    color: '#ffffff',
    fontSize: '11px',
    cursor: 'default',
    fontWeight: '600',
  },
  templateContent: {
    padding: '10px',
    margin: 0,
    fontSize: '12px',
    color: '#c9d1d9',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  contactsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  contactCard: {
    backgroundColor: '#0d1117',
    borderRadius: '6px',
    padding: '10px',
    border: '1px solid #21262d',
  },
  contactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  contactName: {
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
    color: '#f0f6fc',
  },
  contactRole: {
    fontSize: '11px',
    color: '#8b949e',
  },
  contactDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  contactLink: {
    fontSize: '12px',
    color: '#58a6ff',
    textDecoration: 'none',
  },
  contactMeta: {
    fontSize: '11px',
    color: '#8b949e',
    marginTop: '6px',
    paddingTop: '6px',
    borderTop: '1px solid #21262d',
  },
  costsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  costSummary: {
    backgroundColor: '#0d1117',
    borderRadius: '8px',
    padding: '12px',
    border: '1px solid #21262d',
  },
  costRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#c9d1d9',
  },
  costAmount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f0f6fc',
  },
  scholarshipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  scholarshipRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: '#0d1117',
    borderRadius: '6px',
    border: '1px solid #21262d',
  },
  scholarshipInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  scholarshipName: {
    fontSize: '13px',
    color: '#c9d1d9',
  },
  scholarshipAmount: {
    fontSize: '12px',
    color: '#8b949e',
  },
  scholarshipStatus: {
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
}
