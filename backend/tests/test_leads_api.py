"""
Backend API Tests for weROI Lead Generation System
Tests: /api/leads/audit, /api/leads/guide, /api/leads/stats
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAPIHealth:
    """Test API health and root endpoint"""
    
    def test_api_root(self):
        """Test API root endpoint returns correct message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "weROI API" in data["message"]
        print(f"✓ API root endpoint working: {data['message']}")


class TestAuditLeadAPI:
    """Test /api/leads/audit endpoint - 5-step form submission"""
    
    def test_create_audit_lead_success(self):
        """Test successful audit lead creation with all required fields"""
        unique_email = f"TEST_audit_{uuid.uuid4().hex[:8]}@test.com"
        payload = {
            "name": "TEST_John Doe",
            "phone": "+1 555 123 4567",
            "email": unique_email,
            "company_name": "TEST_Acme Corp",
            "how_found_us": "Google Search"
        }
        
        response = requests.post(f"{BASE_URL}/api/leads/audit", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        # Verify all fields are returned correctly
        assert data["name"] == payload["name"]
        assert data["phone"] == payload["phone"]
        assert data["email"] == payload["email"]
        assert data["company_name"] == payload["company_name"]
        assert data["how_found_us"] == payload["how_found_us"]
        assert "id" in data
        assert data["status"] == "new"
        assert "created_at" in data
        print(f"✓ Audit lead created successfully: {data['id']}")
        
        return data["id"]
    
    def test_create_audit_lead_invalid_email(self):
        """Test audit lead creation with invalid email format"""
        payload = {
            "name": "TEST_Invalid Email",
            "phone": "+1 555 123 4567",
            "email": "invalid-email",
            "company_name": "TEST_Corp",
            "how_found_us": "Google Search"
        }
        
        response = requests.post(f"{BASE_URL}/api/leads/audit", json=payload)
        assert response.status_code == 422, f"Expected 422 for invalid email, got {response.status_code}"
        print("✓ Invalid email correctly rejected with 422")
    
    def test_create_audit_lead_missing_fields(self):
        """Test audit lead creation with missing required fields"""
        payload = {
            "name": "TEST_Missing Fields"
            # Missing: phone, email, company_name, how_found_us
        }
        
        response = requests.post(f"{BASE_URL}/api/leads/audit", json=payload)
        assert response.status_code == 422, f"Expected 422 for missing fields, got {response.status_code}"
        print("✓ Missing fields correctly rejected with 422")
    
    def test_get_audit_leads(self):
        """Test retrieving all audit leads"""
        response = requests.get(f"{BASE_URL}/api/leads/audit")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} audit leads")


class TestGuideLeadAPI:
    """Test /api/leads/guide endpoint - Exit intent popup form"""
    
    def test_create_guide_lead_success(self):
        """Test successful guide lead creation"""
        unique_email = f"TEST_guide_{uuid.uuid4().hex[:8]}@test.com"
        payload = {
            "name": "TEST_Jane Smith",
            "email": unique_email
        }
        
        response = requests.post(f"{BASE_URL}/api/leads/guide", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        # Verify all fields are returned correctly
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert "id" in data
        assert "created_at" in data
        # Email sequence fields should be initialized
        assert data["email_1_sent"] == False
        assert data["email_2_sent"] == False
        assert data["email_3_sent"] == False
        print(f"✓ Guide lead created successfully: {data['id']}")
        
        return data["id"]
    
    def test_create_guide_lead_invalid_email(self):
        """Test guide lead creation with invalid email"""
        payload = {
            "name": "TEST_Invalid",
            "email": "not-an-email"
        }
        
        response = requests.post(f"{BASE_URL}/api/leads/guide", json=payload)
        assert response.status_code == 422, f"Expected 422 for invalid email, got {response.status_code}"
        print("✓ Invalid email correctly rejected with 422")
    
    def test_create_guide_lead_missing_email(self):
        """Test guide lead creation with missing email"""
        payload = {
            "name": "TEST_No Email"
        }
        
        response = requests.post(f"{BASE_URL}/api/leads/guide", json=payload)
        assert response.status_code == 422, f"Expected 422 for missing email, got {response.status_code}"
        print("✓ Missing email correctly rejected with 422")
    
    def test_get_guide_leads(self):
        """Test retrieving all guide leads"""
        response = requests.get(f"{BASE_URL}/api/leads/guide")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} guide leads")


class TestLeadStatsAPI:
    """Test /api/leads/stats endpoint"""
    
    def test_get_lead_stats(self):
        """Test lead statistics endpoint"""
        response = requests.get(f"{BASE_URL}/api/leads/stats")
        assert response.status_code == 200
        
        data = response.json()
        # Verify stats structure
        assert "total_audit_leads" in data
        assert "total_guide_leads" in data
        assert "recent_audit_leads" in data
        assert "recent_guide_leads" in data
        
        # Verify types
        assert isinstance(data["total_audit_leads"], int)
        assert isinstance(data["total_guide_leads"], int)
        assert isinstance(data["recent_audit_leads"], list)
        assert isinstance(data["recent_guide_leads"], list)
        
        print(f"✓ Lead stats: {data['total_audit_leads']} audit, {data['total_guide_leads']} guide leads")


class TestEmailProcessingAPI:
    """Test /api/emails/process-scheduled endpoint"""
    
    def test_process_scheduled_emails(self):
        """Test scheduled email processing endpoint"""
        response = requests.post(f"{BASE_URL}/api/emails/process-scheduled")
        assert response.status_code == 200
        
        data = response.json()
        assert "processed_email_2" in data
        assert "processed_email_3" in data
        print(f"✓ Email processing: {data['processed_email_2']} email 2, {data['processed_email_3']} email 3")


class TestStatusAPI:
    """Test /api/status endpoint"""
    
    def test_create_status_check(self):
        """Test status check creation"""
        payload = {
            "client_name": "TEST_Client"
        }
        
        response = requests.post(f"{BASE_URL}/api/status", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert data["client_name"] == payload["client_name"]
        assert "id" in data
        assert "timestamp" in data
        print(f"✓ Status check created: {data['id']}")
    
    def test_get_status_checks(self):
        """Test retrieving status checks"""
        response = requests.get(f"{BASE_URL}/api/status")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Retrieved {len(data)} status checks")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
