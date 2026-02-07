"""
Backend API Tests for weROI Admin Dashboard - CRUD Operations
Tests: Edit, Delete, Clear All leads, Analytics tracking
Password: TylerandZach2025!
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PASSWORD = "TylerandZach2025!"

class TestAdminAuth:
    """Test admin authentication with new password"""
    
    def test_admin_auth_success(self):
        """Test successful admin authentication with TylerandZach2025!"""
        response = requests.post(f"{BASE_URL}/api/admin/auth", json={
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert data["authenticated"] == True
        assert "token" in data
        print(f"✓ Admin auth successful with new password: {data}")
    
    def test_admin_auth_invalid_password(self):
        """Test admin auth with invalid password"""
        response = requests.post(f"{BASE_URL}/api/admin/auth", json={
            "password": "wrong_password"
        })
        assert response.status_code == 401
        print("✓ Invalid password correctly rejected with 401")


class TestEditLeads:
    """Test edit/update lead endpoints"""
    
    def test_edit_audit_lead(self):
        """Test PUT /api/leads/audit/{lead_id} - Edit audit lead"""
        # First create a test lead
        unique_email = f"TEST_edit_audit_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(f"{BASE_URL}/api/leads/audit", json={
            "name": "TEST_Edit Lead",
            "phone": "+1 555 999 8888",
            "email": unique_email,
            "company_name": "TEST_Edit Corp",
            "how_found_us": "Google Search"
        })
        assert create_response.status_code == 200
        lead_id = create_response.json()["id"]
        
        # Edit the lead
        update_response = requests.put(
            f"{BASE_URL}/api/leads/audit/{lead_id}?password={ADMIN_PASSWORD}",
            json={
                "name": "TEST_Updated Name",
                "status": "contacted"
            }
        )
        assert update_response.status_code == 200
        updated_lead = update_response.json()
        assert updated_lead["name"] == "TEST_Updated Name"
        assert updated_lead["status"] == "contacted"
        print(f"✓ Audit lead edited successfully: {updated_lead['name']}, status={updated_lead['status']}")
        
        # Cleanup - delete the test lead
        requests.delete(f"{BASE_URL}/api/leads/audit/{lead_id}?password={ADMIN_PASSWORD}")
    
    def test_edit_guide_lead(self):
        """Test PUT /api/leads/guide/{lead_id} - Edit guide lead"""
        # First create a test lead
        unique_email = f"TEST_edit_guide_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(f"{BASE_URL}/api/leads/guide", json={
            "name": "TEST_Edit Guide Lead",
            "email": unique_email
        })
        assert create_response.status_code == 200
        lead_id = create_response.json()["id"]
        
        # Edit the lead
        update_response = requests.put(
            f"{BASE_URL}/api/leads/guide/{lead_id}?password={ADMIN_PASSWORD}",
            json={
                "name": "TEST_Updated Guide Name"
            }
        )
        assert update_response.status_code == 200
        updated_lead = update_response.json()
        assert updated_lead["name"] == "TEST_Updated Guide Name"
        print(f"✓ Guide lead edited successfully: {updated_lead['name']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/leads/guide/{lead_id}?password={ADMIN_PASSWORD}")
    
    def test_edit_lead_invalid_password(self):
        """Test edit lead with invalid password returns 401"""
        response = requests.put(
            f"{BASE_URL}/api/leads/audit/fake-id?password=wrong",
            json={"name": "Test"}
        )
        assert response.status_code == 401
        print("✓ Edit with invalid password correctly rejected with 401")


class TestDeleteLeads:
    """Test delete lead endpoints"""
    
    def test_delete_single_audit_lead(self):
        """Test DELETE /api/leads/audit/{lead_id} - Delete single audit lead"""
        # Create a test lead
        unique_email = f"TEST_delete_audit_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(f"{BASE_URL}/api/leads/audit", json={
            "name": "TEST_Delete Lead",
            "phone": "+1 555 777 6666",
            "email": unique_email,
            "company_name": "TEST_Delete Corp",
            "how_found_us": "Google Search"
        })
        assert create_response.status_code == 200
        lead_id = create_response.json()["id"]
        
        # Delete the lead
        delete_response = requests.delete(
            f"{BASE_URL}/api/leads/audit/{lead_id}?password={ADMIN_PASSWORD}"
        )
        assert delete_response.status_code == 200
        data = delete_response.json()
        assert data["deleted"] == True
        assert data["id"] == lead_id
        print(f"✓ Audit lead deleted successfully: {lead_id}")
        
        # Verify lead is gone
        get_response = requests.get(f"{BASE_URL}/api/leads/audit")
        leads = get_response.json()
        lead_ids = [l["id"] for l in leads]
        assert lead_id not in lead_ids
        print("✓ Verified lead no longer exists in database")
    
    def test_delete_single_guide_lead(self):
        """Test DELETE /api/leads/guide/{lead_id} - Delete single guide lead"""
        # Create a test lead
        unique_email = f"TEST_delete_guide_{uuid.uuid4().hex[:8]}@test.com"
        create_response = requests.post(f"{BASE_URL}/api/leads/guide", json={
            "name": "TEST_Delete Guide Lead",
            "email": unique_email
        })
        assert create_response.status_code == 200
        lead_id = create_response.json()["id"]
        
        # Delete the lead
        delete_response = requests.delete(
            f"{BASE_URL}/api/leads/guide/{lead_id}?password={ADMIN_PASSWORD}"
        )
        assert delete_response.status_code == 200
        data = delete_response.json()
        assert data["deleted"] == True
        print(f"✓ Guide lead deleted successfully: {lead_id}")
    
    def test_delete_lead_invalid_password(self):
        """Test delete lead with invalid password returns 401"""
        response = requests.delete(
            f"{BASE_URL}/api/leads/audit/fake-id?password=wrong"
        )
        assert response.status_code == 401
        print("✓ Delete with invalid password correctly rejected with 401")
    
    def test_delete_nonexistent_lead(self):
        """Test delete nonexistent lead returns 404"""
        response = requests.delete(
            f"{BASE_URL}/api/leads/audit/nonexistent-id?password={ADMIN_PASSWORD}"
        )
        assert response.status_code == 404
        print("✓ Delete nonexistent lead correctly returns 404")


class TestClearAllLeads:
    """Test clear all leads endpoint"""
    
    def test_clear_all_endpoint_exists(self):
        """Test DELETE /api/leads/clear-all endpoint exists and requires password"""
        # Test with invalid password
        response = requests.delete(
            f"{BASE_URL}/api/leads/clear-all?password=wrong&lead_type=audit"
        )
        assert response.status_code == 401
        print("✓ Clear all endpoint requires valid password")
    
    def test_clear_all_invalid_type(self):
        """Test clear all with invalid lead_type returns 400"""
        response = requests.delete(
            f"{BASE_URL}/api/leads/clear-all?password={ADMIN_PASSWORD}&lead_type=invalid"
        )
        assert response.status_code == 400
        print("✓ Clear all with invalid type correctly returns 400")


class TestAnalyticsTracking:
    """Test analytics event tracking"""
    
    def test_track_page_view(self):
        """Test POST /api/analytics/event - Track page view"""
        response = requests.post(f"{BASE_URL}/api/analytics/event", json={
            "event_type": "page_view",
            "page": "/",
            "referrer": "https://google.com",
            "session_id": f"test_session_{uuid.uuid4().hex[:8]}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "tracked"
        assert "id" in data
        print(f"✓ Page view tracked: {data['id']}")
    
    def test_track_audit_form_start(self):
        """Test tracking audit_form_start event"""
        response = requests.post(f"{BASE_URL}/api/analytics/event", json={
            "event_type": "audit_form_start",
            "page": "/audit",
            "referrer": "https://weroi.net",
            "session_id": f"test_session_{uuid.uuid4().hex[:8]}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "tracked"
        print(f"✓ Audit form start tracked: {data['id']}")
    
    def test_track_popup_shown(self):
        """Test tracking popup_shown event"""
        response = requests.post(f"{BASE_URL}/api/analytics/event", json={
            "event_type": "popup_shown",
            "page": "/",
            "session_id": f"test_session_{uuid.uuid4().hex[:8]}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "tracked"
        print(f"✓ Popup shown tracked: {data['id']}")
    
    def test_get_analytics_stats(self):
        """Test GET /api/analytics/stats - Get comprehensive analytics"""
        response = requests.get(f"{BASE_URL}/api/analytics/stats")
        assert response.status_code == 200
        
        data = response.json()
        # Verify new analytics structure
        assert "total_unique_visitors" in data
        assert "total_page_views" in data
        assert "audit_funnel" in data
        assert "popup_funnel" in data
        assert "top_sources" in data
        
        # Verify funnel structure
        assert "started" in data["audit_funnel"]
        assert "submitted" in data["audit_funnel"]
        assert "conversion_rate" in data["audit_funnel"]
        
        print(f"✓ Analytics stats: {data['total_unique_visitors']} unique visitors, {data['total_page_views']} page views")
        print(f"  Audit funnel: {data['audit_funnel']['started']} started, {data['audit_funnel']['submitted']} submitted, {data['audit_funnel']['conversion_rate']}% conversion")


class TestDashboardData:
    """Test admin dashboard data endpoint"""
    
    def test_get_dashboard_data_success(self):
        """Test GET /api/admin/dashboard-data with valid password"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard-data?password={ADMIN_PASSWORD}")
        assert response.status_code == 200
        
        data = response.json()
        # Verify structure
        assert "audit_leads" in data
        assert "guide_leads" in data
        assert "stats" in data
        
        # Verify enhanced stats structure
        stats = data["stats"]
        assert "total_unique_visitors" in stats
        assert "total_page_views" in stats
        assert "total_audit_leads" in stats
        assert "total_guide_leads" in stats
        assert "audit_form_starts" in stats
        assert "audit_conversion_rate" in stats
        assert "popup_shown" in stats
        assert "popup_capture_rate" in stats
        assert "top_sources" in stats
        
        print(f"✓ Dashboard data retrieved: {stats['total_audit_leads']} audit leads, {stats['total_guide_leads']} guide leads")
        print(f"  Analytics: {stats['total_unique_visitors']} unique visitors, {stats['audit_conversion_rate']}% audit conversion")
    
    def test_get_dashboard_data_invalid_password(self):
        """Test dashboard data with invalid password returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/dashboard-data?password=wrong")
        assert response.status_code == 401
        print("✓ Dashboard data with invalid password correctly rejected with 401")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
