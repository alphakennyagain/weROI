import React, { useState, useEffect } from 'react';
import { TrendingUp, Lock, Users, FileText, Download, BarChart3, Eye, ArrowUpRight, LogOut, Trash2, AlertTriangle, X, RefreshCw, Globe, MousePointer, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('leads');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = process.env.REACT_APP_BACKEND_URL || '';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminAuth', password);
        fetchDashboardData();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    if (!storedPassword) return;

    setRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard-data?password=${encodeURIComponent(storedPassword)}`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportCSV = () => {
    window.open(`${API_URL}/api/leads/export/csv`, '_blank');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setDashboardData(null);
    setPassword('');
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

  useEffect(() => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    if (storedPassword) {
      setPassword(storedPassword);
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

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

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <Lock size={48} className="lock-icon" />
              <h1>Admin Access</h1>
              <p>Enter your password to access the dashboard</p>
            </div>
            <form onSubmit={handleLogin} className="admin-login-form">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="admin-input"
                autoFocus
              />
              {error && <span className="admin-error">{error}</span>}
              <button type="submit" className="admin-submit-btn" disabled={loading}>
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="admin-dashboard">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
              <X size={20} />
            </button>
            <AlertTriangle size={48} className="modal-warning-icon" />
            <h3>Confirm Delete</h3>
            {deleteTarget?.type === 'single' ? (
              <>
                <p>Are you sure you want to delete this lead?</p>
                <p className="modal-lead-info">{deleteTarget.name} ({deleteTarget.email})</p>
                <div className="modal-actions">
                  <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button className="btn-delete" onClick={() => handleDeleteLead(deleteTarget.id, deleteTarget.leadType)}>
                    Delete Lead
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>Are you sure you want to clear all {deleteTarget?.clearType} leads?</p>
                <p className="modal-warning">This action cannot be undone!</p>
                <div className="modal-actions">
                  <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button className="btn-delete" onClick={() => handleClearAll(deleteTarget?.clearType)}>
                    Clear All
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <TrendingUp size={24} className="brand-icon" />
            <span className="brand-text"><span className="we">we</span><span className="roi">ROI</span></span>
            <span className="admin-badge">Admin</span>
          </div>
          <div className="admin-header-actions">
            <button className="admin-refresh" onClick={fetchDashboardData} disabled={refreshing}>
              <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
            </button>
            <button className="admin-logout" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon visitors">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{dashboardData?.stats?.total_unique_visitors || 0}</span>
            <span className="stat-label">Unique Visitors</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon audit">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{dashboardData?.stats?.total_audit_leads || 0}</span>
            <span className="stat-label">Audit Leads</span>
            <span className="stat-rate">{dashboardData?.stats?.audit_conversion_rate || 0}% conv.</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon guide">
            <Download size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{dashboardData?.stats?.total_guide_leads || 0}</span>
            <span className="stat-label">Guide Downloads</span>
            <span className="stat-rate">{dashboardData?.stats?.popup_capture_rate || 0}% capture</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">
            <UserPlus size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{(dashboardData?.stats?.total_audit_leads || 0) + (dashboardData?.stats?.total_guide_leads || 0)}</span>
            <span className="stat-label">Total Leads</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          <Users size={18} />
          <span>Leads</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </button>
        <button 
          className={`admin-tab ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => setActiveTab('sources')}
        >
          <Globe size={18} />
          <span>Sources</span>
        </button>
        <div className="admin-tab-actions">
          <button className="admin-export-btn" onClick={handleExportCSV}>
            <Download size={18} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'leads' && (
          <div className="leads-section">
            <div className="leads-header">
              <h2>Lead Log</h2>
              <div className="leads-actions">
                <button 
                  className="btn-clear-audit"
                  onClick={() => openDeleteModal({ type: 'clear', clearType: 'audit' })}
                >
                  Clear Audit
                </button>
                <button 
                  className="btn-clear-guide"
                  onClick={() => openDeleteModal({ type: 'clear', clearType: 'guide' })}
                >
                  Clear Guide
                </button>
                <button 
                  className="btn-clear-all"
                  onClick={() => openDeleteModal({ type: 'clear', clearType: 'all' })}
                >
                  Clear All
                </button>
              </div>
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
                    <th className="hide-mobile">Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.audit_leads?.map((lead, index) => (
                    <tr key={`audit-${index}`}>
                      <td className="date-cell">{formatDate(lead.created_at)}</td>
                      <td><span className="lead-type audit">Audit</span></td>
                      <td className="name-cell">{lead.name}</td>
                      <td className="email-cell">{lead.email}</td>
                      <td className="hide-mobile">{lead.company_name || '-'}</td>
                      <td className="hide-mobile">{formatSource(lead.referrer) || lead.how_found_us || '-'}</td>
                      <td>
                        <button 
                          className="btn-delete-row"
                          onClick={() => openDeleteModal({ 
                            type: 'single', 
                            id: lead.id, 
                            leadType: 'audit',
                            name: lead.name,
                            email: lead.email
                          })}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {dashboardData?.guide_leads?.map((lead, index) => (
                    <tr key={`guide-${index}`}>
                      <td className="date-cell">{formatDate(lead.created_at)}</td>
                      <td><span className="lead-type guide">Guide</span></td>
                      <td className="name-cell">{lead.name}</td>
                      <td className="email-cell">{lead.email}</td>
                      <td className="hide-mobile">-</td>
                      <td className="hide-mobile">{formatSource(lead.referrer) || 'Popup'}</td>
                      <td>
                        <button 
                          className="btn-delete-row"
                          onClick={() => openDeleteModal({ 
                            type: 'single', 
                            id: lead.id, 
                            leadType: 'guide',
                            name: lead.name,
                            email: lead.email
                          })}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!dashboardData?.audit_leads?.length && !dashboardData?.guide_leads?.length) && (
                    <tr>
                      <td colSpan="7" className="no-data">No leads yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Conversion Funnels</h2>
            
            <div className="funnels-grid">
              {/* Audit Funnel */}
              <div className="funnel-card">
                <h3><FileText size={20} /> Audit Form Funnel</h3>
                <div className="funnel-metrics">
                  <div className="funnel-metric">
                    <span className="metric-label">Form Views</span>
                    <span className="metric-value">{dashboardData?.stats?.audit_form_starts || 0}</span>
                  </div>
                  <div className="funnel-arrow">→</div>
                  <div className="funnel-metric">
                    <span className="metric-label">Submissions</span>
                    <span className="metric-value">{dashboardData?.stats?.total_audit_leads || 0}</span>
                  </div>
                  <div className="funnel-arrow">→</div>
                  <div className="funnel-metric highlight">
                    <span className="metric-label">Conversion</span>
                    <span className="metric-value">{dashboardData?.stats?.audit_conversion_rate || 0}%</span>
                  </div>
                </div>
                <div className="funnel-bar-container">
                  <div className="funnel-bar-bg">
                    <div 
                      className="funnel-bar-fill audit" 
                      style={{ width: `${Math.min(dashboardData?.stats?.audit_conversion_rate || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Popup Funnel */}
              <div className="funnel-card">
                <h3><MousePointer size={20} /> Popup Capture Funnel</h3>
                <div className="funnel-metrics">
                  <div className="funnel-metric">
                    <span className="metric-label">Popup Shown</span>
                    <span className="metric-value">{dashboardData?.stats?.popup_shown || 0}</span>
                  </div>
                  <div className="funnel-arrow">→</div>
                  <div className="funnel-metric">
                    <span className="metric-label">Downloads</span>
                    <span className="metric-value">{dashboardData?.stats?.total_guide_leads || 0}</span>
                  </div>
                  <div className="funnel-arrow">→</div>
                  <div className="funnel-metric highlight">
                    <span className="metric-label">Capture Rate</span>
                    <span className="metric-value">{dashboardData?.stats?.popup_capture_rate || 0}%</span>
                  </div>
                </div>
                <div className="funnel-bar-container">
                  <div className="funnel-bar-bg">
                    <div 
                      className="funnel-bar-fill guide" 
                      style={{ width: `${Math.min(dashboardData?.stats?.popup_capture_rate || 0, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="overall-stats">
              <h3>Overall Performance</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <Eye size={20} />
                  <div>
                    <span className="stat-item-value">{dashboardData?.stats?.total_unique_visitors || 0}</span>
                    <span className="stat-item-label">Unique Visitors</span>
                  </div>
                </div>
                <div className="stat-item">
                  <BarChart3 size={20} />
                  <div>
                    <span className="stat-item-value">{dashboardData?.stats?.total_page_views || 0}</span>
                    <span className="stat-item-label">Page Views</span>
                  </div>
                </div>
                <div className="stat-item">
                  <ArrowUpRight size={20} />
                  <div>
                    <span className="stat-item-value">
                      {(((dashboardData?.stats?.total_audit_leads || 0) + (dashboardData?.stats?.total_guide_leads || 0)) / Math.max(dashboardData?.stats?.total_unique_visitors || 1, 1) * 100).toFixed(1)}%
                    </span>
                    <span className="stat-item-label">Overall Conv. Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="sources-section">
            <h2>Traffic Sources</h2>
            <div className="sources-grid">
              <div className="sources-card">
                <h3>Top Referrers</h3>
                {dashboardData?.stats?.top_sources?.length > 0 ? (
                  <ul className="sources-list">
                    {dashboardData.stats.top_sources.map((source, index) => (
                      <li key={index}>
                        <span className="source-name">{formatSource(source._id)}</span>
                        <span className="source-count">{source.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-sources">No source data yet. Tracking will begin when visitors arrive.</p>
                )}
              </div>
              <div className="sources-info">
                <h3>How Source Tracking Works</h3>
                <p>We automatically capture the referring URL when visitors:</p>
                <ul>
                  <li>View any page on your site</li>
                  <li>Submit the audit form</li>
                  <li>Download the growth guide</li>
                </ul>
                <p>This helps you understand which channels drive the most leads.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
