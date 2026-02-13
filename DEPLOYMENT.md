# 🚀 Deployment Guide

This guide covers how to deploy the **AIT Smart Campus Management System** to production.

You have two main options:

1.  **All-in-One VPS**: Host everything (Frontend + Backend + Database) on a single server using Docker.
2.  **Hybrid**: Host Backend on VPS, and Frontend on Vercel/Netlify.

---

## 🟢 Option 1: All-in-One VPS (Easiest for "One Command" Deploy)

This method runs the Frontend, Backend, Database, and Redis on a single server (e.g., DigitalOcean Droplet, AWS EC2, Hetzner) using Docker Compose.

### 1. Prerequisities

- A Linux VPS (Ubuntu 22.04 LTS recommended) with at least **2GB RAM**.
- **Docker** installed on the VPS:
  ```bash
  curl -fsSL https://get.docker.com | sh
  ```

### 2. Deployment Steps

1.  **Clone the Repository** on your VPS:

    ```bash
    git clone https://github.com/YourUsername/AIT_CMS.git
    cd AIT_CMS
    ```

2.  **Configure Environment**:
    Create a `.env` file in the root directory with your production secrets:

    ```bash
    # .env
    POSTGRES_PASSWORD=secure_db_password
    JWT_SECRET=complex_random_string
    JWT_REFRESH_SECRET=another_complex_string
    JWT_EXPIRES_IN=1d
    JWT_REFRESH_EXPIRES_IN=7d
    ```

3.  **Run Everything**:

    ```bash
    docker compose -f docker-compose.prod.yml up -d --build
    ```

    - This will build the Backend and Frontend images and start all services.

4.  **Run Database Migrations**:

    ```bash
    docker exec -it ait-cms-api npx prisma migrate deploy
    docker exec -it ait-cms-api npm run db:seed
    ```

5.  **Access the App**:
    - **Frontend**: `http://your-server-ip:8080` (Runs on Port 8080)
    - **Backend**: `http://your-server-ip:3000`

### 3. Domain & SSL (Custom Domain)

To add a domain (e.g., `ait-campus.com`) and HTTPS, install **Caddy** or use **Cloudflare Tunnels**.
**Simple Caddy Example**:

```bash
# Caddyfile
ait-campus.com {
    reverse_proxy localhost:8080
}
api.ait-campus.com {
    reverse_proxy localhost:3000
}
```

---

## 🔵 Option 2: Hybrid (Backend on VPS + Frontend on Vercel)

This is often better for performance as Vercel handles the global CDN for the frontend.

### Part A: Backend (VPS)

Follow steps 1-4 from Option 1, **BUT** modify `docker-compose.prod.yml` to remove the `web` service (frontend), or just stop it: `docker stop ait-cms-web`.

### Part B: Frontend (Vercel) - Step-by-Step

**⚠️ CRITICAL WARNING: Mixed Content Issue**
Vercel serves your site over **HTTPS**. If your Backend is on an HTTP VPS (e.g., `http://123.45.67.89:3000`), the browser will **BLOCK** requests to it.

- **Solution**: You MUST set up SSL for your backend (using a domain + Caddy/Nginx) OR deploy the backend to a platform that provides HTTPS (like Render/Railway).

**Steps:**

1.  **Push to GitHub**: Ensure your code is pushed to your remote repository.
2.  **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and log in with GitHub.
3.  **Add New Project**:
    - Click **"Add New..."** -> **"Project"**.
    - Import your repository (`Campus_Management_System`).
4.  **Configure Project Settings**:
    - **Framework Preset**: Select **Vite**.
    - **Root Directory**: Click "Edit" next to Root Directory and select `smart-campus-unified`. **(Important!)**
5.  **Environment Variables**:
    - Click **Environment Variables**.
    - Key: `VITE_API_URL`
    - Value: Your Backend URL (e.g., `https://api.yourdomain.com/api/v1` or `https://your-app.onrender.com/api/v1`).
6.  **Deploy**:
    - Click **Deploy**.
    - Wait for the build to finish. Vercel will give you a domain like `https://smart-campus-unified.vercel.app`.

---

## 🟣 Option 3: Backend on Render (Free HTTPS)

If you can't set up a domain/SSL for your VPS, use **Render** for the backend to get a free `https://...` URL.

1.  Create an account on [render.com](https://render.com).
2.  **New Web Service** -> Connect GitHub Repo.
3.  **Root Directory**: `ait-cms-backend`.
4.  **Build Command**: `npm install && npx prisma generate && npm run build`.
5.  **Start Command**: `npm run start:prod`.
6.  **Environment Variables**: Add `DATABASE_URL`, `JWT_SECRET`, etc.
7.  Deploy. You will get a URL like `https://ait-cms-backend.onrender.com`.
8.  Use _this_ URL for your Vercel `VITE_API_URL`.

---

## 🛠 Management Commands

**View Logs**:

```bash
docker compose -f docker-compose.prod.yml logs -f
```

**Update Application**:

```bash
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

**Stop Application**:

```bash
docker compose -f docker-compose.prod.yml down
```
