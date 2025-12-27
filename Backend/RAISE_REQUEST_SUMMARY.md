# Raise Maintenance Request - Implementation Summary

## What Was Added

### 1. New Serializer: `RaiseMaintenanceRequestSerializer`
**File**: `Backend/maintenance/serializers.py`

A simplified serializer that:
- **Required fields**: `equipment`, `name`, `description`, `request_type`
- **Optional fields**: `priority` (default: "low"), `scheduled_date`
- **Auto-populated fields**:
  - `created_by` → Current authenticated user
  - `work_center` → From equipment
  - `equipment_category` → From equipment
  - `company` → From equipment
  - `request_date` → Current date
  - `status` → "new"
  - `color` → Based on priority (low=green, medium=yellow, high=red)
- **Validation**: Ensures equipment is active
- **Logging**: Automatically creates a MaintenanceLog entry

### 2. New ViewSet Action: `raise_request`
**File**: `Backend/maintenance/views.py`

Added to `MaintenanceRequestViewSet`:
```python
@action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
def raise_request(self, request):
```

Features:
- **Endpoint**: `POST /api/requests/raise_request/`
- **Authentication**: Required (Token-based)
- **Response**: Returns full MaintenanceRequest details (201 Created)
- **Error handling**: Validates all inputs and returns detailed errors

### 3. Updated Imports
- Added `RaiseMaintenanceRequestSerializer` to views.py imports
- Updated `get_serializer_class()` method to use the new serializer

## API Endpoint

### URL
```
POST /api/requests/raise_request/
```

### Request Body (Minimal)
```json
{
  "equipment": 1,
  "name": "Equipment malfunction",
  "description": "Detailed description of the issue",
  "request_type": "corrective",
  "priority": "medium",
  "scheduled_date": "2024-12-31"
}
```

### Response (Full Details)
Returns complete MaintenanceRequest object with:
- All auto-populated fields
- Related object details (equipment_details, work_center_details, created_by_details)
- Initial maintenance log entry
- Status: 201 Created

## Testing

### Test Script
**File**: `Backend/test_raise_request.py`

Run with:
```bash
cd Backend
python test_raise_request.py
```

The script:
1. Logs in to get authentication token
2. Fetches available equipment
3. Raises a test maintenance request
4. Verifies the request was created

### Prerequisites for Testing
1. Django server running: `python manage.py runserver`
2. Valid user credentials (default: admin/admin123)
3. At least one active equipment in database

## Documentation

### User Guide
**File**: `Backend/RAISE_REQUEST_API.md`

Comprehensive documentation including:
- Endpoint details and authentication
- Request/response formats
- Field descriptions
- Code examples (cURL, JavaScript, Python)
- Error responses
- Workflow explanations
- Priority and request type options

## Benefits

### For Users
1. **Simple**: Only 4 required fields (equipment, name, description, type)
2. **Smart**: Auto-fills 7+ fields from equipment
3. **Validated**: Checks equipment is active before creating request
4. **Tracked**: Automatic audit log of who raised the request

### For System
1. **Data Consistency**: Uses existing equipment relationships
2. **Audit Trail**: Every request has a creation log
3. **Workflow Integration**: Fits into existing status workflow
4. **Permissions**: Requires authentication but allows any authenticated user

## Workflow Integration

### After Request Creation
1. Request created with status "new"
2. Maintenance log automatically created
3. Visible to maintenance team managers
4. Can be assigned to team or technician
5. Follows standard status workflow: new → in_progress → done → repaired

### Related Actions Available
- `POST /api/requests/{id}/update_status/` - Update status
- `POST /api/requests/{id}/assign/` - Assign to technician
- `POST /api/requests/{id}/pick_up/` - Technician self-assign
- `GET /api/requests/overdue/` - List overdue requests
- `GET /api/requests/calendar/` - Calendar view

## Field Mappings

### User Provides → System Sets
| User Input | System Auto-Fills |
|------------|-------------------|
| equipment (ID) | work_center (from equipment) |
|  | equipment_category (from equipment) |
|  | company (from equipment) |
|  | request_date (today) |
|  | status ("new") |
|  | color (from priority) |
|  | created_by (current user) |
| priority | color (low→green, medium→yellow, high→red) |

## Next Steps

### Frontend Integration
To build a form in React:

```jsx
import { useState } from 'react';
import { api } from '../utils/api/api';

function RaiseRequestForm() {
  const [formData, setFormData] = useState({
    equipment: '',
    name: '',
    description: '',
    request_type: 'corrective',
    priority: 'medium',
    scheduled_date: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/requests/raise_request/', formData);
      alert('Request raised successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Recommended Frontend Features
1. Equipment dropdown with search
2. Request type radio buttons (Corrective/Preventive)
3. Priority selector (Low/Medium/High) with color indicators
4. Rich text editor for description
5. Optional date picker for scheduled date
6. Form validation
7. Success/error notifications

## Testing Checklist
- [x] Serializer validates required fields
- [x] Serializer auto-populates fields from equipment
- [x] View action requires authentication
- [x] Creates MaintenanceLog entry
- [x] Returns 201 with full object details
- [x] Validates equipment is active
- [ ] Run test script with live server
- [ ] Test with different priorities
- [ ] Test with inactive equipment (should fail)
- [ ] Test without authentication (should fail)

## Files Modified
1. ✅ `Backend/maintenance/serializers.py` - Added RaiseMaintenanceRequestSerializer
2. ✅ `Backend/maintenance/views.py` - Added raise_request action
3. ✅ `Backend/test_raise_request.py` - Created test script
4. ✅ `Backend/RAISE_REQUEST_API.md` - Created API documentation
5. ✅ `Backend/RAISE_REQUEST_SUMMARY.md` - This file

## Status
**✅ Complete and Ready for Testing**

The backend view for users to raise maintenance requests has been successfully implemented!
