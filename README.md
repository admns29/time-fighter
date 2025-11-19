# ⏱️ Time Fighter

A modern, full-stack study time tracker with goal-setting, progress visualization, and comprehensive statistics. Built with Spring Boot and React.

![Time Fighter Screenshot](screenshots/dashboard.png)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Category Tracking** - Track time across different study categories
- **Session Management** - Start, pause, resume, and stop study sessions
- **Goal Setting** - Set time goals for each session with visual progress bars
- **Auto-Complete** - Sessions automatically complete when goal is reached

### 📊 Analytics & Statistics
- **Real-time Statistics** - View today's study time, weekly totals, and streaks
- **Category Breakdown** - Visual progress bars showing time per category
- **Most Studied Category** - See which topics you focus on most
- **Streak Tracking** - Maintain consistency with daily streak counter

### 🎨 Customization
- **Custom Categories** - Create, edit, and delete study categories
- **Icon & Color Selection** - Personalize categories with emojis and colors
- **Default Goals** - Set default study goals per category
- **Light/Dark Theme** - Toggle between light and dark modes

### 🔍 Advanced Features
- **Session History** - Complete log of all study sessions
- **Search & Filter** - Find sessions by category or search term
- **Sortable Columns** - Sort sessions by time, duration, or status
- **Pagination** - Efficiently browse large session histories
- **Auto-Refresh Stats** - Statistics update automatically after each session

---

## 🚀 Tech Stack

### Backend
- **Java 17** - Modern Java features
- **Spring Boot 3.5.7** - REST API framework
- **Spring Data JPA** - Database abstraction
- **H2 Database** - In-memory database (development)
- **MySQL** - Production database support
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Context API** - State management

---

## 📦 Installation

### Prerequisites
- **Java 17+** installed
- **Node.js 18+** and npm installed
- **Maven 3.6+** installed

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/time-fighter.git
cd time-fighter
```

2. Navigate to backend and run:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

---

## 🎮 Usage

### Starting a Session
1. Select a category card
2. (Optional) Set a goal duration in minutes
3. Click "Start" button
4. Timer begins counting

### Managing Sessions
- **Pause**: Temporarily stop the timer
- **Resume**: Continue a paused session
- **Stop**: Complete and save the session

### Category Management
1. Click "+ Add Category" card
2. Enter name, select icon and color
3. Set default goal duration
4. Click "Create"

### Viewing Statistics
- Statistics auto-update after each session
- Click refresh button for manual update
- View breakdown by category with progress bars

---

## 📁 Project Structure
```
time-fighter/
├── backend/
│   ├── src/main/java/com/example/timefighter/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data transfer objects
│   │   ├── exception/      # Custom exceptions
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Data repositories
│   │   └── service/        # Business logic
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── pages/          # Page components
│   │   └── styles/         # CSS files
│   └── package.json
└── README.md
```

---

## 🎨 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Session History
![Session History](screenshots/history.png)

### Statistics
![Statistics](screenshots/stats.png)

### Light Theme
![Light Theme](screenshots/light-mode.png)

---

## 🔧 Configuration

### Database Configuration

**Development (H2):**
```properties
spring.datasource.url=jdbc:h2:mem:timefighterdb
spring.h2.console.enabled=true
```

**Production (MySQL):**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/timefighter
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### CORS Configuration
Backend is configured to allow requests from `http://localhost:3000` in development.

---

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Create MySQL database
2. Set environment variables
3. Deploy Spring Boot JAR

### Frontend Deployment (Vercel/Netlify)
1. Build production bundle:
```bash
npm run build
```
2. Deploy `dist` folder
3. Set API base URL environment variable

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Icons from [Emojipedia](https://emojipedia.org/)
- Inspiration from various time tracking apps
- Built with guidance from Claude AI

---

**Made with ❤️ and ☕**