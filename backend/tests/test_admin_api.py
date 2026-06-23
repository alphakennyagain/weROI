"""
Backend API Tests for weROI Admin Dashboard
Tests: /api/admin/auth, /api/admin/dashboard-data, /api/leads/export/csv
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PASSWORD = "Zachattack01@"

class TestAdminAuth:
    """Test admin authentication endpoint"""
    
    def test_admin_auth_success(self):
        """Test successful admin authentication"""
        response = requests.post(f"{BASE_URL}/api/admin/auth", json={
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert data["authenticated"] == True
        assert "token" in data
        print(f"✓ Admin auth successful: {data}")
    
    def test_admin_auth_invalid_password(self):
        """Test admin auth with invalid password"""
        response = requests.post(f"{BASE_URL}/api/admin/auth", json={
            "password": "wrong_password"
        })
        assert response.status_code == 401
        print("✓ Invalid password correctly rejected with 401")


class TestAdminDashboard:
    """Test admin dashboard data endpoint"""
    
    def test_get_dashboard_data_success(self):
        """Test getting dashboard data with valid password"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard-data?password={ADMIN_PASSWORD}")
        assert response.status_code == 200
        
        data = response.json()
        # Verify structure
        assert "audit_leads" in data
        assert "guide_leads" in data
        assert "stats" in data
        
        # Verify stats structure
        stats = data["stats"]
        assert "total_page_views" in stats
        assert "total_audit_leads" in stats
        assert "total_guide_leads" in stats
        assert "audit_conversion_rate" in stats
        
        print(f"✓ Dashboard data retrieved: {len(data['audit_leads'])} audit leads, {len(data['guide_leads'])} guide leads")
    
    def test_get_dashboard_data_invalid_password(self):
        """Test getting dashboard data with invalid password"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard-data?password=wrong")
        assert response.status_code == 401
        print("✓ Invalid password correctly rejected with 401")


class TestCSVExport:
    """Test CSV export endpoint"""
    
    def test_export_csv(self):
        """Test CSV export returns valid CSV data"""
        response = requests.get(f"{BASE_URL}/api/leads/export/csv")
        assert response.status_code == 200
        
        # Check content type
        content_type = response.headers.get('content-type', '')
        assert 'text/csv' in content_type
        
        # Check content disposition
        content_disposition = response.headers.get('content-disposition', '')
        assert 'attachment' in content_disposition
        assert 'weroi_leads' in content_disposition
        
        # Verify CSV structure
        csv_content = response.text
        lines = csv_content.strip().split('\n')
        assert len(lines) >= 1  # At least header row
        
        # Check header
        header = lines[0]
        expected_columns = ['Type', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Source', 'Status']
        for col in expected_columns:
            assert col in header, f"Missing column: {col}"
        
        print(f"✓ CSV export successful: {len(lines)} rows (including header)")


class TestAnalyticsAPI:
    """Test analytics endpoints"""
    
    def test_track_event(self):
        """Test tracking analytics event"""
        response = requests.post(f"{BASE_URL}/api/analytics/event", json={
            "event_type": "page_view",
            "page": "/test-page",
            "user_agent": "Test Agent"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "tracked"
        assert "id" in data
        print(f"✓ Analytics event tracked: {data['id']}")
    
    def test_get_analytics_stats(self):
        """Test getting analytics statistics"""
        response = requests.get(f"{BASE_URL}/api/analytics/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "total_page_views" in data
        assert "total_unique_visitors" in data
        assert "audit_funnel" in data
        assert "popup_funnel" in data
        
        print(f"✓ Analytics stats: {data['total_page_views']} views, {data['total_unique_visitors']} unique visitors")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
