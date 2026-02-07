import React, { useState, useEffect } from 'react';
import { TrendingUp, Lock, Users, FileText, Download, BarChart3, Eye, UserCheck, ArrowUpRight, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('leads');

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

    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard-data?password=${encodeURIComponent(storedPassword)}`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
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

  useEffect(() => {
    const storedPassword = sessionStorage.getItem('adminAuth');
    if (storedPassword) {
      setPassword(storedPassword);
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  // Format date for display
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
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <TrendingUp size={24} className="brand-icon" />
            <span className="brand-text"><span className="we">we</span><span className="roi">ROI</span></span>
            <span className="admin-badge">Admin</span>
          </div>
          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon views">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{dashboardData?.stats?.total_page_views || 0}</span>
            <span className="stat-label">Page Views</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon submissions">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{dashboardData?.stats?.total_audit_leads || 0}</span>
            <span className="stat-label">Audit Leads</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon downloads">
            <Download size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{dashboardData?.stats?.total_guide_leads || 0}</span>
            <span className="stat-label">Guide Downloads</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon conversion">
            <ArrowUpRight size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{dashboardData?.stats?.conversion_rate || 0}%</span>
            <span className="stat-label">Conversion Rate</span>
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
          Lead Log
        </button>
        <button 
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          Analytics
        </button>
        <button className="admin-export-btn" onClick={handleExportCSV}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'leads' && (
          <div className="leads-section">
            <h2>All Leads</h2>
            <div className="leads-table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Source</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.audit_leads?.map((lead, index) => (
                    <tr key={`audit-${index}`}>
                      <td>{formatDate(lead.created_at)}</td>
                      <td><span className="lead-type audit">Audit</span></td>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.company_name}</td>
                      <td>{lead.how_found_us}</td>
                      <td><span className={`lead-status ${lead.status}`}>{lead.status}</span></td>
                    </tr>
                  ))}
                  {dashboardData?.guide_leads?.map((lead, index) => (
                    <tr key={`guide-${index}`}>
                      <td>{formatDate(lead.created_at)}</td>
                      <td><span className="lead-type guide">Guide</span></td>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>-</td>
                      <td>Popup</td>
                      <td>
                        <span className="lead-status downloaded">
                          {lead.email_1_sent ? 'Emailed' : 'Downloaded'}
                        </span>
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
            <h2>Website Conversion Statistics</h2>
            <div className="analytics-chart">
              <div className="chart-placeholder">
                <BarChart3 size={64} />
                <p>Conversion Funnel</p>
                <div className="funnel-stats">
                  <div className="funnel-item">
                    <span className="funnel-label">Page Views</span>
                    <div className="funnel-bar" style={{ width: '100%' }}></div>
                    <span className="funnel-value">{dashboardData?.stats?.total_page_views || 0}</span>
                  </div>
                  <div className="funnel-item">
                    <span className="funnel-label">Audit Forms</span>
                    <div className="funnel-bar audit" style={{ width: `${Math.min((dashboardData?.stats?.total_audit_leads || 0) / Math.max(dashboardData?.stats?.total_page_views || 1, 1) * 100, 100)}%` }}></div>
                    <span className="funnel-value">{dashboardData?.stats?.total_audit_leads || 0}</span>
                  </div>
                  <div className="funnel-item">
                    <span className="funnel-label">Guide Downloads</span>
                    <div className="funnel-bar guide" style={{ width: `${Math.min((dashboardData?.stats?.total_guide_leads || 0) / Math.max(dashboardData?.stats?.total_page_views || 1, 1) * 100, 100)}%` }}></div>
                    <span className="funnel-value">{dashboardData?.stats?.total_guide_leads || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
