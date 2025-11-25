Docker setup for SPM-TravelMate

This repository includes Dockerfiles for the backend and frontend and a `docker-compose.yml` to run MongoDB, backend, and frontend together for local development.

Quick start (development):

1. Copy environment values into a `.env` file at the repository root (used by docker-compose):

   - `PAYPAL_MODE` (e.g. sandbox)
   - `PAYPAL_CLIENT_ID` (if used)
   - `PAYPAL_CLIENT_SECRET` (if used)

   Example `.env` (do NOT commit):

   PAYPAL_MODE=sandbox
   PAYPAL_CLIENT_ID=your-id
   PAYPAL_CLIENT_SECRET=your-secret

2. Start services with Docker Compose:

   # from repo root
   docker compose up --build

   - This builds the backend and frontend images and starts `mongo`, `backend` (port 5001) and `frontend` (port 3000).
   - The frontend runs the CRA dev server and is available at `http://localhost:3000`.
   - The backend is available at `http://localhost:5001` and connects to the `mongo` service.

3. Confirm services:

   - Backend health: `http://localhost:5001/` should return JSON.
   - Frontend: `http://localhost:3000/` for the app.

Notes and recommendations:

- Development vs Production
  - The provided `frontend/Dockerfile` runs the CRA dev server. For production you should build the frontend (`npm run build`) and serve the `build/` folder with `nginx`. I can add a production multi-stage Dockerfile on request.
  - The backend Dockerfile installs production dependencies. If you need live reload for backend changes, you can add `nodemon` and change the command in `docker-compose.yml` to `npm run dev` (note: `nodemon` is not currently a dependency).

- Environment
  - The compose file injects `MONGODB_URI=mongodb://mongo:27017/travelmate`. If you want to use an external MongoDB, update the `backend` service environment or remove the `mongo` service.

- Volumes
  - The compose file mounts the local `./backend` and `./frontend` folders into the containers for live code edits.

- Ports
  - Backend: 5001
  - Frontend: 3000
  - MongoDB: 27017

If you want, I can:
- Add a production-ready frontend Dockerfile (build + nginx) and a separate `docker-compose.prod.yml`.
- Add a `Makefile` with common commands (`build`, `up`, `down`, `logs`).
- Add `nodemon` and run the backend in dev mode inside the container (live reload).

Tell me which of the above you'd like next.