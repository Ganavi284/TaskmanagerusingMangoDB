# Task Manager

Small full-stack CRUD app for tracking tasks with status updates. Backend runs on Node/Express with MongoDB; frontend is plain HTML/CSS/JS served from `public/`.

## Features
- Create, edit (modal), delete tasks with optional descriptions
- Status workflow: Pending → In Progress → Completed
- Server-side validation with friendly error messages
- Toast-style notifications and loading/empty states
- Sorted newest-first and escape-protected content rendering

## Tech Stack
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: Vanilla HTML, CSS, JavaScript

## Prerequisites
- Node.js 18+ and npm
- MongoDB running locally (default URI `mongodb://127.0.0.1:27017/taskDB`)

## Setup & Run
```bash
npm install
npm start
```
Visit `http://localhost:3000`.

### Configuration
MongoDB connection lives in `server.js`:
```js
mongoose.connect("mongodb://127.0.0.1:27017/taskDB");
```
Edit that string to point at another Mongo instance/DB. No other env vars are required.

## API Quick Reference
- `GET /tasks` — list tasks (newest first)
- `GET /tasks/:id` — fetch one
- `POST /tasks` — create `{ title, description? }`
- `PUT /tasks/:id` — update `{ title?, description?, status? }`
- `DELETE /tasks/:id` — delete one

Responses are JSON. Validation errors return HTTP 400 with a `message`.

### Status values
`Pending` (default) | `In Progress` | `Completed`

### Example cURL
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write README","description":"Add proper docs"}'
```

## Project Structure
- `server.js` — Express server and routes
- `models/Task.js` — Mongoose schema/model (with validation)
- `public/index.html` — UI markup
- `public/script.js` — client-side logic & fetch calls
- `public/style.css` — styling
- `package.json` — scripts and dependencies

## Scripts
- `npm start` — start the server on port 3000

## Troubleshooting
- Mongo not running: ensure the `mongod` service is up or update the URI.
- Port in use: stop the conflicting process or set `PORT` before starting (`PORT=4000 node server.js` would require adjusting the start script).
