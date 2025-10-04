# Role-Based Authentication Guide

## Overview

ResumeRAG now features a complete role-based authentication system with separate login pages and dashboards for **Recruiters** and **Job Seekers**.

---

## 🚀 Quick Start

### Access the Application

1. **Start the Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Open Browser:**
   - Default URL: `http://localhost:3000`
   - You'll be redirected to the Recruiter Login page

---

## 📋 Login Pages

### Recruiter Login
- **URL:** `/login/recruiter`
- **Demo Credentials:**
  - Email: `demo@recruiter.com`
  - Password: `password`

### Job Seeker Login
- **URL:** `/login/candidate`
- **Demo Credentials:**
  - Email: `demo@candidate.com`
  - Password: `password`

You can switch between login pages using the link at the bottom of each login form.

---

## 🎯 Recruiter Dashboard Features

**URL:** `/dashboard/recruiter`

The recruiter dashboard provides access to all recruitment tools:

1. **📄 Smart Resume Parsing**
   - Upload PDF/DOCX resumes
   - Extract structured data with AI

2. **🔍 RAG-based Semantic Search**
   - Natural language job description queries
   - Find best-matching candidates

3. **🎯 Job Match Recommendation**
   - AI-powered candidate recommendations
   - Match scoring and ranking

4. **✨ AI Summary Generation**
   - Generate professional candidate summaries
   - Job-specific tailored summaries

5. **📊 ATS & Keyword Helper**
   - Resume-job match analysis
   - ATS score calculation
   - Keyword optimization

6. **📈 Interactive Dashboard**
   - Recruitment analytics
   - Top skills analysis
   - Submission trends

7. **💬 RAG Chatbot**
   - AI assistant for recruitment queries
   - Candidate insights

---

## 👤 Job Seeker Dashboard Features

**URL:** `/dashboard/candidate`

The job seeker dashboard focuses on career development tools:

1. **📊 ATS Optimization Helper**
   - Optimize resume for Applicant Tracking Systems
   - Keyword matching with job descriptions
   - Get higher match scores

2. **✨ AI Resume Summary**
   - Generate professional summaries
   - Create tailored cover letters
   - Job-specific content generation

3. **💬 Career Coach Chatbot**
   - Career advice and guidance
   - Resume improvement tips
   - Interview preparation help

---

## 🏗️ Architecture

### File Structure

```
frontend/src/
├── context/
│   └── AuthContext.js          # Authentication state management
├── pages/
│   ├── Login.jsx               # Universal login page (role-based)
│   ├── RecruiterDashboard.jsx  # Recruiter feature dashboard
│   └── CandidateDashboard.jsx  # Job seeker feature dashboard
├── components/
│   ├── Navigation.jsx          # Role-aware navigation bar
│   ├── ProtectedRoute.jsx      # Route protection wrapper
│   └── [existing components]   # All feature components
└── styles/
    ├── auth.css               # Login page styles
    └── dashboard.css          # Dashboard styles
```

### Key Components

#### AuthContext
- Manages user authentication state
- Provides login/logout functions
- Stores user data in localStorage for persistence
- Exposes role-based flags (`isRecruiter`, `isCandidate`)

#### ProtectedRoute
- Wraps dashboard routes
- Redirects unauthenticated users to login
- Validates user role matches required role
- Renders Navigation component

#### Navigation
- Displays user info and role badge
- Logout functionality
- Responsive design

---

## 🔐 Authentication Flow

```
1. User visits app → Redirected to /login/recruiter
2. User enters credentials → AuthContext.login()
3. User data stored in state + localStorage
4. Redirect to /dashboard/{role}
5. ProtectedRoute validates authentication
6. Dashboard renders with role-specific features
7. User clicks feature card → Component loads
8. User clicks "Back" → Returns to dashboard
9. User clicks "Logout" → Clear state → Redirect to login
```

---

## 🎨 Design Features

### Login Pages
- Modern gradient background
- Clean, professional card design
- Role-specific messaging
- Demo credentials display
- Easy role switching
- Smooth animations

### Dashboards
- Card-based feature grid
- Responsive layout
- Feature icons and descriptions
- One-click feature access
- Back navigation
- Role badge display

### Navigation
- User avatar with initials
- Role indicator badge
- User email display
- Logout button with icon
- Sticky positioning

---

## 🔄 Routing

| Route | Access | Redirects To |
|-------|--------|--------------|
| `/` | Public | `/login/recruiter` |
| `/login/recruiter` | Public | Dashboard on login |
| `/login/candidate` | Public | Dashboard on login |
| `/dashboard/recruiter` | Recruiter only | Login if not authenticated |
| `/dashboard/candidate` | Candidate only | Login if not authenticated |
| `*` (404) | Public | `/login/recruiter` |

---

## 🛠️ Customization

### Adding a New Feature

**For Recruiters:**

1. Create your feature component in `src/components/`
2. Add feature object to `RecruiterDashboard.jsx`:

```javascript
{
  id: 'your-feature',
  title: 'Your Feature Name',
  description: 'Feature description',
  icon: '🎨',
  component: YourFeatureComponent
}
```

**For Job Seekers:**

Follow the same pattern in `CandidateDashboard.jsx`

### Changing Authentication

Replace the mock authentication in `AuthContext.js` with real API calls:

```javascript
const login = async (email, password, role) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
    role
  });
  
  const userData = response.data;
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
  return userData;
};
```

---

## 🎯 Demo Usage

### Testing Recruiter Flow

1. Go to `http://localhost:3000/login/recruiter`
2. Enter: `demo@recruiter.com` / `password`
3. Click "Smart Resume Parsing"
4. Upload a resume
5. Click "Back to Dashboard"
6. Try other features
7. Click "Logout"

### Testing Candidate Flow

1. Go to `http://localhost:3000/login/candidate`
2. Enter: `demo@candidate.com` / `password`
3. Click "ATS Optimization Helper"
4. Test keyword analysis
5. Return to dashboard
6. Try Career Coach Chatbot

---

## 📱 Responsive Design

- **Desktop:** Full feature grid with 3 columns
- **Tablet:** 2-column layout
- **Mobile:** Single column, stacked navigation

---

## 🔧 Troubleshooting

### Can't log in
- Check browser console for errors
- Verify backend is running on port 5000
- Any email/password works in demo mode

### Features not loading
- Ensure all components are properly imported
- Check browser console for errors
- Verify component files exist

### Styling issues
- Import order: `auth.css` and `dashboard.css` should be imported in components
- Clear browser cache
- Check for CSS conflicts

---

## 🚀 Production Deployment

Before deploying:

1. **Replace Mock Auth** with real backend authentication
2. **Add JWT tokens** for secure API calls
3. **Implement proper password** hashing
4. **Add email verification**
5. **Set up HTTPS**
6. **Configure CORS** properly
7. **Add rate limiting** to login endpoints

---

## 📄 License

Part of ResumeRAG - AI-Powered Resume Intelligence Platform
