# GitHub Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `student-management-system` (or any name you prefer)
   - **Description**: "Full-stack MERN Student Management System with Authentication, CRUD, Teacher Management, Courses, Attendance, and Exam Management"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/student-management-system.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/student-management-system.git
git branch -M main
git push -u origin main
```

## What's Included in This Repository

✅ Complete MERN stack application
✅ Authentication system (JWT)
✅ Student CRUD operations
✅ Teacher Management
✅ Course Management
✅ Attendance Tracking
✅ Exam & Marks Management
✅ Student Profile with courses and teachers
✅ Responsive UI with Tailwind CSS
✅ MongoDB database schemas

## Important Notes

- **DO NOT** commit sensitive data like:
  - MongoDB connection strings with passwords
  - JWT secrets
  - API keys
  - Environment variables with secrets

- The `.gitignore` file is already set up to exclude:
  - `node_modules/`
  - `.env` files
  - Build outputs
  - Log files

## After Pushing

Your repository will be live on GitHub and you can:
- Share it with others
- Clone it on other machines
- Collaborate with team members
- Deploy it to hosting platforms

