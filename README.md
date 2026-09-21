# JobPortal
Job Portal


# HireHub - MERN Job Portal

HireHub is a full-stack job portal built using the MERN stack.

It allows job seekers to find and apply for jobs, while recruiters can create jobs, manage their postings, view applicants, and update application statuses.

## Main Features

### Job Seekers
- User registration and login
- Browse, search, filter, and sort jobs
- Save/bookmark jobs
- Upload resume
- Apply for jobs with cover letter
- Track application status

### Recruiters
- Recruiter dashboard
- Create, edit, and delete jobs
- View job statistics
- View applicants
- View applicant resume and skills
- Update application status
- View recent applications

###  Authentication & Security
- JWT authentication
- Access & refresh tokens
- HttpOnly cookies
- Refresh token rotation
- Role-based authorization
- Protected routes
- Backend ownership validation

## 🛠️ Tech Stack

**Frontend**
- React.js
- React Router
- Context API
- Axios
- Tailwind CSS
- Vite

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary

##  Project Structure

```text
HireHub/
├── frontend/
└── backend/



⚙️ Installation
Clone the repository
  git clone https://github.com/YOUR_USERNAME/hirehub.git
  cd hirehub
Backend Setup
  cd backend
  npm install


Create a .env file inside backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

CLIENT_URL=http://localhost:5173

NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Start the backend:
  npm run dev

Frontend Setup
Open a new terminal:
cd frontend
  npm install
  npm run dev

The frontend will run on:
  http://localhost:5173

The backend will run on:

http://localhost:5000
