# AI-Powered Personalized Fitness & Diet Planner  

This project is a **Next.js** application that integrates **Supabase, Prisma ORM, and NextAuth** to provide **authentication, user management, fitness tracking, and AI-powered diet planning**.

---

## **Tech Stack**
- **Frontend**: Next.js (App Router), Tailwind CSS, ShadCN UI  
- **Backend**: Supabase (PostgreSQL), Prisma ORM  
- **Authentication**: NextAuth.js (Google, GitHub, LinkedIn, Discord, Credentials)  
- **State Management**: React Hook Form + Zod for validation  

---

## **Setup Instructions**

### **Clone the Repository**
```sh
git clone https://github.com/yourusername/project-repo.git
cd project-repo
```

### **Install Dependencies**
```sh
npm install
```

### **Set Up Environment Variables**
Create a `.env.local` file in the root directory and add the following:
```ini

# OAuth Provider Credentials (Get from Google, GitHub, LinkedIn, Discord)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

Create a `.env` file in the root directory and add the following:
```ini
DATABASE_URL="postgresql://postgres:{password}@db.laeifhkkahjbafs.supabase.co:5432/postgres"
```
> **Note:** Keep these credentials **private** and do not commit them to GitHub.

### **Set Up Supabase & Prisma**
Ensure **Supabase PostgreSQL** is correctly set up and linked to **Prisma ORM**.

#### **Run Prisma Migrations**
```sh
npx prisma generate
npx prisma migrate dev --name init
```
#### **Open Prisma Studio (Optional, for testing)**
```sh
npx prisma studio
```
This opens a **database GUI** to manage users, accounts, and sessions.

---

## **Running the Project**
### **Start the Development Server**
```sh
npm run dev
```
Your app will be available at **`http://localhost:3000`**.

---

## **Features to Test**
### **✅ Authentication**
- Sign up/login using:
  - Google, GitHub, LinkedIn, Discord
  - Email + Password (Credentials Provider)
- Check if the same email across different providers links to a single user.

### **✅ User Profile & Data Storage**
- User data should be stored in Supabase PostgreSQL.
- CRUD operations should work without errors.

### **✅ Security**
- Ensure **Row-Level Security (RLS)** prevents unauthorized access.
- **Test session persistence** across page reloads.

---

## **🛠️ Debugging & Logs**
If you face issues, check:
- **Server Logs:**  
  ```sh
  npm run dev
  ```
- **API Logs:**  
  Visit `/api/auth/session` to inspect authentication.
- **Database Logs:**  
  ```sh
  npx prisma studio
  ```

---

## **🤝 Contribution Guidelines**
1. **Fork the repository & clone it locally**.
2. **Create a new branch**:  
   ```sh
   git checkout -b feature-branch
   ```
3. **Commit changes with meaningful messages**:  
   ```sh
   git commit -m "Added XYZ feature"
   ```
4. **Push to GitHub and create a Pull Request (PR)**.

---

## **📄 License**
This project is open-source and available under the **MIT License**.

---

## **🎯 Next Steps**
- Implement AI-powered fitness and diet plan suggestions.
- Optimize database queries for performance.
- Add more test cases for edge scenarios.

---

**Happy coding!** 😃  
For any questions, reach out to the team!

