# ♟️ Chess Game

A real-time multiplayer chess game built with **Node.js, Express, Socket.IO, Chess.js**. It features live gameplay, drag-and-drop and click-to-move controls, legal move validation, automatic board rotation, checkmate detection, and a responsive user interface.

---

## ✨ Features

- ♟️ Real-time multiplayer gameplay
- 🔄 Live move synchronization using Socket.IO
- 🖱️ Drag-and-drop piece movement
- 👆 Click-to-move controls
- ✅ Legal move validation with Chess.js
- 🔃 Automatic board rotation
- 👑 Checkmate detection
- 🏆 Winner & Loser game-over screens
- 📱 Responsive user interface

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Real-Time Communication:** Socket.IO
- **Game Logic:** Chess.js

---

## 📂 Project Structure

```
Chess-Game/
│── public/
│   ├── images/
│   ├── javascripts/
│   └── stylesheets/
│
│── views/
│   └── index.ejs
│
│── index.js
│── package.json
│── package-lock.json
│── .gitignore
│── README.md
```

---

## 🚀 Installation

1. Clone the repository

```bash
git clone https://github.com/ajitjada/Chess-Game.git
```

2. Navigate to the project directory

```bash
cd Chess-Game
```

3. Install dependencies

```bash
npm install
```

4. Start the server

```bash
node index.js
```

5. Open your browser and visit

```
http://localhost:3000
```

---

## 🎮 How to Play

- Open the game in two browser windows or on two different devices.
- The first player is assigned **White**, and the second player is assigned **Black**.
- Move pieces using **drag-and-drop** or **click-to-move**.
- Play according to standard chess rules.
- The game ends when a **checkmate** is detected.

---

## 📌 Future Improvements

- ⏱️ Chess Clock / Timer
- 💬 In-game Chat
- 📜 Move History
- ♻️ Play Again Option
- 🌐 Online Matchmaking

---

## 📸 Screenshots

### Game Board

![ChessBoard](/images/chessboard.png)

### Possible Move

![possiblemove](/images/possible-move.png)

### Checkmate

![Checkmate](/images/checkmate.png)

## 👨‍💻 Author

**Ajit Jada**

GitHub: https://github.com/ajitjada