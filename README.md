# 🔁 Break the Loop

A team-based debugging competition platform built for college events. Teams of 3 debug buggy code snippets, unlock a shared key, and submit a final solution — all through a sleek, real-time web interface.

---

## ✨ Features

- **20 Teams**, 3 members each, assigned across 4 problem sets (A–D)
- **Round 1** — Each member debugs a unique code snippet in C, Java, or Python using an in-browser Monaco editor
- **Key Unlock** — After all members submit, the team enters a 6-digit key to unlock Round 2
- **Round 2** — Teams collaboratively submit a written solution to a common problem statement
- **Live Status** — Pages auto-refresh with polling to show real-time team progress
- **Sandboxed Execution** — Code runs inside a Docker-based [Piston](https://github.com/engineer-man/piston) container

---

## 🛠 Tech Stack

| Layer          | Technology                                                           |
| -------------- | -------------------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org/) (App Router, Turbopack)            |
| UI             | [React 19](https://react.dev/)                                       |
| Code Editor    | [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) |
| Database       | [Prisma](https://www.prisma.io/) + SQLite                            |
| Code Execution | [Piston](https://github.com/engineer-man/piston) (Docker)            |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS             |
| Language       | TypeScript 5                                                         |

---

## 📋 Prerequisites

| Requirement                                                       | Minimum Version    |
| ----------------------------------------------------------------- | ------------------ |
| [Node.js](https://nodejs.org/)                                    | v18+               |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Any recent version |
| [Git](https://git-scm.com/)                                       | v2.30+             |

> **Note:** This guide assumes **Windows 11** as the host OS. Commands use PowerShell syntax.

---

## 🚀 Setup Guide

### 1. Clone the Repository

```powershell
git clone https://github.com/GDGVITM/women-centric-contest.git
cd women-centric-contest
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Environment Variables

```powershell
Copy-Item .env.example .env
```

The defaults in `.env.example` work out of the box for local development. No changes needed unless you're using a custom Piston port.

### 4. Set Up the Code Execution Engine (Piston)

Piston is a Docker-based sandboxed code execution engine. It runs student code safely in isolated containers.

#### a. Start Docker Desktop

Make sure Docker Desktop is running on your machine.

#### b. Pull and Run the Piston Container

```powershell
docker run -d --name piston -p 2000:2000 --privileged -v piston-data:/piston ghcr.io/engineer-man/piston
```

> **Important:** The `-v piston-data:/piston` volume mount is required on Windows to avoid a known `/piston` directory issue.

#### c. Wait for Piston to Initialize (~15 seconds)

Verify it's running:

```powershell
docker logs piston --tail 5
```

You should see: `API server started on 0.0.0.0:2000`

#### d. Install Language Runtimes

Piston ships with no languages pre-installed. Install the three required runtimes:

**Python:**

```powershell
$body = '{"language":"python","version":"3.10.0"}'
Invoke-RestMethod -Uri "http://localhost:2000/api/v2/packages" -Method POST -Body $body -ContentType "application/json"
```

**C (GCC):**

```powershell
$body = '{"language":"gcc","version":"10.2.0"}'
Invoke-RestMethod -Uri "http://localhost:2000/api/v2/packages" -Method POST -Body $body -ContentType "application/json"
```

**Java:**

```powershell
$body = '{"language":"java","version":"15.0.2"}'
Invoke-RestMethod -Uri "http://localhost:2000/api/v2/packages" -Method POST -Body $body -ContentType "application/json"
```

> Each install may take 1–5 minutes depending on your internet speed. Wait for each to complete before proceeding.

#### e. Verify Installed Runtimes

```powershell
Invoke-RestMethod -Uri "http://localhost:2000/api/v2/runtimes" | Format-Table language, version
```

You should see `c`, `java`, and `python` in the output.

### 5. Set Up the Database

#### a. Generate the Prisma Client

```powershell
npx prisma generate
```

#### b. Sync the Database Schema

```powershell
npx prisma db push
```

#### c. Seed the Database

This creates 4 problem sets, 36 buggy code snippets, and 20 teams with 3 member slots each:

```powershell
npx prisma db seed
```

### 6. Start the Development Server

```powershell
npm run dev
```

The app will be available at **http://localhost:3000**

---

## 🖥 Event Day — Network Access

For contestants to access the app from their devices over the college LAN:

1. Find the host PC's local IP address:

   ```powershell
   ipconfig
   ```

   Look for the **IPv4 Address** under your active network adapter (e.g., `192.168.1.100`)

2. Contestants navigate to `http://<host-ip>:3000` on their browsers

3. Ensure the host PC's firewall allows inbound connections on port **3000** and **2000**

---

## 🔄 Restarting After a Reboot

If the host PC restarts, run these commands to get back up:

```powershell
# 1. Start Docker Desktop (if not set to auto-start)

# 2. Restart the Piston container
docker start piston

# 3. Start the dev server
cd women-centric-contest
npm run dev
```

> The Piston container retains installed runtimes across restarts thanks to the `piston-data` volume.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Landing — team code entry
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Design system
│   ├── api/
│   │   ├── compile/route.ts          # Code execution via Piston
│   │   ├── snippets/route.ts         # Fetch buggy code snippets
│   │   ├── submit/route.ts           # Submit member output
│   │   └── teams/                    # Team management endpoints
│   └── team/[code]/
│       ├── page.tsx                  # Member slot selection
│       ├── member/[id]/page.tsx      # Monaco code editor
│       ├── unlock/page.tsx           # 6-digit key entry
│       ├── round2/page.tsx           # Problem statement
│       ├── round2/submit/page.tsx    # Final submission form
│       └── complete/page.tsx         # Success confirmation
├── lib/
│   └── prisma.ts                     # Prisma client singleton
prisma/
├── schema.prisma                     # Database schema
├── seed.ts                           # Seed data
└── dev.db                            # SQLite database
```

---

## 🧹 Resetting the Database

To clear all team progress and start fresh (e.g., between dry runs):

```powershell
npx prisma db push --force-reset
npx prisma db seed
```

---

## 🔧 Troubleshooting

| Issue                                            | Solution                                                                                    |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `Compiler service unavailable`                   | Ensure Docker Desktop is running and the Piston container is started: `docker start piston` |
| `Unable to connect to remote server`             | Piston takes ~15s to initialize after starting. Wait and retry.                             |
| `run_timeout cannot exceed the configured limit` | Timeout values in `compile/route.ts` must not exceed Piston's default limit of 3000ms       |
| Member slot shows "Slot Taken" unexpectedly      | Reset the database using the commands above                                                 |
| `localhost` connection refused in Node.js        | Use `127.0.0.1` instead of `localhost` in `.env` (IPv4/IPv6 mismatch on Windows)            |

---

## 📄 License

This project is maintained by **GDG on Campus VIT-M**.

---

## 🛠️ Configuration & Admin (Event Day Setup)

### 1. JSON Configuration

## 🏁 Organizer Setup Guide (Event Day)

### 1. Hybrid Deployment Strategy

The contest runs in a **Hybrid Mode** to save costs and ensure security:

- **Frontend & API (Vercel)**: Hosts the UI and game logic. Accessible to all students via a public URL.
- **Code Execution Engine (Local Piston)**: Runs on the **Organizer's Laptop** (or a cloud VM) and is exposed via a secure tunnel (ngrok).

### 2. Setting up the Execution Engine (Organizer's Laptop)

1. **Install Docker**: Download Docker Desktop.
2. **Run Piston**:
   ```bash
   docker run -d -p 2000:2000 --name piston ghcr.io/engineer-man/piston
   ```
3. **Expose with Ngrok**:
   ```bash
   ngrok http 2000
   ```
4. **Copy the URL**: You will get a URL like `https://fd7a-123-456.ngrok-free.app`.

### 3. Deploying the Frontend (Vercel)

1. Push this code to GitHub.
2. Import the repo in Vercel.
3. **Environment Variables**:
   - `PISTON_API_URL`: `https://your-ngrok-url.ngrok-free.app/api/v2/execute` (The URL from Step 2)
   - `ADMIN_SECRET`: `your_secure_password`
   - `DATABASE_URL`: Your Postgres connection string.
4. Redeploy.

### 4. Game Management

- **Dashboard**: Go to `/admin/login` (Link in landing page footer).
- **Reset Teams**: If a team messes up or needs a restart, use the **Reset** button.
- **Live Stats**: Monitor the dashboard to see solving progress.

### 5. Config Changes (Hot-swapping)

To change questions or keys during the event without redeploying logic:

1. Update `src/config/problems.json` or `keys.json`.
2. Commit and Push to GitHub.
3. Vercel will auto-redeploy in ~30 seconds.

The contest data is decoupled from the database for easy hot-swapping. Edit files in `src/config/`:

- **`teams.json`**: List of valid Team Codes and their Set assignment (A/B/C/D).
  ```json
  [{ "teamCode": "T01", "name": "Team One", "members": 3, "set": "A" }]
  ```
- **`keys.json`**: Unlock keys for each Set (Round 1 -> Round 2).
  ```json
  { "A": "482917", "B": "735261" }
  ```
- **`problems.json`**: Buggy code snippets organized by `Set -> Member -> Language`.
  ```json
  {
    "A": {
      "1": { "python": "...", "c": "..." }
    }
  ```

> **Note**: Changes to these files reflect immediately (on next request) without restarting the server.

### 2. Admin Dashboard

Monitor team progress and submissions at `/admin`.

- **Login**: `/admin/login`
- **Password**: Set in `.env` as `ADMIN_SECRET`. Default: `gdgvitm_admin_secure_2024`.

### 3. Quick Setup

1.  Ensure `.env` has `DATABASE_URL` and `ADMIN_SECRET`.
2.  Run `npx prisma generate` and `npx prisma db push` to sync schema.
3.  Start server: `npm run dev` (or build for production).
