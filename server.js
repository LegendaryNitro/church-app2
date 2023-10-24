const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const memberRoute = require("./routes/members");
const passwordResetRoute = require("./routes/passwordReset");
const prayerRequestRoute = require("./routes/prayer-request");
const rsvpRoute = require("./routes/rsvp");
const sermonRoute = require("./routes/sermons");
const stripeRoute = require("./routes/stripe");
const userRoute = require("./routes/user");


const chatRoute = require("./routes/chat-route");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const rooms = {}; // Declare rooms object

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successfully!"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/member", memberRoute);
app.use("/api/password-reset", passwordResetRoute);
app.use("/api/prayer-request", prayerRequestRoute);
app.use("/api/rsvp", rsvpRoute);
app.use("/api/sermon", sermonRoute);
app.use("/api/donations", stripeRoute);
app.use("/api/user", userRoute);


app.use("/api/chat", chatRoute);

io.on("join-room", ({ roomId, userId }) => {
  if (rooms[roomId]) {
    rooms[roomId].users.push(userId);
    io.to(roomId).emit("user-joined-room", userId);
  }
});


io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  
  socket.on("create-room", ({ hostId }) => {
    const roomId = generateRoomId(); // Generate a unique room ID
    rooms[roomId] = { host: hostId, users: [] };
    socket.join(roomId);
    socket.emit("room-created", { roomId });
  });

  socket.on("join-room", ({ roomId, userId }) => {
    if (rooms[roomId]) {
      rooms[roomId].users.push(userId);
      socket.join(roomId);
      io.to(roomId).emit("user-joined-room", userId);
    }
  });

  socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function generateRoomId() {
  // Implement your own logic to generate a unique room ID here
  // For simplicity, you can use a random string or a UUID
  return Math.random().toString(36).substring(7);
}

module.exports = app;
