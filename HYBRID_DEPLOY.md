# 🌍 Hybrid Deployment Utilities

This guide explains how to set up the **Hybrid Deployment** architecture for the contest.

## Architecture

- **Frontend & API**: Hosted on **Render** (Publicly accessible).
- **Code Execution Engine (Piston)**: Hosted **Locally** on the Organizer's PC (Secure & Cost-effective).
- **Tunneling**: **Ngrok** connects the public Render app to your local Piston instance.

---

## 🛠️ Step 1: Run Piston Locally (Docker)

Ensure Docker Desktop is running.

```powershell
# Run Piston container (Port 2000)
docker run -d --name piston -p 2000:2000 --privileged -v piston-data:/piston ghcr.io/engineer-man/piston
```

Verify it's running:

```powershell
curl http://localhost:2000/api/v2/runtimes
```

---

## 🚇 Step 2: Expose Piston with Ngrok

1. **Install Ngrok**: [Download here](https://ngrok.com/download) if you haven't.
2. **Start Tunnel**:

```powershell
ngrok http 2000
```

3. **Copy the URL**:
   You will see a Forwarding URL like: `https://abcd-123-456.ngrok-free.app`

---

## ☁️ Step 3: Connect Render to Local Piston

1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Select your Web Service: `women-centric-contest-web`.
3. Go to **Environment** settings.
4. Update `PISTON_API_URL`:

```env
PISTON_API_URL=https://abcd-123-456.ngrok-free.app/api/v2/execute
```

_(Make sure to append `/api/v2/execute` to your Ngrok URL)_

5. **Save Changes**. Render will redeploy automatically.

---

## ✅ Step 4: Verification

1. Open your deployed App URL.
2. Go to a Member Page.
3. Run the "Hello World" code.
4. If it runs, the connection is successful!
