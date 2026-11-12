// backend/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(http, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/swaps", require("./routes/swapRoutes"));

// Socket connection (for future video/chat)
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log("Joined room:", roomId);
  });

  // Chat
  socket.on("send-message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", message);
  });

  // WebRTC signaling
  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

let users = [
  {
    id: 1,
    name: "Arjun Mehta",
    teach: "Python",
    learn: "Guitar",
    type: "peer",
  },
  { id: 2, name: "Sarah Smith", teach: "React", learn: "Python", type: "peer" },
];

const industryExperts = [
  {
    id: 101,
    name: "Dr. Miller",
    teach: "Python",
    company: "Google",
    type: "expert",
  },
  {
    id: 102,
    name: "James Ghost",
    teach: "Design",
    company: "Meta",
    type: "expert",
  },
];

app.post("/api/match", (req, res) => {
  const { teach, learn } = req.body;
  const searchTerm = learn ? learn.toLowerCase().trim() : "";

  // 1. Find Peers who teach what you want
  let matches = users.filter((u) => u.teach.toLowerCase().includes(searchTerm));

  // 2. If no peers, grab the Industry Experts
  let isExpert = false;
  if (matches.length === 0) {
    matches = industryExperts.filter((e) =>
      e.teach.toLowerCase().includes(searchTerm),
    );
    isExpert = matches.length > 0;
  }

  // 3. Last Resort: If still nothing, send a "Global Mentor" so the page isn't blank
  if (matches.length === 0) {
    matches = [
      {
        id: 999,
        name: "SkillSwap Bot",
        teach: "Onboarding",
        type: "expert",
        bio: "I can help you get started!",
      },
    ];
    isExpert = true;
  }

  res.json({ matches, isExpert });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
