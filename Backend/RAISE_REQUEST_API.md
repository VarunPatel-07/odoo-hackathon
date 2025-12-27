# Raise Maintenance Request API

## Overview
A simplified endpoint for users to raise maintenance requests for equipment. This endpoint automatically populates most fields from the equipment details, requiring users to provide only essential information.

## Endpoint
```
POST /api/requests/raise_request/
```

## Authentication
**Required**: Yes (Token Authentication)

Include token in header:
```
Authorization: Token <your_token_here>
```

## Request Body

### Required Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `equipment` | integer | ID of the equipment needing maintenance | `1` |
| `name` | string | Brief title of the issue | `"Air compressor not starting"` |
| `description` | string | Detailed description of the problem | `"The main compressor unit fails to start..."` |
| `request_type` | string | Type of maintenance request | `"corrective"` or `"preventive"` |

### Optional Fields
| Field | Type | Description | Default | Options |
|-------|------|-------------|---------|---------|
| `priority` | string | Urgency level | `"low"` | `"low"`, `"medium"`, `"high"` |
| `scheduled_date` | date | Preferred date for maintenance | `null` | ISO format: `"2024-12-31"` |

## Auto-Populated Fields
The following fields are automatically set from the equipment:
- `created_by` - Set to the authenticated user
- `work_center` - Copied from equipment's work center
- `equipment_category` - Copied from equipment's category
- `company` - Copied from equipment's company
- `request_date` - Set to current date
- `status` - Set to `"new"`
- `color` - Set based on priority (low=green, medium=yellow, high=red)

## Request Example

### cURL
```bash
curl -X POST http://127.0.0.1:8000/api/requests/raise_request/ \
  -H "Authorization: Token your_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "equipment": 1,
    "name": "Hydraulic press leaking oil",
    "description": "Oil leak detected at the main cylinder seal. Approximately 2L of oil has leaked.",
    "request_type": "corrective",
    "priority": "high",
    "scheduled_date": "2024-12-20"
  }'
```

### JavaScript (fetch)
```javascript
const response = await fetch('http://127.0.0.1:8000/api/requests/raise_request/', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    equipment: 1,
    name: 'Hydraulic press leaking oil',
    description: 'Oil leak detected at the main cylinder seal. Approximately 2L of oil has leaked.',
    request_type: 'corrective',
    priority: 'high',
    scheduled_date: '2024-12-20'
  })
});

const data = await response.json();
console.log(data);
```

### Python (requests)
```python
import requests

token = "your_token_here"
headers = {
    "Authorization": f"Token {token}",
    "Content-Type": "application/json"
}

data = {
    "equipment": 1,
    "name": "Hydraulic press leaking oil",
    "description": "Oil leak detected at the main cylinder seal.",
    "request_type": "corrective",
    "priority": "high",
    "scheduled_date": "2024-12-20"
}

response = requests.post(
    "http://127.0.0.1:8000/api/requests/raise_request/",
    headers=headers,
    json=data
)

print(response.json())
```

## Response

### Success Response (201 Created)
```json
{
  "id": 10,
  "name": "Hydraulic press leaking oil",
  "description": "Oil leak detected at the main cylinder seal. Approximately 2L of oil has leaked.",
  "request_type": "corrective",
  "request_type_display": "Corrective",
  "priority": "high",
  "priority_display": "High",
  "color": "red",
  "request_date": "2024-12-15",
  "scheduled_date": "2024-12-20",
  "completion_date": null,
  "duration": null,
  "status": "new",
  "status_display": "New",
  "equipment": 1,
  "equipment_details": {
    "id": 1,
    "name": "Hydraulic Press HP-500",
    "serial_number": "HP500-2023-001",
    "category_name": "Hydraulic Equipment",
    "work_center_name": "Assembly Line 1"
  },
  "work_center": 1,
  "work_center_details": {
    "id": 1,
    "name": "Assembly Line 1",
    "code": "AL-001"
  },
  "maintenance_team": null,
  "maintenance_team_details": null,
  "assigned_to": null,
  "assigned_to_details": null,
  "created_by": 1,
  "created_by_details": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe"
  },
  "equipment_category": 1,
  "equipment_category_name": "Hydraulic Equipment",
  "company": 1,
  "company_name": "TechCorp Industries",
  "is_overdue": false,
  "logs": [
    {
      "id": 15,
      "action": "Created",
      "old_status": null,
      "new_status": "new",
      "notes": "Maintenance request created by John Doe",
      "user": 1,
      "user_name": "John Doe",
      "created_at": "2024-12-15T10:30:00Z"
    }
  ],
  "created_at": "2024-12-15T10:30:00Z",
  "updated_at": "2024-12-15T10:30:00Z"
}
```

### Error Responses

#### 400 Bad Request - Invalid Data
```json
{
  "equipment": ["This field is required."],
  "name": ["This field is required."]
}
```

#### 400 Bad Request - Inactive Equipment
```json
{
  "equipment": ["Cannot create a request for inactive equipment."]
}
```

#### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

## Request Type Options
- `"corrective"` - For fixing broken/faulty equipment
- `"preventive"` - For scheduled preventive maintenance

## Priority Levels
- `"low"` - Non-urgent, can be scheduled at convenience (Color: Green)
- `"medium"` - Should be addressed soon (Color: Yellow)
- `"high"` - Urgent, needs immediate attention (Color: Red)

## Workflow After Request Creation
1. Request is created with status `"new"`
2. A maintenance log entry is automatically created
3. Maintenance team manager can:
   - Assign the request to a team
   - Assign to a specific technician
   - Set priority if not already set
4. Technician can:
   - Pick up the request (self-assign)
   - Update status as work progresses
   - Mark as complete with duration

## Status Flow
```
new → in_progress → done → repaired
                  ↘ pending → (back to in_progress or done)
                  ↘ scrap (for equipment beyond repair)
```

## Benefits of This Endpoint
1. **Simplified for Users**: Only requires essential information
2. **Auto-Population**: Equipment details automatically filled
3. **Audit Trail**: Automatic log creation tracks who raised the request
4. **Validation**: Ensures equipment is active before allowing request
5. **Consistent Data**: Uses equipment's existing relationships (work center, company)

## Testing
Run the provided test script:
```bash
cd Backend
python test_raise_request.py
```

Make sure to:
1. Start the Django server: `python manage.py runserver`
2. Have valid credentials (username/password)
3. Have at least one active equipment in the database

## Related Endpoints
- `GET /api/equipment/` - List all equipment to get IDs
- `GET /api/requests/` - List all maintenance requests
- `GET /api/requests/{id}/` - Get specific request details
- `POST /api/requests/{id}/update_status/` - Update request status
- `POST /api/requests/{id}/pick_up/` - Technician self-assigns request
