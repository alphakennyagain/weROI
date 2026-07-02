import React, { useState, useEffect, useCallback } from 'react';
import { FileText, ChevronRight, Search, Loader2, UserCheck } from 'lucide-react';
import { getBackendUrl } from '../../lib/apiConfig';
import { getSavedReports, getSavedReportEmail, saveReportToLibrary } from '../../data/growthiqConstants';

const API_URL = getBackendUrl();

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

function mergeReports(local, remote) {
  const map = new Map();
  [...local, ...remote].forEach((r) => {
    if (r?.report_id) map.set(r.report_id, { ...map.get(r.report_id), ...r });
  });
  return [...map.values()].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

function toLibraryEntry(r, fallbackEmail) {
  return {
    report_id: r.report_id,
    business_email: r.business_email || fallbackEmail,
    business_name: r.business_name,
    report: {
      overall_score: r.overall_score,
      letter_grade: r.letter_grade,
      growth_level: r.growth_level,
    },
    expert_review_requested: r.expert_review_requested,
    created_at: r.created_at,
  };
}

export default function MyReports({ onViewReport }) {
  const [email, setEmail] = useState(() => getSavedReportEmail());
  const [reports, setReports] = useState(() => getSavedReports());
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [lookupAttempted, setLookupAttempted] = useState(false);

  const refreshLocal = useCallback(() => {
    setReports(getSavedReports());
    const savedEmail = getSavedReportEmail();
    if (savedEmail) setEmail((prev) => prev || savedEmail);
  }, []);

  useEffect(() => {
    refreshLocal();
    window.addEventListener('storage', refreshLocal);
    return () => window.removeEventListener('storage', refreshLocal);
  }, [refreshLocal]);

  const handleLookup = async (e) => {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setLookupError('Enter the email you used for your assessment.');
      return;
    }
    if (!API_URL) {
      setLookupError('Service unavailable. Try again shortly.');
      return;
    }
    setLoading(true);
    setLookupError('');
    setLookupAttempted(true);
    localStorage.setItem('weroi_growthiq_email', trimmed);

    try {
      const res = await fetch(`${API_URL}/api/growthiq/reports/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 404 && (data.detail === 'Not Found' || !data.detail)) {
          setLookupError(
            'Report lookup is still updating on our server. Try again in a few minutes, or use the report link from your email.'
          );
        } else {
          setLookupError(
            typeof data.detail === 'string'
              ? data.detail
              : 'Could not find reports. Check your email and try again.'
          );
        }
        return;
      }

      const remote = data.reports || [];
      remote.forEach((r) => saveReportToLibrary(toLibraryEntry(r, trimmed)));
      const merged = mergeReports(getSavedReports(), remote);
      setReports(merged);

      if (remote.length === 0) {
        setLookupError(
          merged.length > 0
            ? 'No new reports on the server for that email. Showing reports saved in this browser.'
            : 'No reports found for that email. Double-check the spelling or complete a new assessment.'
        );
      }
    } catch {
      setLookupError('Could not reach the report service. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasReports = reports.length > 0;

  return (
    <section className="giq-section giq-my-reports" id="my-reports">
      <div className="container giq-my-reports-inner">
        <div className="giq-my-reports-header">
          <FileText size={20} />
          <div>
            <h2 className="giq-section-title giq-my-reports-title">My Past Reports</h2>
            <p className="giq-my-reports-sub">
              {hasReports
                ? 'Your saved GrowthIQ reports. Tap any report to open it again.'
                : 'Already completed a GrowthIQ assessment? Enter your email to view past reports anytime.'}
            </p>
          </div>
        </div>

        <form className="giq-my-reports-lookup" onSubmit={handleLookup}>
          <input
            type="email"
            placeholder="you@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="giq-my-reports-input"
            autoComplete="email"
          />
          <button type="submit" className="giq-my-reports-btn" disabled={loading}>
            {loading ? <Loader2 size={16} className="giq-spin" /> : <Search size={16} />}
            {hasReports ? 'Refresh' : 'Find reports'}
          </button>
        </form>
        {lookupError && <p className="giq-my-reports-error" role="alert">{lookupError}</p>}

        {hasReports && (
          <ul className="giq-my-reports-list">
            {reports.map((r) => (
              <li key={r.report_id} className="giq-my-reports-item">
                <div className="giq-my-reports-score" data-grade={r.letter_grade || ''}>
                  <span className="giq-my-reports-grade">{r.letter_grade || '—'}</span>
                  <span className="giq-my-reports-num">{r.overall_score ?? r.report?.overall_score ?? '—'}</span>
                </div>
                <div className="giq-my-reports-meta">
                  <span className="giq-my-reports-name">{r.business_name || 'GrowthIQ Report'}</span>
                  <span className="giq-my-reports-date">
                    {formatDate(r.created_at)}
                    {(r.growth_level || r.report?.growth_level) ? ` · ${r.growth_level || r.report?.growth_level}` : ''}
                  </span>
                  {r.expert_review_requested && (
                    <span className="giq-my-reports-badge">
                      <UserCheck size={12} /> Expert review
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="giq-my-reports-view"
                  onClick={() => onViewReport(r.report_id, r.business_email || email)}
                >
                  View <ChevronRight size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {lookupAttempted && !hasReports && !loading && !lookupError && (
          <p className="giq-my-reports-error" role="status">No reports found for that email.</p>
        )}
      </div>
    </section>
  );
}
