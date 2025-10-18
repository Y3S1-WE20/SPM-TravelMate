# Deploy Frontend to Vercel

This repository has a `frontend` folder (Create React App). Follow these steps to deploy the frontend on Vercel.

## 1) Create a Vercel account
- Go to https://vercel.com and sign up (GitHub/GitLab/Email). Connect your GitHub account.

## 2) Import Repository
- Click "New Project" → "Import Git Repository" → select `Y3S1-WE20/SPM-TravelMate`.
- Select the `frontend` folder as the root directory for the project.

## 3) Configure Build Settings
- Framework Preset: `Create React App` (Vercel usually detects automatically)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`

## 4) Add Environment Variables
You will need these variables for PayPal and other integrations. Add them in Project Settings → Environment Variables.

- Name: `REACT_APP_PAYPAL_CLIENT_ID`
  - Value: (your PayPal client ID)
  - Environment: `Production` (and also add for `Preview`/`Development` if needed)

- (Optional) `REACT_APP_API_BASE_URL` if you proxy API calls to backend hosted elsewhere
  - Example: `https://api.example.com`

> Note: Create React App only exposes environment variables starting with `REACT_APP_`.

## 5) Deploy
- Click Deploy. Vercel will build and publish a unique URL.
- For custom domains, add the domain in Vercel dashboard and update DNS settings.

## 6) Local Testing Before Deploy
- Ensure the frontend builds locally:

```powershell
cd frontend
npm ci
npm run build
# Serve build locally (optional):
npm install -g serve
serve -s build
```

## 7) Tips & Troubleshooting
- If PayPal doesn't load on Vercel, confirm the `REACT_APP_PAYPAL_CLIENT_ID` matches your PayPal environment.
- For sandbox testing, ensure your PayPal account is a sandbox business account connected to the client ID.
- If you use a backend API, either host it (e.g., Render, Heroku, Railway, Azure) and set `REACT_APP_API_BASE_URL`, or set up Vercel Serverless Functions in `/api`.
- Clear CDN cache on Vercel if old manifest or assets show errors.

## 8) Optional: Set Up GitHub Actions for Preview Deployments
- Vercel will auto-deploy on GitHub push. You can disable/enable in project settings.

If you'd like, I can also prepare a `vercel.json` (rewrites or environment based routing) or add Vercel-specific optimizations.