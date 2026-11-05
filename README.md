# Smart Exam Seating System

A browser-based application for managing exam rooms and student roll-number ranges, generating seating plans, and looking up a student's assigned seat.

## Features

- Dashboard with room, student, and capacity totals
- Admin panel for room management and student roll-number ranges
- Seating plan generation across rooms, with branch mixing where possible
- Visual room and bench layouts, including seat positions and batch lists
- Seat lookup by roll number
- Printable seating plan
- Browser-side storage for application data and sidebar preference

## Requirements

- Node.js 12 or later
- A modern web browser

The application has no npm dependencies. Tailwind CSS and the Inter font are loaded from external CDNs in `index.html`, so those styles require an internet connection.

## Run locally

From this directory, start the included static file server:

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000). Stop the server with `Ctrl+C`.

To use another port:

**PowerShell**

```powershell
$env:PORT = 8080
npm start
```

**macOS / Linux**

```bash
PORT=8080 npm start
```

The server binds to `0.0.0.0` by default, so other devices on the same network may be able to open it using the host computer's network address and port.

## Using the application

1. Open **Admin Panel** and sign in when prompted.
2. Add rooms by entering a block, room name, row and column counts, and seats per bench.
3. Add student ranges by entering branch, subject, year, roll-number prefix, and start/end numbers.
4. Choose **Generate Plan** to assign students to available seats.
5. View the plan under **Seating Plan**. Use **Seat Lookup** to search by a student's full roll number.

Room capacity is calculated from the room's benches and seats per bench. Student counts come from the inclusive start and end values in each range. Make sure the combined room capacity can accommodate the student ranges before generating a plan.

## Project structure

```text
.
├── index.html              # Application pages and UI markup
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── app.js              # Application startup and shared state
│   └── modules/
│       ├── auth.js         # Admin access and login modal
│       ├── config.js       # Shared configuration and data
│       ├── dashboard.js    # Dashboard summaries
│       ├── exams.js        # Student range management
│       ├── navigation.js   # Page navigation
│       ├── rooms.js        # Room management
│       ├── search.js       # Seat lookup
│       ├── seating.js      # Seating plan generation and display
│       └── utils.js        # Shared helpers
├── server.js               # Dependency-free Node.js static server
└── package.json            # Project metadata and npm scripts
```

## Data and security notes

Application data is stored in the browser, not in a server-side database. It belongs to the browser profile and device in use; clearing site data or changing browsers may remove or separate it.

The admin sign-in is a client-side access gate. It is suitable for a local/demo workflow, but it does not provide server-backed authentication or protect data from someone who can inspect or modify the browser application. Avoid exposing sensitive student information on an untrusted network.

## Available scripts

- `npm start` — start the local static server
- `npm run dev` — start the same server
- `npm test` — run Node.js syntax checking on `server.js`

## License

MIT (as declared in `package.json`).
