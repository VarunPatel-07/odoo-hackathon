"""
Test script for raise_request endpoint
Run this after starting the server with: python manage.py runserver
"""
import requests
import json

# Configuration
BASE_URL = "http://127.0.0.1:8000/api"
USERNAME = "admin"  # Replace with your username
PASSWORD = "admin123"  # Replace with your password

def test_raise_request():
    """Test the raise_request endpoint"""
    
    # Step 1: Login to get auth token
    print("1. Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/login/",
        json={"username": USERNAME, "password": PASSWORD}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json().get("token")
    print(f"✅ Login successful. Token: {token[:20]}...")
    
    headers = {
        "Authorization": f"Token {token}",
        "Content-Type": "application/json"
    }
    
    # Step 2: Get available equipment
    print("\n2. Fetching available equipment...")
    equipment_response = requests.get(f"{BASE_URL}/equipment/", headers=headers)
    
    if equipment_response.status_code != 200:
        print(f"❌ Failed to fetch equipment: {equipment_response.status_code}")
        return
    
    equipment_list = equipment_response.json()
    if not equipment_list:
        print("❌ No equipment found in database")
        return
    
    # Use the first equipment
    equipment_id = equipment_list[0]["id"]
    equipment_name = equipment_list[0]["name"]
    print(f"✅ Found equipment: {equipment_name} (ID: {equipment_id})")
    
    # Step 3: Raise a maintenance request
    print("\n3. Raising maintenance request...")
    request_data = {
        "equipment": equipment_id,
        "name": "Test Maintenance Request",
        "description": "This is a test maintenance request raised via API",
        "request_type": "corrective",
        "priority": "medium",
        "scheduled_date": "2024-12-31"
    }
    
    raise_response = requests.post(
        f"{BASE_URL}/requests/raise_request/",
        headers=headers,
        json=request_data
    )
    
    if raise_response.status_code == 201:
        print("✅ Maintenance request raised successfully!")
        request_info = raise_response.json()
        print(f"\nRequest Details:")
        print(f"  ID: {request_info.get('id')}")
        print(f"  Name: {request_info.get('name')}")
        print(f"  Status: {request_info.get('status')}")
        print(f"  Priority: {request_info.get('priority')}")
        print(f"  Equipment: {request_info.get('equipment_details', {}).get('name')}")
        print(f"  Work Center: {request_info.get('work_center_details', {}).get('name')}")
        print(f"  Created By: {request_info.get('created_by_details', {}).get('username')}")
    else:
        print(f"❌ Failed to raise request: {raise_response.status_code}")
        print(raise_response.text)
    
    # Step 4: Verify the request was created
    print("\n4. Verifying request in list...")
    list_response = requests.get(f"{BASE_URL}/requests/", headers=headers)
    
    if list_response.status_code == 200:
        requests_list = list_response.json()
        print(f"✅ Total requests in system: {len(requests_list)}")
    else:
        print(f"❌ Failed to fetch requests list: {list_response.status_code}")

if __name__ == "__main__":
    print("=" * 60)
    print("Testing Raise Maintenance Request Endpoint")
    print("=" * 60)
    test_raise_request()
    print("\n" + "=" * 60)
    print("Test completed!")
    print("=" * 60)
