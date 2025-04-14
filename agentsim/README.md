Here’s a detailed `README.md` for your **procedural planet simulation with persistent character behaviors**, built with **seed-based generation, planet/city views, and synced simulation state**.

It focuses on flow, syncing, persistence, and view logic — so you or a collaborator can build this confidently.

---

```markdown
# 🌍 SeedSim — Procedural Planet Simulation with Agent Life

**SeedSim** is a browser-based simulation where users generate a planet from a seed and watch tiny characters live out routines in cities across the terrain. Users can zoom between planet and city views while the simulation runs in real-time. State is persisted so you can resume the world anytime.

---

## 🧠 Simulation Flow

1. **Seed Input (User Action)**
   - On first visit, user enters a seed (text or number).
   - The frontend sends the seed to the backend.
   - The backend generates a deterministic planet:
     - Terrain (heightmap, biome map)
     - Cities placed in valid regions
     - Initial agents with routines
   - The full planet state is stored (e.g., in JSON or DB).

2. **Planet View (Zoomed Out)**
   - Full map is rendered from terrain data.
   - Cities are visible as interactive nodes (dots/icons).
   - User can click a city to zoom in.
   - Frontend polls backend for updated world state (`/api/planet`).

3. **City View (Zoomed In)**
   - Displays a tile grid of buildings, roads, agents, etc.
   - Shows real-time character simulation (walk, work, commute).
   - Frontend polls `/api/city/{id}` for state, or uses cached planet data.
   - Includes “Back to Planet” button.

4. **Simulation Loop (Server Side)**
   - Every second (or frame), the backend updates:
     - Character movement
     - City-specific events
     - Transit schedules
   - Updates are written to persistent store:
     - JSON (dev), SQLite (prod), or Supabase (cloud)
   - Tick timing is consistent even across view switches.

5. **Resuming the World**
   - Re-entering the seed resumes the same planet state.
   - Simulation continues from last tick time.
   - (Optional) Load simulation to a previous point in time.

---

## ⚙️ Architecture

```
seed-sim/
├── backend/
│   ├── server.js          # Express server
│   ├── sim-loop.js        # Simulation engine (runs ticks)
│   ├── planet-gen.js      # Procedural generator (Perlin/Simplex)
│   ├── db.json            # Persistent state (replace with DB later)
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Handles seed input + global routing
│   │   ├── PlanetView.tsx # Renders map + cities
│   │   ├── CityView.tsx   # Zoomed-in city simulation
│   │   └── api.ts         # Fetches world/city data
├── shared/
│   ├── types.ts           # Shared interfaces (World, City, Agent)
├── README.md
```

---

## 🔁 Syncing Between Views

The backend holds the **source of truth** for simulation state. Frontend clients:
- Poll every 1–2 seconds OR use WebSockets to stream updates.
- Use a global `<AppContext>` to track:
  - Current seed
  - Current view (planet or city)
  - Selected city (if any)

> Switching between views doesn’t reset simulation — it's always running in the backend.

---

## 🚀 Getting Started

### 1. Clone + Install

```bash
git clone https://github.com/your-username/seed-sim.git
cd seed-sim
npm install
```

### 2. Start Backend

```bash
cd backend
node server.js
```

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`

---

## 📡 API Routes

| Method | Route                  | Description                |
|--------|------------------------|----------------------------|
| GET    | `/api/planet?seed=abc` | Get terrain, cities, state |
| GET    | `/api/city/{id}`       | Get city + agents          |
| POST   | `/api/seed`            | Initialize new simulation  |
| POST   | `/api/tick`            | (Internal) Advance sim     |

---

## 🧪 Persistence Options

| Option      | Pros                  | Cons               |
|-------------|-----------------------|--------------------|
| `db.json`   | Easy to debug         | Not scalable       |
| SQLite      | Reliable, fast        | Needs schema mgmt  |
| Supabase    | Hosted, auto-auth     | More setup         |
| Redis + Disk | Fast + persistent    | More moving parts  |

Start with `db.json`, migrate later.

---

## 🛣️ Roadmap

- [ ] Add agent traits and routines
- [ ] Add transit system (trains, stops)
- [ ] Enable time-skipping or rewind
- [ ] Sync clients via WebSockets
- [ ] Host on Vercel (frontend) + Fly.io (backend)

---

## 🧠 Example Seeds

Try these for different planets:

- `terra-prime`
- `colony-042`
- `dry-waste`
- `iceball-alpha`

---

## 📜 License

MIT — use, fork, and remix.

---

## 👋 Author

Built by [Your Name](https://yourportfolio.com) — inspired by Dwarf Fortress, RimWorld, and a love of tiny moving dots.

```

---

Want me to generate the starter project files to match this flow? I can scaffold it with seed handling, tick loop, city switching, etc.