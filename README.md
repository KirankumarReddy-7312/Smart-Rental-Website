# Rentora - Smart Rental Finder for Bangalore

A modern full-stack real estate web application that helps users find rental houses in Bangalore based on their budget, house type, amenities, and preferences.

## 🏠 Features

### ✅ Completed Features
- **Django Backend** with REST API
- **MySQL Database** with comprehensive property models
- **CSV Data Import** for 8 Bangalore locations
- **Next.js Frontend** with TypeScript
- **Animated Splash Screen** with logo and effects
- **Hero Section** with gradient backgrounds
- **Smart Sticky Search Bar** with all filters
- **Modern Property Cards** with hover animations
- **Featured Properties** section
- **Featured Locations** section
- **How It Works** section
- **Glassmorphism Design** elements
- **Framer Motion Animations**
- **Responsive Design** foundation
- **Tailwind CSS** styling

### 🚧 In Progress
- Property details page with interactive map
- User authentication system
- Budget slider filter
- Locations page with statistics
- About and Contact pages

## 📁 Project Structure

```
Smart Rental/
├── backend/                 # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── rentora/            # Django project settings
│   ├── properties/         # Property management app
│   ├── users/             # User management app
│   └── data/              # CSV files with property data
└── frontend/               # Next.js React application
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── src/
        ├── app/            # Next.js app router
        ├── components/     # React components
        └── ...
```

## 🛠 Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework** - API development
- **MySQL** - Database
- **Pandas** - CSV data processing
- **django-cors-headers** - CORS handling

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Heroicons** - Icons
- **React Hot Toast** - Notifications

## 📊 Database Schema

### Properties Table
- property_id, type, activation_date
- bathroom, floor, total_floor, furnishing
- gym, latitude, longitude, lease_type
- lift, locality, parking, property_age
- property_size, swimming_pool, pin_code
- rent, deposit, building_type

### Locations Table
- name, created_at

### Users & Saved Properties
- User profiles and saved property functionality

## 🏢 Bangalore Locations

The system includes property data for:
1. **Whitefield**
2. **Bellandur**
3. **Varthur**
4. **Kaggadasapura**
5. **K.R Puram**
6. **Electronic City**
7. **Brookefield**
8. **Yelahanka**

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Set up MySQL database**
```sql
CREATE DATABASE rentora_db;
```

6. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Import CSV data**
```bash
python manage.py import_csv
```

8. **Create superuser**
```bash
python manage.py createsuperuser
```

9. **Start Django server**
```bash
python manage.py runserver
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

## 📡 API Endpoints

### Properties
- `GET /api/properties/` - List all properties
- `GET /api/properties/featured/` - Get featured properties
- `GET /api/properties/statistics/` - Get property statistics
- `POST /api/properties/{id}/save/` - Save a property
- `DELETE /api/properties/{id}/unsave/` - Unsave a property

### Locations
- `GET /api/properties/locations/` - List all locations
- `GET /api/properties/locations/{id}/` - Location details
- `GET /api/properties/locations/{id}/properties/` - Properties by location
- `GET /api/properties/locations/{id}/statistics/` - Location statistics

### Users
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - User profile
- `PATCH /api/auth/profile/` - Update profile
- `GET /api/auth/dashboard/` - User dashboard

## 🎨 Design Features

### UI/UX
- **Glassmorphism** effects for modern look
- **Gradient backgrounds** with animations
- **Smooth transitions** and micro-interactions
- **Responsive design** for all devices
- **Loading skeletons** for better UX
- **Card hover effects** with transformations

### Animations
- **Splash screen** with floating elements
- **Hero section** with gradient animations
- **Property cards** with hover effects
- **Search bar** sticky behavior
- **Page transitions** with Framer Motion

## 🔧 Development Notes

### CSV Data Structure
Each CSV file contains:
- property_id, type, activation_date, bathroom
- floor, total_floor, furnishing, gym
- latitude, longitude, lease_type, lift
- locality, parking, property_age
- property_size, swimming_pool, pin_code
- rent, deposit, building_type

### Search Filters
- **Location**: Dropdown with 8 Bangalore areas
- **Budget**: Max rent input
- **House Type**: Apartment, Independent House, Independent Floor
- **Bathrooms**: 1, 2, 3, 4+
- **Furnishing**: Furnished, Semi-Furnished, Unfurnished
- **Amenities**: Gym, Parking, Lift, Swimming Pool

## 🚀 Deployment

### Backend (Django)
```bash
# Production settings
DEBUG=False
ALLOWED_HOSTS=['yourdomain.com']
```

### Frontend (Next.js)
```bash
npm run build
npm start
```

## 📝 TODO

- [ ] Property details page with map integration
- [ ] User authentication flows
- [ ] Budget slider component
- [ ] Advanced filtering
- [ ] Image upload functionality
- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Payment integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any queries or support, please reach out to:
- Email: info@rentora.com
- Phone: +91 80 1234 5678

---

**Rentora** - Making house hunting in Bangalore simple and transparent! 🏠✨
