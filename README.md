# Pro Stats - Advanced Esports Analytics Platform

<div align="center">

![React](https://img.shields.io/badge/React-19.2.6-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.21-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

**A full-stack esports data analytics platform with automated scraping, interactive visualizations, and scalable architecture.**
</div>

---

## About the Project

The **Pro Stats** is a complete data analysis platform for professional League of Legends players platform that demonstrates expertise in full-stack development, data engineering, and modern interface creation.

This project was developed as a **technical portfolio** to demonstrate advanced skills in:
- Web scraping and automated data collection
- Complex data visualization
- calable software architecture
- Performance and optimization
- Modern and responsive UI/UX

---

## Key Features

### User Features
- **Player Rankings**: Detailed performance analysis with advanced metrics (KDA, CS/min, KP%, WR%, DPM, Gold/min)
- **Player Comparison**: Interactive tool to compare up to 5 players simultaneously with radar charts
- **Team Analysis**: Complete team statistics with dynamic filters
- **Champion Pool**: Visualization of most played champions by each athlete
- **Match Schedule**: Integrated schedule with upcoming league matches
- **Premium Design**: Dark interface with golden accents, fully responsive

### Technical Features
- **Automated Scraping**: Real-time data collection from multiple sources (GGPreview, Oracle's Elixir)
- **Data Pipeline**: Complete ETL with validation, normalization, and storage
- **Smart Cache**: In-memory caching system for performance optimization
- **RESTful API**: Robust backend with optimized endpoints
- **Image Updates**: Automatic script for downloading assets (champ icons, player photos)
- **Error Handling**: Robust logging and fallbacks for resilience

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|--------|-----------|
| **React** | 19.2.6 | UI Framework |
| **React Router DOM** | 7.15.0 | Routing |
| **Chart.js + react-chartjs-2** | 4.5.1 / 5.3.1 | Data visualization |
| **Recharts** | 3.8.1 | Additional charts |
| **TailwindCSS** | 3.4.19 | Styling |
| **Lucide React** | 1.16.0 | Icons |
| **Vite** | 8.0.12 | Build tool |

### Backend
| Technology | Version | Purpose |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime |
| **Express** | 5.2.1 | Web framework |
| **PostgreSQL** | 8.21.0 | Database |
| **Puppeteer** | 24.0.0 | Browser automation |
| **Axios** | 1.16.1 | HTTP client |
| **CSV Parser** | 3.2.1 | Data processing |
| **dotenv** | 17.4.2 | Environment variables management |

### DevOps & Tools
- **ESLint** - Code linting
- **Nodemon** - Hot reload in development
- **PostCSS + Autoprefixer** - CSS processing
- **GitHub Actions** (configurable) - CI/CD

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │ Players  │  │  Compare │  │  Teams   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Player  │  │   Team   │  │Champions │                  │
│  │  Detail  │  │  Detail  │  │          │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Express + Node.js)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │  │ Controllers  │  │   Services   │      │
│  │   (routes/)  │  │(controllers/)│  │ (services/)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                  ↓                  ↓             │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Data Pipeline & Scraping            │      │
│  │  • Puppeteer (browser automation)                │      │
│  │  • Axios (API requests)                          │      │
│  │  • CSV Parser (data processing)                  │      │
│  │  • Cache Service (performance)                   │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                      │
│  • players | teams | matches | champion_stats               │
└─────────────────────────────────────────────────────────────┘
```

---
### Complex Problems Solved

#### 1. **Data Engineering & Scraping**
- Robust scraping implementation with **Puppeteer** to collect data from multiple sources
- Edge cases handling: timeouts, blocks, HTML structure changes
- ETL pipeline with validation, cleaning, and data normalization
- **Result**: +1000 players and +100 teams cataloged with updated statistics

#### 2. **Performance & Optimization**
- In-memory cache system to reduce database calls by ~70%
- Lazy loading of components and images
- SQL query optimization with strategic indexes
- **Result**: Average response time < 200ms for critical endpoints

#### 3. **Data Visualization**
- Interactive radar charts comparing 6+ metrics simultaneously
- Data normalization for fair visualization across different scales
- Chart.js integration with custom themes
- **Result**: Dashboards that transform complex data into actionable insights

#### 4. **Full-Stack Architecture**
- Clear separation of responsibilities (MVC pattern)
- Well-documented and consistent RESTful API
- Componentized and reusable frontend
- **Result**: Maintainable, testable, and scalable code

#### 5. **Resilience & Error Handling**
- Fallbacks when external sources are unavailable
- Structured logging for debugging
- Retry mechanisms for critical operations
- **Result**: Stable system even with partial failures

### Demonstrated Skills

| Category | Skills |
|----------|--------|
| **Frontend** | React 19, Hooks, Context API, React Router, Chart.js, TailwindCSS, Responsive Design |
| **Backend** | Node.js, Express, REST APIs, Middleware, Error Handling |
| **Database** | PostgreSQL, Query Optimization, Schema Design, Migrations |
| **Data Engineering** | Web Scraping, ETL Pipelines, Data Cleaning, Automation |
| **DevOps** | Environment Config, Build Processes, Deployment Strategies |
| **Soft Skills** | Problem Solving, Attention to Detail, User-Centric Design |

---

## Project Structure

```
Pro-Stats-Hub/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route business logic
│   │   ├── routes/          # Endpoint definitions
│   │   ├── services/        # Specialized services
│   │   │   ├── scrapingService.js      # Web scraping with Puppeteer
│   │   │   ├── cacheService.js         # Cache system
│   │   │   ├── dataPipeline.js         # Complete ETL
│   │   │   └── matchScheduleService.js # Match schedule
│   │   ├── scripts/         # Utility scripts
│   │   └── index.js         # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Application pages
│   │   │   ├── Home.jsx
│   │   │   ├── Players.jsx
│   │   │   ├── PlayerDetail.jsx
│   │   │   ├── Compare.jsx
│   │   │   ├── Teams.jsx
│   │   │   ├── TeamDetail.jsx
│   │   │   └── Champions.jsx
│   │   ├── context/         # Context API for global state
│   │   ├── services/        # API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

<div align="center">

**Thank you for your attention**

</div>