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

### Part B: Frontend (Vercel)

1.  Push your code to GitHub.
2.  Import the repo to **Vercel**.
3.  Set Root Directory to `smart-campus-unified`.
4.  Add Environment Variable: `VITE_API_URL` = `https://your-backend-api.com/api/v1`.
5.  Deploy.

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
