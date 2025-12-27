# 🛠️ GearGuard - Ultimate Maintenance Tracking System

<div align="center">

![GearGuard](https://img.shields.io/badge/GearGuard-Maintenance%20Tracker-blue)
![Django](https://img.shields.io/badge/Django-5.0+-green)
![DRF](https://img.shields.io/badge/DRF-3.14+-orange)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A comprehensive enterprise-grade maintenance tracking and management system built with Django REST Framework and React + Vite**

[Features](#-features) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Testing](#-testing) • [Configuration](#-configuration)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Testing](#-testing)
- [Development](#-development)
- [Production Deployment](#-production-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**GearGuard** is a modern, full-featured maintenance tracking system designed for manufacturing and industrial environments. It provides comprehensive equipment management, maintenance request tracking, work center monitoring, and team coordination capabilities.

The system supports multi-company operations, preventive maintenance scheduling, vendor management, and detailed maintenance history tracking with powerful analytics and real-time calendar visualization.

---

## ✨ Features

### 🔐 Authentication & User Management
- ✅ User registration with email validation
- ✅ Secure login with token-based authentication
- ✅ Social authentication (Google OAuth via django-allauth)
- ✅ Password change (authenticated users)
- ✅ Forgot password & password reset via email
- ✅ User profile management with statistics
- ✅ Maintenance history tracking per user
- ✅ Role-based access control
- ✅ Protected routes with React Router

### 🏭 Core Features
- ✅ **Multi-Company Support** - Manage multiple companies/locations
- ✅ **Equipment Management** - Track all equipment with detailed specifications
- ✅ **Work Center Monitoring** - Track manufacturing lines and work centers
- ✅ **Maintenance Requests** - Create and track corrective/preventive maintenance
- ✅ **Team Management** - Organize maintenance teams and assign tasks
- ✅ **Vendor Management** - Track vendors, warranties, and service contracts
- ✅ **Scheduled Maintenance** - Automate preventive maintenance tasks
- ✅ **Real-time Dashboard** - View statistics and key metrics
- ✅ **Calendar View** - Schedule and visualize maintenance activities
- ✅ **Maintenance Logs** - Track all maintenance activities and costs

### 📊 Advanced Features
- ✅ Equipment scrap workflow
- ✅ OEE (Overall Equipment Effectiveness) tracking
- ✅ Cost tracking per maintenance activity
- ✅ Priority-based request management
- ✅ Status workflow (New → In Progress → Repaired → Scrap)
- ✅ Equipment category management
- ✅ Department and employee tracking
- ✅ Warranty expiry notifications
- ✅ Overdue maintenance alerts
- ✅ Image uploads for equipment/employees

### 🔔 Automation
- ✅ Celery task queue for background jobs
- ✅ Celery Beat for scheduled tasks
- ✅ Automated email notifications
- ✅ Auto-fill equipment data on request creation
- ✅ Status-based color coding
- ✅ Maintenance statistics calculation

---

## 🚀 Tech Stack

### Backend
- **Framework:** Django 5.0+
- **API:** Django REST Framework 3.14+
- **Authentication:** 
  - Token-based (DRF AuthToken)
  - Social Auth (django-allauth with Google OAuth)
  - dj-rest-auth for REST API authentication
- **Database:** SQLite (Development) / PostgreSQL (Production recommended)
- **Task Queue:** Celery 5.3+
- **Scheduler:** Celery Beat with django-celery-beat 2.5+
- **Message Broker:** Redis 5.0+
- **CORS:** django-cors-headers 4.3+
- **Filtering:** django-filter 23.5+
- **Image Processing:** Pillow 10.0+
- **Environment:** python-dotenv 1.0+

### Frontend
- **Framework:** React 19.2
- **Build Tool:** Vite 7.2
- **Styling:** TailwindCSS 4.1
- **Routing:** React Router DOM 7.11
- **UI Components:**
  - React Icons 5.5
  - React Big Calendar 1.19 (calendar view)
  - React Loading Skeleton 3.5 (loading states)
  - React DnD 16.0 (drag & drop)
  - Sortable.js (list reordering)
- **HTTP Client:** Axios 1.13
- **Date Handling:** date-fns 4.1
- **Utilities:** 
  - clsx & tailwind-merge (class management)
  - js-cookie (cookie handling)
  - crypto-js (encryption)
  - validator (validation)
  - uuid (unique IDs)

### DevOps
- **Version Control:** Git
- **Package Manager:** pip (Python), pnpm (Node.js)

---

## 📁 Project Structure

```
odoo-hackathon/
├── Backend/
│   ├── gearguard/              # Django project settings
│   │   ├── settings.py         # Main configuration
│   │   ├── urls.py             # Root URL routing
│   │   ├── celery.py           # Celery configuration
│   │   ├── wsgi.py             # WSGI entry point
│   │   └── asgi.py             # ASGI entry point
│   │
│   ├── maintenance/            # Main application
│   │   ├── models.py           # Database models (11 models)
│   │   ├── serializers.py      # DRF serializers
│   │   ├── views.py            # API views and business logic
│   │   ├── urls.py             # API routing
│   │   ├── admin.py            # Django admin configuration
│   │   ├── signals.py          # Signal handlers for automation
│   │   ├── tasks.py            # Celery tasks
│   │   └── migrations/         # Database migrations
│   │
│   ├── manage.py               # Django management script
│   ├── requirements.txt        # Python dependencies
│   ├── db.sqlite3              # Database (development)
│   ├── .env.example            # Environment variables template
│   └── PASSWORD_RESET_GUIDE.md # Password reset implementation guide
│
├── Frontend/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── common/         # Common UI components (Button, Input, Table, Dropdown)
│   │   │   ├── config/         # Configuration components
│   │   │   ├── layout/         # Layout components (Header, Sidebar, PageContainer)
│   │   │   ├── loader/         # Loading skeleton components
│   │   │   └── notification/   # Notification system
│   │   │
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Authentication pages (Login, Register)
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── maintenance/    # Maintenance request pages & calendar view
│   │   │   ├── config/         # Configuration pages (Equipment, Category, WorkCenter)
│   │   │   └── profile/        # User profile page
│   │   │
│   │   ├── context/            # React Context providers
│   │   │   └── notification/   # Notification context API
│   │   │
│   │   ├── layout/             # Layout wrappers
│   │   │   └── ProtectedRoutes.jsx  # Route protection
│   │   │
│   │   ├── config/             # Configuration files
│   │   │   └── EnvConfig.js    # Environment configuration
│   │   │
│   │   ├── constant/           # Constants and configurations
│   │   │   ├── configModule.jsx    # Config sidebar items
│   │   │   └── constant.js         # Application constants
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useDebounce.js  # Debounce hook
│   │   │
│   │   ├── utils/              # Utility functions
│   │   │   ├── api/            # API utilities
│   │   │   └── helper/         # Helper functions
│   │   │
│   │   ├── styles/             # Global styles
│   │   │   └── index.css       # Main stylesheet
│   │   │
│   │   ├── App.jsx             # Main app component with routing
│   │   └── main.jsx            # Entry point
│   │
│   ├── public/                 # Public assets
│   ├── package.json            # Node dependencies
│   ├── pnpm-lock.yaml          # pnpm lock file
│   ├── vite.config.js          # Vite configuration
│   ├── eslint.config.js        # ESLint configuration
│   └── README.md               # Frontend documentation
│
├── .gitignore                  # Git ignore rules
├── .vscode/                    # VS Code settings
└── README.md                   # This file
```

---

## 🔧 Installation

### Prerequisites

- **Python:** 3.10 or higher (3.12 recommended)
- **Node.js:** 18.x or higher (for frontend)
- **pnpm:** 10.x or higher (preferred) or npm
- **Redis:** 5.0+ (required for Celery background tasks)
- **Git:** For version control
- **SQLite:** (built-in with Python) or PostgreSQL for production

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd odoo-hackathon
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (admin):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

   Server will be available at: **http://localhost:8000**

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   Frontend will be available at: **http://localhost:5173**

### Celery Setup (for background tasks and scheduled maintenance)

1. **Install and start Redis:**
   ```bash
   # Windows (using Chocolatey)
   choco install redis-64
   redis-server

   # Windows (using WSL)
   sudo apt-get install redis-server
   sudo service redis-server start

   # Linux
   sudo apt-get install redis-server
   sudo systemctl start redis

   # Mac
   brew install redis
   brew services start redis
   ```

2. **Start Celery worker (in a new terminal):**
   ```bash
   cd Backend
   # Windows
   celery -A gearguard worker -l info --pool=solo
   
   # Linux/Mac
   celery -A gearguard worker -l info
   ```

3. **Start Celery beat scheduler (in another terminal):**
   ```bash
   cd Backend
   celery -A gearguard beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
   ```

   **Note:** Celery Beat is required for automated scheduled maintenance tasks and periodic notifications.

---

## ⚙️ Configuration

### Backend Configuration

Edit `Backend/gearguard/settings.py`:

#### Database (Production)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'gearguard_db',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

#### Email Configuration (Production)
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'GearGuard <noreply@gearguard.com>'
```

#### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",      # Development
    "https://yourdomain.com",     # Production
]
```

#### Frontend URL (for password reset)
```python
FRONTEND_URL = 'http://localhost:5173'  # Development
# FRONTEND_URL = 'https://yourdomain.com'  # Production
```

### Environment Variables

Create `.env` file in Backend directory (copy from `.env.example`):
```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-use-strong-random-string

# Database (optional - defaults to SQLite)
# DATABASE_URL=postgresql://user:pass@localhost:5432/gearguard_db

# Redis (for Celery)
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Email Configuration (for password reset)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173

# Social Auth (Optional - for Google OAuth)
# GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
# GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret
```

**To generate a secure SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:8000/api/
Production: https://yourdomain.com/api/
```

### Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register/` | POST | Public | Register new user |
| `/auth/login/` | POST | Public | Login user |
| `/auth/logout/` | POST | Token | Logout user |
| `/auth/profile/` | GET/PUT/PATCH | Token | View/update profile |
| `/auth/change-password/` | POST | Token | Change password |
| `/auth/forgot-password/` | POST | Public | Request password reset |
| `/auth/reset-password/` | POST | Public | Confirm password reset |
| `/auth/maintenance-history/` | GET | Token | View user's requests |
| `/dj-rest-auth/google/` | POST | Public | Google OAuth login |

### Resource Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/users/` | GET | List all users |
| `/companies/` | GET, POST, PUT, PATCH, DELETE | Company management |
| `/vendors/` | GET, POST, PUT, PATCH, DELETE | Vendor management |
| `/departments/` | GET, POST, PUT, PATCH, DELETE | Department management |
| `/employees/` | GET, POST, PUT, PATCH, DELETE | Employee management |
| `/workcenters/` | GET, POST, PUT, PATCH, DELETE | Work center management |
| `/workcenters/{id}/equipment/` | GET | Get equipment by work center |
| `/workcenters/{id}/maintenance-stats/` | GET | Get maintenance statistics for work center |
| `/teams/` | GET, POST, PUT, PATCH, DELETE | Maintenance team management |
| `/teams/{id}/statistics/` | GET | Get team performance statistics |
| `/categories/` | GET, POST, PUT, PATCH, DELETE | Equipment category management |
| `/equipment/` | GET, POST, PUT, PATCH, DELETE | Equipment management |
| `/equipment/{id}/scrap/` | POST | Mark equipment as scrapped |
| `/equipment/{id}/maintenance-history/` | GET | Get equipment maintenance history |
| `/requests/` | GET, POST, PUT, PATCH, DELETE | Maintenance request management |
| `/requests/{id}/complete/` | POST | Complete a maintenance request |
| `/requests/overdue/` | GET | Get overdue maintenance requests |
| `/requests/by-priority/` | GET | Get requests grouped by priority |
| `/scheduled/` | GET, POST, PUT, PATCH, DELETE | Scheduled maintenance |
| `/scheduled/{id}/trigger/` | POST | Manually trigger scheduled maintenance |
| `/dashboard/` | GET | Dashboard statistics |
| `/calendar/` | GET | Calendar events for maintenance visualization |

### Authentication Header
```http
Authorization: Token <your-token-here>
Content-Type: application/json
```

### Complete API Documentation

See detailed documentation:
- **[PASSWORD_RESET_GUIDE.md](Backend/PASSWORD_RESET_GUIDE.md)** - Password reset implementation guide
- Use Django REST Framework's browsable API at `http://localhost:8000/api/` for interactive documentation

---

## 🔑 Authentication

### Registration Example
```javascript
const response = await fetch('http://localhost:8000/api/auth/register/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    password2: 'SecurePass123!',
    first_name: 'John',
    last_name: 'Doe'
  })
});
const data = await response.json();
localStorage.setItem('token', data.token);
```

### Login Example
```javascript
const response = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'SecurePass123!'
  })
});
const data = await response.json();
localStorage.setItem('token', data.token);
```

### Authenticated Request Example
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8000/api/auth/profile/', {
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  }
});
const profile = await response.json();
```

---

## 🧪 Testing

### Backend Tests

#### Run All Tests
```bash
cd Backend
python manage.py test maintenance
```

#### Run Specific Test Class
```bash
python manage.py test maintenance.tests.TestClassName
```

#### Manual API Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123!","password2":"TestPass123!","first_name":"Test","last_name":"User"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPass123!"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:8000/api/auth/profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

**Create Equipment:**
```bash
curl -X POST http://localhost:8000/api/equipment/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Equipment","model":"Model-123","serial_number":"SN-123","category":1,"workcenter":1}'
```

### Testing with Django Admin

1. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

2. Access admin panel at `http://localhost:8000/admin/`

3. Test all models and relationships through the admin interface

### Frontend Testing

Currently, frontend uses manual testing through the UI. To test:

1. Start the backend server
2. Start the frontend development server
3. Navigate through all pages:
   - Login/Register
   - Dashboard
   - Maintenance Requests (list & calendar view)
   - Configuration pages (Equipment, Categories, Work Centers)
   - Profile page

### Test Coverage

The project includes functionality for:
- ✅ User authentication (registration, login, logout)
- ✅ Password management (change, forgot, reset)
- ✅ Profile management with statistics
- ✅ Token validation
- ✅ CRUD operations for all models
- ✅ Calendar view for maintenance scheduling
- ✅ Dashboard statistics
- ✅ Error handling and validation
- ✅ Protected routes

---

## 💻 Development

### Running Development Servers

**Backend:**
```bash
cd Backend
python manage.py runserver
```

**Frontend:**
```bash
cd Frontend
pnpm dev
```

**Celery Worker (optional):**
```bash
cd Backend
celery -A gearguard worker -l info
```

**Celery Beat (optional):**
```bash
cd Backend
celery -A gearguard beat -l info
```

### Django Admin Panel

Access admin panel at: **http://localhost:8000/admin/**

Features:
- User management
- Model CRUD operations
- Celery Beat scheduler (scheduled tasks)
- Database inspection

### API Browsable Interface

Django REST Framework provides a browsable API at: **http://localhost:8000/api/**

---

## 🚢 Production Deployment

### Backend Deployment

1. **Update settings for production:**
   - Set `DEBUG = False`
   - Configure allowed hosts
   - Use PostgreSQL database
   - Configure SMTP for emails
   - Set strong `SECRET_KEY`

2. **Collect static files:**
   ```bash
   python manage.py collectstatic
   ```

3. **Use production WSGI server:**
   ```bash
   pip install gunicorn
   gunicorn gearguard.wsgi:application
   ```

4. **Set up Nginx as reverse proxy**

5. **Configure SSL/TLS certificates**

6. **Set up Celery with supervisor/systemd**

### Frontend Deployment

1. **Build production bundle:**
   ```bash
   cd Frontend
   pnpm build
   ```

2. **Deploy `dist/` folder to:**
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Nginx static hosting

3. **Update API base URL in production**

### Environment Variables

Production environment variables:
```env
DEBUG=False
SECRET_KEY=<strong-secret-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379/0
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
FRONTEND_URL=https://yourdomain.com
```

---

## 📊 Database Models

The system includes 11 core models:

1. **Company** - Multi-company support
2. **Department** - Organizational structure
3. **Vendor** - Vendor and supplier management
4. **Employee** - Employee tracking with user linking
5. **WorkCenter** - Manufacturing line management
6. **MaintenanceTeam** - Team organization
7. **EquipmentCategory** - Equipment classification
8. **Equipment** - Equipment tracking and management
9. **MaintenanceRequest** - Maintenance ticket system
10. **MaintenanceLog** - Activity logging
11. **ScheduledMaintenance** - Preventive maintenance

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write descriptive commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Developed for the Odoo Hackathon 2025

---

## 🙏 Acknowledgments

- Django and Django REST Framework communities
- React and Vite teams
- Celery project
- All open-source contributors

---

## 📞 Support

For issues, questions, or suggestions:

1. Check existing documentation
2. Search existing issues
3. Create a new issue with detailed information

---

## 🎯 Roadmap

### Current Features ✅
- ✅ Token-based authentication with social auth
- ✅ Complete CRUD for all entities
- ✅ Calendar view for maintenance scheduling
- ✅ Dashboard with statistics
- ✅ Drag & drop functionality
- ✅ Responsive design with TailwindCSS
- ✅ Loading skeletons for better UX
- ✅ Toast notifications

### Upcoming Features 🚧
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics and reporting dashboards
- [ ] Export data to Excel/PDF
- [ ] QR code for equipment tracking
- [ ] Barcode scanning
- [ ] File attachments for maintenance requests
- [ ] Email notifications for overdue maintenance
- [ ] Integration with IoT sensors
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Advanced search and filters
- [ ] Mobile responsive improvements
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

---

<div align="center">

**Built with ❤️ using Django, React, and modern web technologies**

[⬆ Back to Top](#️-gearguard---ultimate-maintenance-tracking-system)

</div>
