import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Lock, Users, FileText, Download, BarChart3, Eye, ArrowUpRight, LogOut,
  Trash2, AlertTriangle, X, RefreshCw, Globe, MousePointer, UserPlus,
  Pencil, Save, Search, WifiOff, Loader2, Calendar
} from 'lucide-react';
import Logo from './brand/Logo';
import './AdminDashboard.css';

import { getBackendUrl } from '../lib/apiConfig';
import { CALENDLY_30MIN_URL } from '../constants/contactLinks';

const API_URL = getBackendUrl();

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [dataError, setDataError] = useState('');
  const [initialLoad, setInitialLoad] = useState(false);
  const [activeTab, setActiveTab] = useState('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [giqFilter, setGiqFilter] = useState({ industry: '', minScore: '', crmStatus: '' });
  const [giqViewTarget, setGiqViewTarget] = useState(null);
  const [giqNotes, setGiqNotes] = useState('');
  const [giqStatus, setGiqStatus] = useState('');
  const [meetingLinkSending, setMeetingLinkSending] = useState(null);
  const [meetingLinkFeedback, setMeetingLinkFeedback] = useState('');
  const [meetingComposeTarget, setMeetingComposeTarget] = useState(null);
  const [meetingCalendlyUrl, setMeetingCalendlyUrl] = useState(CALENDLY_30MIN_URL);
  const [meetingProposedTimes, setMeetingProposedTimes] = useState('');
  const [meetingPersonalNote, setMeetingPersonalNote] = useState('');

  const fetchDashboardData = useCallback(async (isInitial = false) => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    if (!storedPassword) return;

    if (!API_URL) {
      setDataError('REACT_APP_BACKEND_URL is not set. Add it in Vercel or frontend/.env and rebuild.');
      return;
    }

    if (isInitial) setInitialLoad(true);
    else setRefreshing(true);
    setDataError('');

    try {
      const response = await fetch(
        `${API_URL}/api/admin/dashboard-data?password=${encodeURIComponent(storedPassword)}`
      );

      if (response.status === 401) {
        sessionStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
        setDashboardData(null);
        setError('Session expired. Please sign in again.');
        return;
      }

      if (!response.ok) {
        setDataError(`Failed to load dashboard (${response.status}). Check backend URL and CORS.`);
        return;
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setDataError('Cannot reach the API. Verify REACT_APP_BACKEND_URL and that the backend is running.');
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setInitialLoad(false);
      setRefreshing(false);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!API_URL) {
      setError('Backend URL not configured. Set REACT_APP_BACKEND_URL in your environment.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminAuth', password);
        fetchDashboardData(true);
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Cannot connect to API. Check REACT_APP_BACKEND_URL and backend status.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!API_URL) return;
    if (activeTab === 'growthiq') {
      const storedPassword = sessionStorage.getItem('adminAuth');
      window.open(`${API_URL}/api/growthiq/export/csv?password=${encodeURIComponent(storedPassword)}`, '_blank');
      return;
    }
    window.open(`${API_URL}/api/leads/export/csv`, '_blank');
  };

  const handleGiqUpdate = async (reportId) => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    try {
      const body = {};
      if (giqStatus) body.crm_status = giqStatus;
      if (giqNotes !== undefined) body.internal_notes = giqNotes;
      const response = await fetch(
        `${API_URL}/api/growthiq/assessment/${reportId}?password=${encodeURIComponent(storedPassword)}`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
      );
      if (response.ok) {
        fetchDashboardData();
        setGiqViewTarget(null);
      }
    } catch (err) {
      console.error('Failed to update GrowthIQ assessment:', err);
    }
  };

  const openGiqView = (assessment) => {
    setGiqViewTarget(assessment);
    setGiqNotes(assessment.internal_notes || '');
    setGiqStatus(assessment.crm_status || 'analytics_only');
    setMeetingLinkFeedback('');
  };

  const openMeetingCompose = (assessment) => {
    const business = assessment.business_name || 'your business';
    setMeetingComposeTarget(assessment);
    setMeetingCalendlyUrl(assessment.last_meeting_calendly_url || CALENDLY_30MIN_URL);
    setMeetingProposedTimes(assessment.last_meeting_proposed_times || '');
    setMeetingPersonalNote(
      assessment.last_meeting_personal_message
        || `We reviewed your GrowthIQ report for ${business} and would love to walk through the findings with you.`
    );
    setMeetingLinkFeedback('');
  };

  const handleSendMeetingLink = async (reportId, payload = {}) => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    if (!storedPassword || !API_URL) return;
    setMeetingLinkSending(reportId);
    setMeetingLinkFeedback('');
    try {
      const response = await fetch(
        `${API_URL}/api/growthiq/assessment/${reportId}/send-meeting-link?password=${encodeURIComponent(storedPassword)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            calendly_url: payload.calendlyUrl || CALENDLY_30MIN_URL,
            proposed_times: payload.proposedTimes || '',
            personal_message: payload.personalMessage || '',
          }),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = data.detail || `Request failed (${response.status})`;
        if (response.status === 404 && detail === 'Not Found') {
          throw new Error('Meeting link API is not live yet. Redeploy the Railway backend, then try again.');
        }
        throw new Error(typeof detail === 'string' ? detail : 'Could not send meeting link.');
      }
      setMeetingLinkFeedback('Meeting link sent successfully.');
      setMeetingComposeTarget(null);
      if (data.assessment) {
        setGiqViewTarget(data.assessment);
        setGiqStatus(data.assessment.crm_status || giqStatus);
      }
      fetchDashboardData();
    } catch (err) {
      setMeetingLinkFeedback(err.message || 'Could not send meeting link.');
    } finally {
      setMeetingLinkSending(null);
    }
  };

  const submitMeetingCompose = (e) => {
    e.preventDefault();
    if (!meetingComposeTarget?.report_id) return;
    handleSendMeetingLink(meetingComposeTarget.report_id, {
      calendlyUrl: meetingCalendlyUrl.trim(),
      proposedTimes: meetingProposedTimes.trim(),
      personalMessage: meetingPersonalNote.trim(),
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setDashboardData(null);
    setPassword('');
    setDataError('');
  };

  const handleDeleteLead = async (leadId, leadType) => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    try {
      const response = await fetch(
        `${API_URL}/api/leads/${leadType}/${leadId}?password=${encodeURIComponent(storedPassword)}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        fetchDashboardData();
        setShowDeleteModal(false);
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const handleClearAll = async (type) => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    try {
      const response = await fetch(
        `${API_URL}/api/leads/clear-all?password=${encodeURIComponent(storedPassword)}&lead_type=${type}`,
        { method: 'DELETE' }
      );
      if (response.ok) {
        fetchDashboardData();
        setShowDeleteModal(false);
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Failed to clear leads:', err);
    }
  };

  const openDeleteModal = (target) => {
    setDeleteTarget(target);
    setShowDeleteModal(true);
  };

  const openEditModal = (lead, leadType) => {
    setEditTarget({ ...lead, leadType });
    setEditFormData(leadType === 'audit' ? {
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company_name: lead.company_name || '',
      website: lead.website || '',
      how_found_us: lead.how_found_us || '',
      status: lead.status || 'new'
    } : {
      name: lead.name || '',
      email: lead.email || ''
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    setEditSaving(true);
    try {
      const response = await fetch(
        `${API_URL}/api/leads/${editTarget.leadType}/${editTarget.id}?password=${encodeURIComponent(storedPassword)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editFormData)
        }
      );
      if (response.ok) {
        fetchDashboardData();
        setShowEditModal(false);
        setEditTarget(null);
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
    } finally {
      setEditSaving(false);
    }
  };

  useEffect(() => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    if (storedPassword) {
      setPassword(storedPassword);
      setIsAuthenticated(true);
      fetchDashboardData(true);
    }
  }, [fetchDashboardData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSource = (url) => {
    if (!url) return 'Direct';
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch {
      return url.substring(0, 30);
    }
  };

  const filteredLeads = useMemo(() => {
    const audit = (dashboardData?.audit_leads || []).map((lead) => ({ ...lead, leadType: 'audit' }));
    const guide = (dashboardData?.guide_leads || []).map((lead) => ({ ...lead, leadType: 'guide' }));
    let leads = [...audit, ...guide].sort(
      (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );

    if (typeFilter !== 'all') {
      leads = leads.filter((l) => l.leadType === typeFilter);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      leads = leads.filter((l) =>
        [l.name, l.email, l.company_name, l.website, l.how_found_us, l.referrer]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q))
      );
    }

    return leads;
  }, [dashboardData, searchQuery, typeFilter]);

  const filteredGrowthIQ = useMemo(() => {
    let items = dashboardData?.growth_assessments || [];
    if (giqFilter.industry) items = items.filter((g) => g.industry === giqFilter.industry);
    if (giqFilter.minScore) items = items.filter((g) => (g.report?.overall_score || 0) >= Number(giqFilter.minScore));
    if (giqFilter.crmStatus) items = items.filter((g) => g.crm_status === giqFilter.crmStatus);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      items = items.filter((g) =>
        [g.full_name, g.business_email, g.business_name, g.industry, g.report_id]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q))
      );
    }
    return items;
  }, [dashboardData, giqFilter, searchQuery]);

  const stats = dashboardData?.stats;
  const totalLeads = (stats?.total_audit_leads || 0) + (stats?.total_guide_leads || 0) + (stats?.total_growth_assessments || 0);
  const overallConv = (
    (totalLeads / Math.max(stats?.total_unique_visitors || 1, 1)) * 100
  ).toFixed(1);

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <Logo size="sm" wordmark={true} />
              <Lock size={32} className="lock-icon" style={{ marginTop: 20 }} />
              <h1>Admin Dashboard</h1>
              <p>Sign in to view leads, analytics, and traffic sources</p>
            </div>
            <form onSubmit={handleLogin} className="admin-login-form">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                className="admin-input"
                autoFocus
                autoComplete="current-password"
              />
              {error && <span className="admin-error">{error}</span>}
              {!API_URL && (
                <p className="admin-api-hint">
                  <WifiOff size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  REACT_APP_BACKEND_URL is missing — set it in .env (local) or Vercel (production).
                </p>
              )}
              <button type="submit" className="admin-submit-btn" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {giqViewTarget && (
        <div className="delete-modal-overlay" onClick={() => setGiqViewTarget(null)}>
          <div className="edit-modal giq-view-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640, maxHeight: '85vh', overflow: 'auto' }}>
            <button type="button" className="modal-close" onClick={() => setGiqViewTarget(null)}>
              <X size={20} />
            </button>
            <h3>GrowthIQ™ Report — {giqViewTarget.business_name}</h3>
            <p className="giq-modal-meta">
              {giqViewTarget.full_name} · {giqViewTarget.business_email} · {giqViewTarget.phone || 'No phone'}
            </p>
            <p className="giq-modal-meta">
              {giqViewTarget.industry || '—'} · {giqViewTarget.business_size || '—'} · Goal: {giqViewTarget.primary_goal || '—'}
            </p>
            <p className="giq-modal-meta">
              Score: {giqViewTarget.report?.overall_score ?? '—'} · Grade: {giqViewTarget.report?.letter_grade ?? '—'} · {giqViewTarget.report?.growth_level ?? ''}
              {giqViewTarget.report?.confidence_score != null ? ` · Confidence: ${giqViewTarget.report.confidence_score}%` : ''}
            </p>
            <p className="giq-modal-meta">Report ID: {giqViewTarget.report_id}</p>
            {giqViewTarget.website && <p className="giq-modal-meta">Website: {giqViewTarget.website}</p>}
            <div className="giq-modal-summary">
              <strong>Executive Summary</strong>
              <p>{giqViewTarget.report?.executive_summary || '—'}</p>
            </div>
            {giqViewTarget.report?.business_summary && (
              <div className="giq-modal-summary">
                <strong>Business Summary</strong>
                <p>{giqViewTarget.report.business_summary}</p>
              </div>
            )}
            {(giqViewTarget.report?.top_opportunities || []).length > 0 && (
              <div className="giq-modal-summary">
                <strong>Top Opportunities</strong>
                <ul>{giqViewTarget.report.top_opportunities.map((o) => <li key={o}>{o}</li>)}</ul>
              </div>
            )}
            {(giqViewTarget.report?.quick_wins || []).length > 0 && (
              <div className="giq-modal-summary">
                <strong>Quick Wins</strong>
                <ul>{giqViewTarget.report.quick_wins.map((w) => <li key={w}>{w}</li>)}</ul>
              </div>
            )}
            <div className="giq-modal-summary">
              <strong>Business Goals (submitted)</strong>
              <p style={{ whiteSpace: 'pre-wrap' }}>{giqViewTarget.business_goals || '—'}</p>
            </div>
            <div className="edit-field">
              <label htmlFor="giq-status">CRM Status</label>
              <select id="giq-status" value={giqStatus} onChange={(e) => setGiqStatus(e.target.value)}>
                <option value="analytics_only">Analytics Only</option>
                <option value="expert_review_requested">Expert Review Requested</option>
                <option value="contacted">Contacted</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="edit-field">
              <label htmlFor="giq-notes">Internal Notes</label>
              <textarea id="giq-notes" rows={4} value={giqNotes} onChange={(e) => setGiqNotes(e.target.value)} />
            </div>
            {giqViewTarget.expert_review_requested && (
              <div className="giq-meeting-action">
                <button
                  type="button"
                  className="admin-submit-btn giq-send-meeting-btn"
                  disabled={meetingLinkSending === giqViewTarget.report_id}
                  onClick={() => openMeetingCompose(giqViewTarget)}
                >
                  {meetingLinkSending === giqViewTarget.report_id ? (
                    <><Loader2 size={16} className="spin" /> Sending…</>
                  ) : (
                    <><Calendar size={16} /> Send Meeting Link</>
                  )}
                </button>
                {giqViewTarget.meeting_link_sent_at && (
                  <p className="giq-meeting-sent-note">
                    Last sent: {formatDate(giqViewTarget.meeting_link_sent_at)}
                  </p>
                )}
                {meetingLinkFeedback && (
                  <p className={`giq-meeting-feedback${meetingLinkFeedback.includes('success') ? ' is-success' : ' is-error'}`} role="status">
                    {meetingLinkFeedback}
                  </p>
                )}
              </div>
            )}
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setGiqViewTarget(null)}>Close</button>
              <button type="button" className="admin-submit-btn" onClick={() => handleGiqUpdate(giqViewTarget.report_id)}>Save</button>
            </div>
          </div>
        </div>
      )}

      {meetingComposeTarget && (
        <div className="delete-modal-overlay" onClick={() => setMeetingComposeTarget(null)}>
          <div className="edit-modal meeting-compose-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setMeetingComposeTarget(null)}>
              <X size={20} />
            </button>
            <Calendar size={32} className="modal-edit-icon" />
            <h3>Send Meeting Link</h3>
            <p className="meeting-compose-recipient">
              To <strong>{meetingComposeTarget.full_name || 'Contact'}</strong> at{' '}
              <strong>{meetingComposeTarget.business_email}</strong>
              {meetingComposeTarget.business_name ? ` · ${meetingComposeTarget.business_name}` : ''}
            </p>

            <form className="edit-form meeting-compose-form" onSubmit={submitMeetingCompose}>
              <div className="edit-field">
                <label htmlFor="meeting-calendly-url">Calendly link</label>
                <input
                  id="meeting-calendly-url"
                  type="url"
                  value={meetingCalendlyUrl}
                  onChange={(e) => setMeetingCalendlyUrl(e.target.value)}
                  placeholder="https://calendly.com/contact-weroi/30min"
                  required
                />
              </div>
              <div className="edit-field">
                <label htmlFor="meeting-proposed-times">Suggested times (optional)</label>
                <textarea
                  id="meeting-proposed-times"
                  rows={3}
                  value={meetingProposedTimes}
                  onChange={(e) => setMeetingProposedTimes(e.target.value)}
                  placeholder="e.g. Tuesday 2:00 PM EST or Wednesday 10:30 AM EST"
                />
              </div>
              <div className="edit-field">
                <label htmlFor="meeting-personal-note">Personal message</label>
                <textarea
                  id="meeting-personal-note"
                  rows={4}
                  value={meetingPersonalNote}
                  onChange={(e) => setMeetingPersonalNote(e.target.value)}
                  placeholder="Short note that appears in the branded email..."
                  required
                />
              </div>
              <p className="meeting-compose-hint">
                They will receive a branded weROI email with your message, suggested times, and a Book Your Call button.
              </p>
              {meetingLinkFeedback && !meetingLinkFeedback.includes('success') && (
                <p className="giq-meeting-feedback is-error" role="alert">{meetingLinkFeedback}</p>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setMeetingComposeTarget(null)}>Cancel</button>
                <button
                  type="submit"
                  className="admin-submit-btn"
                  disabled={meetingLinkSending === meetingComposeTarget.report_id}
                >
                  {meetingLinkSending === meetingComposeTarget.report_id ? (
                    <><Loader2 size={16} className="spin" /> Sending…</>
                  ) : (
                    <><Calendar size={16} /> Send branded email</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editTarget && (
        <div className="delete-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowEditModal(false)}>
              <X size={20} />
            </button>
            <Pencil size={32} className="modal-edit-icon" />
            <h3>Edit {editTarget.leadType === 'audit' ? 'Audit' : 'Guide'} Lead</h3>

            <div className="edit-form">
              <div className="edit-field">
                <label htmlFor="edit-name">Name</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div className="edit-field">
                <label htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>
              {editTarget.leadType === 'audit' && (
                <>
                  <div className="edit-field">
                    <label htmlFor="edit-phone">Phone</label>
                    <input
                      id="edit-phone"
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    />
                  </div>
                  <div className="edit-field">
                    <label htmlFor="edit-company">Company</label>
                    <input
                      id="edit-company"
                      type="text"
                      value={editFormData.company_name}
                      onChange={(e) => setEditFormData({ ...editFormData, company_name: e.target.value })}
                    />
                  </div>
                  <div className="edit-field">
                    <label htmlFor="edit-website">Website / Business Page</label>
                    <input
                      id="edit-website"
                      type="url"
                      value={editFormData.website}
                      onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="edit-field">
                    <label htmlFor="edit-status">Status</label>
                    <select
                      id="edit-status"
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="button" className="btn-save" onClick={handleEditSave} disabled={editSaving}>
                {editSaving ? 'Saving…' : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowDeleteModal(false)}>
              <X size={20} />
            </button>
            <AlertTriangle size={48} className="modal-warning-icon" />
            <h3>Confirm Delete</h3>
            {deleteTarget?.type === 'single' ? (
              <>
                <p>Are you sure you want to delete this lead?</p>
                <p className="modal-lead-info">{deleteTarget.name} ({deleteTarget.email})</p>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleDeleteLead(deleteTarget.id, deleteTarget.leadType)}
                  >
                    Delete Lead
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>Are you sure you want to clear all {deleteTarget?.clearType} leads?</p>
                <p className="modal-warning">This action cannot be undone!</p>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleClearAll(deleteTarget?.clearType)}
                  >
                    Clear All
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <Logo size="sm" wordmark={true} />
            <span className="admin-badge">Admin</span>
          </div>
          <div className="admin-header-actions">
            <button type="button" className="admin-refresh" onClick={() => fetchDashboardData()} disabled={refreshing || initialLoad} aria-label="Refresh">
              <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
            </button>
            <button type="button" className="admin-logout" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {initialLoad && (
        <div className="admin-banner loading" style={{ maxWidth: 'var(--maxw)', margin: '24px auto 0', paddingLeft: 24, paddingRight: 24 }}>
          <Loader2 size={18} className="spinning" />
          Loading dashboard data…
        </div>
      )}

      {dataError && (
        <div className="admin-banner error" style={{ maxWidth: 'var(--maxw)', margin: '24px auto 0', paddingLeft: 24, paddingRight: 24 }}>
          <WifiOff size={18} />
          {dataError}
        </div>
      )}

      <section className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon visitors">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.total_unique_visitors ?? '—'}</span>
            <span className="stat-label">Unique Visitors</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon audit">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.total_audit_leads ?? '—'}</span>
            <span className="stat-label">Audit Leads</span>
            {stats && (
              <span className="stat-rate">{stats.audit_conversion_rate || 0}% conv.</span>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon guide">
            <Download size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.total_guide_leads ?? '—'}</span>
            <span className="stat-label">Guide Downloads</span>
            {stats && (
              <span className="stat-rate">{stats.popup_capture_rate || 0}% capture</span>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.total_growth_assessments ?? '—'}</span>
            <span className="stat-label">GrowthIQ™ Reports</span>
            {stats && (
              <span className="stat-rate">{stats.growth_expert_reviews || 0} expert reviews</span>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">
            <UserPlus size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{dashboardData ? totalLeads : '—'}</span>
            <span className="stat-label">Total Leads</span>
          </div>
        </div>
      </section>

      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          <Users size={18} />
          <span>Leads</span>
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'growthiq' ? 'active' : ''}`}
          onClick={() => setActiveTab('growthiq')}
        >
          <BarChart3 size={18} />
          <span>GrowthIQ™</span>
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
        >
          <Globe size={18} />
          <span>Sources</span>
        </button>
        <div className="admin-tab-actions">
          <button type="button" className="admin-export-btn" onClick={handleExportCSV}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'leads' && (
          <div className="leads-section">
            <div className="leads-header">
              <h2>Lead Log ({filteredLeads.length})</h2>
              <div className="leads-actions">
                <button type="button" className="btn-clear-audit" onClick={() => openDeleteModal({ type: 'clear', clearType: 'audit' })}>
                  Clear Audit
                </button>
                <button type="button" className="btn-clear-guide" onClick={() => openDeleteModal({ type: 'clear', clearType: 'guide' })}>
                  Clear Guide
                </button>
                <button type="button" className="btn-clear-all" onClick={() => openDeleteModal({ type: 'clear', clearType: 'all' })}>
                  Clear All
                </button>
              </div>
            </div>

            <div className="leads-toolbar">
              <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="search"
                  className="leads-search"
                  style={{ paddingLeft: 36, width: '100%' }}
                  placeholder="Search name, email, company…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="leads-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter by lead type"
              >
                <option value="all">All types</option>
                <option value="audit">Audit only</option>
                <option value="guide">Guide only</option>
              </select>
            </div>

            <div className="leads-table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th className="hide-mobile">Company</th>
                    <th className="hide-mobile">Website</th>
                    <th className="hide-mobile">Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={`${lead.leadType}-${lead.id}`}>
                      <td className="date-cell">{formatDate(lead.created_at)}</td>
                      <td>
                        <span className={`lead-type ${lead.leadType}`}>
                          {lead.leadType === 'audit' ? 'Audit' : 'Guide'}
                        </span>
                      </td>
                      <td className="name-cell">{lead.name}</td>
                      <td className="email-cell">{lead.email}</td>
                      <td className="hide-mobile">{lead.company_name || '—'}</td>
                      <td className="hide-mobile">
                        {lead.website ? (
                          <a
                            href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="website-link"
                          >
                            {formatSource(lead.website)}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="hide-mobile">
                        {formatSource(lead.referrer) || lead.how_found_us || (lead.leadType === 'guide' ? 'Popup' : '—')}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-edit-row"
                            onClick={() => openEditModal(lead, lead.leadType)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-delete-row"
                            onClick={() => openDeleteModal({
                              type: 'single',
                              id: lead.id,
                              leadType: lead.leadType,
                              name: lead.name,
                              email: lead.email
                            })}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!initialLoad && filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan="8" className="no-data">
                        {searchQuery || typeFilter !== 'all'
                          ? 'No leads match your filters.'
                          : 'No leads yet — submissions from /growth-preview and the guide popup will appear here.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'growthiq' && (
          <div className="leads-section">
            <div className="leads-header">
              <h2>GrowthIQ™ Assessments ({filteredGrowthIQ.length})</h2>
            </div>
            <div className="leads-toolbar">
              <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input
                  type="search"
                  className="leads-search"
                  style={{ paddingLeft: 36, width: '100%' }}
                  placeholder="Search name, email, business…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="leads-filter" value={giqFilter.industry} onChange={(e) => setGiqFilter({ ...giqFilter, industry: e.target.value })} aria-label="Filter by industry">
                <option value="">All industries</option>
                {[...new Set((dashboardData?.growth_assessments || []).map((g) => g.industry).filter(Boolean))].sort().map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <select className="leads-filter" value={giqFilter.crmStatus} onChange={(e) => setGiqFilter({ ...giqFilter, crmStatus: e.target.value })} aria-label="Filter by CRM status">
                <option value="">All CRM statuses</option>
                <option value="analytics_only">Analytics Only</option>
                <option value="expert_review_requested">Expert Review Requested</option>
                <option value="contacted">Contacted</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <input
                type="number"
                className="leads-filter"
                placeholder="Min score"
                value={giqFilter.minScore}
                onChange={(e) => setGiqFilter({ ...giqFilter, minScore: e.target.value })}
                style={{ width: 100 }}
              />
            </div>
            <div className="leads-table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Business</th>
                    <th>Contact</th>
                    <th className="hide-mobile">Industry</th>
                    <th>Score</th>
                    <th className="hide-mobile">CRM Status</th>
                    <th>Expert Review</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrowthIQ.map((g) => (
                    <tr key={g.report_id}>
                      <td className="date-cell">{formatDate(g.created_at)}</td>
                      <td className="name-cell">{g.business_name}</td>
                      <td className="email-cell">{g.business_email}</td>
                      <td className="hide-mobile">{g.industry || '—'}</td>
                      <td><strong>{g.report?.overall_score ?? '—'}</strong> {g.report?.letter_grade ? `(${g.report.letter_grade})` : ''}</td>
                      <td className="hide-mobile"><span className={`lead-type ${g.crm_status}`}>{g.crm_status?.replace(/_/g, ' ')}</span></td>
                      <td>{g.expert_review_requested ? 'Yes' : 'No'}</td>
                      <td>
                        <button type="button" className="btn-edit-row" onClick={() => openGiqView(g)} title="View report">
                          <Eye size={16} />
                        </button>
                        {g.expert_review_requested && (
                          <button
                            type="button"
                            className="btn-edit-row"
                            onClick={() => openMeetingCompose(g)}
                            title="Send meeting link"
                            disabled={meetingLinkSending === g.report_id}
                          >
                            {meetingLinkSending === g.report_id ? (
                              <Loader2 size={16} className="spin" />
                            ) : (
                              <Calendar size={16} />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!initialLoad && filteredGrowthIQ.length === 0 && (
                    <tr><td colSpan="8" className="no-data">No GrowthIQ™ assessments yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Conversion Funnels</h2>

            {!stats && !initialLoad ? (
              <div className="admin-banner empty">No analytics data available yet.</div>
            ) : (
              <>
                <div className="funnels-grid">
                  <div className="funnel-card">
                    <h3><FileText size={20} /> Audit Form Funnel</h3>
                    <div className="funnel-metrics">
                      <div className="funnel-metric">
                        <span className="metric-label">Form Views</span>
                        <span className="metric-value">{stats?.audit_form_starts || 0}</span>
                      </div>
                      <div className="funnel-arrow">→</div>
                      <div className="funnel-metric">
                        <span className="metric-label">Submissions</span>
                        <span className="metric-value">{stats?.total_audit_leads || 0}</span>
                      </div>
                      <div className="funnel-arrow">→</div>
                      <div className="funnel-metric highlight">
                        <span className="metric-label">Conversion</span>
                        <span className="metric-value">{stats?.audit_conversion_rate || 0}%</span>
                      </div>
                    </div>
                    <div className="funnel-bar-container">
                      <div className="funnel-bar-bg">
                        <div
                          className="funnel-bar-fill audit"
                          style={{ width: `${Math.min(stats?.audit_conversion_rate || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="funnel-card">
                    <h3><MousePointer size={20} /> Popup Capture Funnel</h3>
                    <div className="funnel-metrics">
                      <div className="funnel-metric">
                        <span className="metric-label">Popup Shown</span>
                        <span className="metric-value">{stats?.popup_shown || 0}</span>
                      </div>
                      <div className="funnel-arrow">→</div>
                      <div className="funnel-metric">
                        <span className="metric-label">Downloads</span>
                        <span className="metric-value">{stats?.total_guide_leads || 0}</span>
                      </div>
                      <div className="funnel-arrow">→</div>
                      <div className="funnel-metric highlight">
                        <span className="metric-label">Capture Rate</span>
                        <span className="metric-value">{stats?.popup_capture_rate || 0}%</span>
                      </div>
                    </div>
                    <div className="funnel-bar-container">
                      <div className="funnel-bar-bg">
                        <div
                          className="funnel-bar-fill guide"
                          style={{ width: `${Math.min(stats?.popup_capture_rate || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overall-stats">
                  <h3>Overall Performance</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <Eye size={20} />
                      <div>
                        <span className="stat-item-value">{stats?.total_unique_visitors || 0}</span>
                        <span className="stat-item-label">Unique Visitors</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <BarChart3 size={20} />
                      <div>
                        <span className="stat-item-value">{stats?.total_page_views || 0}</span>
                        <span className="stat-item-label">Page Views</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <ArrowUpRight size={20} />
                      <div>
                        <span className="stat-item-value">{overallConv}%</span>
                        <span className="stat-item-label">Overall Conv. Rate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="sources-section">
            <h2>Traffic Sources</h2>
            <div className="sources-grid">
              <div className="sources-card">
                <h3>Top Referrers</h3>
                {stats?.top_sources?.length > 0 ? (
                  <ul className="sources-list">
                    {stats.top_sources.map((source, index) => (
                      <li key={source._id || index}>
                        <span className="source-name">{formatSource(source._id)}</span>
                        <span className="source-count">{source.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-sources">No source data yet. Tracking begins when visitors arrive.</p>
                )}
              </div>
              <div className="sources-info">
                <h3>How Source Tracking Works</h3>
                <p>We capture the referring URL when visitors:</p>
                <ul>
                  <li>View any page on your site</li>
                  <li>Submit the audit form</li>
                  <li>Download the growth guide</li>
                </ul>
                <p>This helps you see which channels drive the most leads.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
