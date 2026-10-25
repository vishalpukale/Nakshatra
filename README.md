# Nakshatra

Public site and backoffice for The Star of India. Visitors register for events and send queries. Admins manage events, gallery, states, home text, registrations, and queries.

## Run it on your computer

1. Create a Postgres database named `nakshatra`.
2. Import the database file:

```bash
psql -d nakshatra -f backend/registration-service/db/nakshatra.sql
```

3. Copy `backend/registration-service/.env.example` to `backend/registration-service/.env` and fill in the database password, `SECRET_JWT`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
4. Start the API:

```bash
cd backend/registration-service
npm install
npm start
```

5. Start the website:

```bash
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173. The admin login is http://127.0.0.1:5173/admin/login. The first time the API starts, it creates the admin from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Host it for free

Use three free services. The database does not expire. The API sleeps after 15 minutes of no visitors and takes about a minute to wake up.

### 1. Database on Neon

1. Create a free account at https://neon.tech.
2. Create a project named Nakshatra.
3. Open the SQL Editor.
4. Paste the full contents of `backend/registration-service/db/nakshatra.sql` and run it.
5. Copy the connection string. It looks like `postgresql://...neon.tech/neondb?sslmode=require`.

### 2. API on Render

1. Create a free account at https://render.com and connect the GitHub account that owns this repo.
2. Choose **New** → **Web Service** and select `vishalpukale/Nakshatra`.
3. Use these settings:
   - Root Directory: `backend/registration-service`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance type: **Free**
4. Add these environment variables:
   - `DATABASE_URL` = the Neon connection string
   - `SECRET_JWT` = a long random string
   - `ADMIN_EMAIL` = the email you will use to sign in
   - `ADMIN_PASSWORD` = a password of at least 8 characters
5. Deploy. When the log says the service is running, open the Render URL. It should show `OK`.
6. Copy that URL, for example `https://nakshatra-api.onrender.com`.

### 3. Website on Vercel

1. Create a free account at https://vercel.com and import `vishalpukale/Nakshatra`.
2. Set the root directory to `frontend`.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Add one environment variable before the first deploy:
   - `VITE_API_BASE_URL` = the Render URL, with no slash at the end
5. Deploy. Vercel gives you the public site address.

Sign in at `https://your-site.vercel.app/admin/login` with the admin email and password from Render.

Uploaded audition videos and gallery files are stored on the API server's disk. On Render's free plan that disk is cleared when the service restarts, so use a normal image web address for gallery pictures.
