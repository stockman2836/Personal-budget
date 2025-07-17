# Personal Budget – FastAPI + React

A simple full-stack application for tracking income and expenses.

* Backend: **FastAPI**, SQLite, SQLAlchemy
* Frontend: **React 18 (Vite)**, Bootstrap 5, Chart.js

---

## 1. Prerequisites
* **Python 3.10+** – https://python.org  (check `python --version`)
* **Node.js 18+**   – https://nodejs.org   (check `node --version`)
* Git (optional, if you cloned the repo)

All commands are shown for **Windows PowerShell** but work the same on macOS/Linux (change path separators).

---

## 2. Backend Setup
```powershell
# Go to project root
cd "C:\path\to\Personal budget"

# Create & activate virtual env (only once)
python -m venv venv
.\venv\Scripts\Activate      # macOS/Linux: source venv/bin/activate

# Install Python dependencies
pip install -r backend\requirements.txt

# Run FastAPI server (auto-reload)
uvicorn backend.main:app --reload
```
Server runs at **http://127.0.0.1:8000**.  
Interactive docs: **/docs**  →  http://127.0.0.1:8000/docs

### CORS
`backend/main.py` already enables CORS for `http://localhost:5173`.
If your frontend runs elsewhere, add the origin to `allow_origins`.

---

## 3. Frontend Setup
```powershell
# Open new terminal
cd "C:\path\to\Personal budget\frontend"

# Install npm packages (first time only)
npm install

# Start Vite dev server
npm run dev
```
The app opens at **http://localhost:5173** with hot-reload.

If the backend uses a different host/port, change `API_URL` at the top of
`frontend/src/App.jsx`.

---

## 4. Build for Production
Frontend:
```powershell
cd frontend
npm run build   # creates dist/
```
Serve `frontend/dist` with any static server (Nginx, Netlify, GitHub Pages, …).

Backend:
```
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
Use a production ASGI server such as **gunicorn**/**uvicorn** behind Nginx.

---

## 5. Troubleshooting
* **`ERR_CONNECTION_REFUSED`** – backend isn’t running on the configured host/port.
* **CORS error** – make sure origin is allowed in `backend/main.py`.
* **SQLite file** – `budget.db` is created automatically in project root.

Feel free to open issues / PRs! 🙌 