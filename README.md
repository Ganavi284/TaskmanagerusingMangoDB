# Task Manager

Small CRUD app for tracking tasks with status updates. Backend runs on Node/Express with MongoDB, frontend is plain HTML/CSS/JS served from `public/`.

## Features
- Create, edit, delete tasks with optional descriptions
- Status workflow: Pending → In Progress → Completed
- Inline editing modal and optimistic status changes
- Server-side validation with clear error messages
- Simple, responsive UI with toast-style notifications

## Tech Stack
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: Vanilla HTML, CSS, JavaScript

## Prerequisites
- Node.js 18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017/taskDB` by default)

## Getting Started
```bash
npm install
npm start
```
Then open `http://localhost:3000`.

To use a different Mongo connection string, edit `mongoose.connect` in `server.js`.

## API Quick Reference
- `GET /tasks` — list tasks (sorted newest first)
- `GET /tasks/:id` — fetch a task
- `POST /tasks` — create `{ title, description? }`
- `PUT /tasks/:id` — update `{ title?, description?, status? }`
- `DELETE /tasks/:id` — remove a task

Responses are JSON; validation errors return HTTP 400 with a `message`.

## Project Structure
- `server.js` — Express server and routes
- `models/Task.js` — Mongoose schema/model
- `public/` — static frontend (`index.html`, `script.js`, `style.css`)
- `package.json` — scripts and dependencies

## Scripts
- `npm start` — start the server on port 3000

