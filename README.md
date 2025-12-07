# ⏱️ Time Fighter

A modern, full-stack study time tracker with goal-setting, progress visualization, and comprehensive statistics. Built with Spring Boot and React.

![Time Fighter Screenshot](screenshots/dashboard.png)

## ✨ Features

### 🎯 Core Functionality

- **Multi-User Support** - Secure login and registration with private data isolation
- **Multi-Category Tracking** - Track time across different study categories
- **Session Management** - Start, pause, resume, and stop study sessions
- **Pomodoro Timer** - Dedicated focus timer with Work/Break modes 🍅
- **Goal Setting** - Set time goals for each session with visual progress bars

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

---

## 🚀 Tech Stack

### Backend

- **Java 17** - Modern Java features
- **Spring Boot 3.x** - REST API framework
- **Spring Security + JWT** - Stateless authentication
- **Spring Data JPA** - Database abstraction
- **H2 Database** - In-memory database (development)
- **MySQL** - Production database support
- **Maven** - Dependency management

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Router** - Client-side routing
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

## 🤝 Contributing

We love contributions! This project is designed to be beginner-friendly.

### 🌱 Good First Issues

If you are new to open source, here are some ideas to get started:

- **UI Polish**: Improve the spacing or colors in the Dashboard.
- **New Icons**: Add more emoji options for categories.
- **Tooltips**: Add hover tooltips to buttons explaining what they do.
- **Mobile Responsiveness**: Check how the app looks on a phone and fix any layout issues.
- **Sound Effects**: Add a sound when the timer finishes.

### 📝 How to Contribute

1.  **Fork the repository**

    - Click the "Fork" button at the top right of this page.

2.  **Clone your fork**

    ```bash
    git clone https://github.com/YOUR_USERNAME/time-fighter.git
    ```

3.  **Create a branch**

    ```bash
    git checkout -b feature/my-new-feature
    ```

4.  **Make your changes**

    - Write your code.
    - Test your changes.

5.  **Commit and Push**

    ```bash
    git add .
    git commit -m "Add my new feature"
    git push origin feature/my-new-feature
    ```

6.  **Create a Pull Request**
    - Go to the original repository and click "Compare & pull request".
    - Describe your changes and submit!

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

### JWT Configuration

The app uses a default secret for development. For production, set the `JWT_SECRET` environment variable.

---

## 📝 License

This project is open source and available under the MIT License.

---
