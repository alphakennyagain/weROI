import React, { useState, useEffect, useCallback } from 'react';
import { FileText, ChevronRight, Search, Loader2, UserCheck, Bookmark } from 'lucide-react';
import { getBackendUrl } from '../../lib/apiConfig';
import { getSavedReports } from '../../data/growthiqConstants';

const API_URL = getBackendUrl();

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

function ReportRow({ report, email, onViewReport }) {
  return (
    <li className="giq-my-reports-item">
      <div className="giq-my-reports-score" data-grade={report.letter_grade || ''}>
        <span className="giq-my-reports-grade">{report.letter_grade || '—'}</span>
        <span className="giq-my-reports-num">{report.overall_score ?? report.report?.overall_score ?? '—'}</span>
      </div>
      <div className="giq-my-reports-meta">
        <span className="giq-my-reports-name">{report.business_name || 'GrowthIQ Report'}</span>
        <span className="giq-my-reports-date">
          {formatDate(report.created_at)}
          {(report.growth_level || report.report?.growth_level) ? ` · ${report.growth_level || report.report?.growth_level}` : ''}
        </span>
        {report.expert_review_requested && (
          <span className="giq-my-reports-badge">
            <UserCheck size={12} /> Expert review
          </span>
        )}
      </div>
      <button
        type="button"
        className="giq-my-reports-view"
        onClick={() => onViewReport(report.report_id, report.business_email || email)}
      >
        View <ChevronRight size={16} />
      </button>
    </li>
  );
}

export default function MyReports({ onViewReport }) {
  const [deviceReports, setDeviceReports] = useState(() => getSavedReports());
  const [reportId, setReportId] = useState('');
  const [email, setEmail] = useState('');
  const [sessionReport, setSessionReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const refreshDevice = useCallback(() => {
    setDeviceReports(getSavedReports());
  }, []);

  useEffect(() => {
    refreshDevice();
    window.addEventListener('storage', refreshDevice);
    return () => window.removeEventListener('storage', refreshDevice);
  }, [refreshDevice]);

  const handleLookup = async (e) => {
    e?.preventDefault();
    const id = reportId.trim();
    const trimmedEmail = email.trim();
    if (!id) {
      setLookupError('Enter your Report ID from your confirmation email.');
      return;
    }
    if (!trimmedEmail) {
      setLookupError('Enter the email you used for your assessment.');
      return;
    }
    if (!API_URL) {
      setLookupError('Service unavailable. Try again shortly.');
      return;
    }
    setLoading(true);
    setLookupError('');
    setSessionReport(null);

    try {
      const res = await fetch(`${API_URL}/api/growthiq/reports/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_id: id, email: trimmedEmail }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 404 && (data.detail === 'Not Found' || !data.detail)) {
          setLookupError('Report lookup is still updating on our server. Use the link in your email or try again shortly.');
        } else if (res.status === 403) {
          setLookupError('That email does not match this Report ID. Use the same email from your assessment.');
        } else if (res.status === 404) {
          setLookupError('Report not found. Check your Report ID from your confirmation email.');
        } else {
          setLookupError(typeof data.detail === 'string' ? data.detail : 'Could not open that report. Check your Report ID and email.');
        }
        return;
      }

      if (data.report) {
        setSessionReport(data.report);
      } else {
        setLookupError('Report not found. Check your Report ID and email.');
      }
    } catch {
      setLookupError('Could not reach the report service. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="giq-section giq-my-reports" id="my-reports">
      <div className="container giq-my-reports-inner">
        <div className="giq-my-reports-header">
          <FileText size={20} />
          <div>
            <h2 className="giq-section-title giq-my-reports-title">Open a Past Report</h2>
            <p className="giq-my-reports-sub">
              Use the <strong>Report ID</strong> from your confirmation email plus the email you submitted.
              For your privacy, looked-up reports are not saved on this page after you reload.
            </p>
          </div>
        </div>

        <form className="giq-my-reports-lookup giq-my-reports-lookup--stacked" onSubmit={handleLookup}>
          <input
            type="text"
            placeholder="Report ID (from your email)"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            className="giq-my-reports-input"
            autoComplete="off"
            spellCheck={false}
          />
          <input
            type="email"
            placeholder="Email used for assessment"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="giq-my-reports-input"
            autoComplete="email"
          />
          <button type="submit" className="giq-my-reports-btn" disabled={loading}>
            {loading ? <Loader2 size={16} className="giq-spin" /> : <Search size={16} />}
            Open report
          </button>
        </form>
        {lookupError && <p className="giq-my-reports-error" role="alert">{lookupError}</p>}

        {sessionReport && (
          <div className="giq-my-reports-session">
            <p className="giq-my-reports-session-note">Found for this visit only. Reloading clears this.</p>
            <ul className="giq-my-reports-list">
              <ReportRow report={sessionReport} email={email} onViewReport={onViewReport} />
            </ul>
          </div>
        )}

        {deviceReports.length > 0 && (
          <div className="giq-my-reports-device">
            <div className="giq-my-reports-device-head">
              <Bookmark size={16} />
              <h3>Saved on this device</h3>
            </div>
            <p className="giq-my-reports-device-sub">
              Reports you completed here stay available until you clear browser data.
            </p>
            <ul className="giq-my-reports-list">
              {deviceReports.map((r) => (
                <ReportRow key={r.report_id} report={r} email={r.business_email} onViewReport={onViewReport} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
