# 🛠️ GearGuard - Ultimate Maintenance Tracking System

<div align="center">

![GearGuard](https://img.shields.io/badge/GearGuard-Maintenance%20Tracker-blue)
![Django](https://img.shields.io/badge/Django-5.2.4-green)
![DRF](https://img.shields.io/badge/DRF-3.14+-orange)
![React](https://img.shields.io/badge/React-Latest-61dafb)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A comprehensive enterprise-grade maintenance tracking and management system built with Django REST Framework and React**

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

The system supports multi-company operations, preventive maintenance scheduling, vendor management, and detailed maintenance history tracking with powerful analytics.

---

## ✨ Features

### 🔐 Authentication & User Management
- ✅ User registration with email validation
- ✅ Secure login with token-based authentication
- ✅ Password change (authenticated users)
- ✅ Forgot password & password reset via email
- ✅ User profile management with statistics
- ✅ Maintenance history tracking per user
- ✅ Role-based access control

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
- **Framework:** Django 5.2.4
- **API:** Django REST Framework 3.14+
- **Authentication:** Token-based (DRF AuthToken)
- **Database:** SQLite (Development) / PostgreSQL (Production)
- **Task Queue:** Celery 5.3+
- **Scheduler:** Celery Beat with django-celery-beat
- **Message Broker:** Redis 5.0+
- **CORS:** django-cors-headers
- **Filtering:** django-filter
- **Image Processing:** Pillow

### Frontend
- **Framework:** React
- **Build Tool:** Vite
- **Styling:** CSS (custom)
- **HTTP Client:** Fetch API

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
│   │   └── wsgi.py             # WSGI entry point
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
│   │
│   ├── test_auth_api.py        # Authentication tests
│   ├── test_password_reset.py  # Password reset tests
│   │
│   ├── AUTHENTICATION_API.md   # Complete API documentation
│   ├── PASSWORD_RESET_GUIDE.md # Password reset guide
│   ├── CHANGES_SUMMARY.md      # Change log
│   └── README_AUTH.md          # Quick auth guide
│
├── Frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── assets/             # Static assets
│   │   ├── styles/             # CSS styles
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   │
│   ├── public/                 # Public assets
│   ├── package.json            # Node dependencies
│   ├── vite.config.js          # Vite configuration
│   └── README.md               # Frontend docs
│
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 🔧 Installation

### Prerequisites

- **Python:** 3.12.0 or higher
- **Node.js:** 16.x or higher (for frontend)
- **Redis:** 5.0+ (optional, for Celery)
- **Git:** For version control

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

### Optional: Celery Setup (for background tasks)

1. **Install and start Redis:**
   ```bash
   # Windows (using Chocolatey)
   choco install redis-64

   # Linux
   sudo apt-get install redis-server
   sudo systemctl start redis

   # Mac
   brew install redis
   brew services start redis
   ```

2. **Start Celery worker:**
   ```bash
   cd Backend
   celery -A gearguard worker -l info
   ```

3. **Start Celery beat (scheduler):**
   ```bash
   celery -A gearguard beat -l info
   ```

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

Create `.env` file in Backend directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379/0
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
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

### Resource Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/companies/` | GET, POST, PUT, DELETE | Company management |
| `/vendors/` | GET, POST, PUT, DELETE | Vendor management |
| `/departments/` | GET, POST, PUT, DELETE | Department management |
| `/employees/` | GET, POST, PUT, DELETE | Employee management |
| `/workcenters/` | GET, POST, PUT, DELETE | Work center management |
| `/teams/` | GET, POST, PUT, DELETE | Maintenance team management |
| `/categories/` | GET, POST, PUT, DELETE | Equipment category management |
| `/equipment/` | GET, POST, PUT, DELETE | Equipment management |
| `/requests/` | GET, POST, PUT, DELETE | Maintenance request management |
| `/scheduled/` | GET, POST, PUT, DELETE | Scheduled maintenance |
| `/dashboard/` | GET | Dashboard statistics |
| `/calendar/` | GET | Calendar events |

### Authentication Header
```
Authorization: Token <your-token-here>
```

### Complete API Documentation

See detailed documentation:
- **[AUTHENTICATION_API.md](Backend/AUTHENTICATION_API.md)** - Complete authentication API reference
- **[PASSWORD_RESET_GUIDE.md](Backend/PASSWORD_RESET_GUIDE.md)** - Password reset implementation guide
- **[README_AUTH.md](Backend/README_AUTH.md)** - Quick authentication guide

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
python manage.py test
```

#### Test Authentication API
```bash
python test_auth_api.py
```

#### Test Password Reset
```bash
python test_password_reset.py
```

#### Manual API Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123!","password2":"TestPass123!"}'
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

### Test Coverage

The project includes comprehensive tests for:
- ✅ User authentication (registration, login, logout)
- ✅ Password management (change, forgot, reset)
- ✅ Profile management
- ✅ Token validation
- ✅ Error handling
- ✅ Security features

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

### Upcoming Features
- [ ] Real-time notifications with WebSockets
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Export data to Excel/PDF
- [ ] QR code for equipment tracking
- [ ] Barcode scanning
- [ ] Integration with IoT sensors
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced search and filters

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

---

<div align="center">

**Built with ❤️ using Django, React, and modern web technologies**

[⬆ Back to Top](#️-gearguard---ultimate-maintenance-tracking-system)

</div>
