const path = require("path");
const fs = require("fs");
const http = require("http");
const fileUpload = require("express-fileupload");
const express = require("express");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");

const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/errors");
const { setHeader } = require("./middlewares/headers");
const { getuserid } = require("./middlewares/auth");
//* Load Config
dotEnv.config({ path: "./config/config.env" });

//* Database connection
connectDB();

const app = express();

//* BodyPaser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(setHeader);
//* File Upload Middleware
app.use(fileUpload());

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* Routes
app.use("/", require("./routes/blog"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));

//ErrorController
app.use(errorHandler);
const PORT = process.env.PORT || 3333;

const server = http.createServer(app);
const io = new Server(server);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
const users = [];

io.on("connection", (socket) => {
  console.log(`User connected. ${socket.id}`);

  // Listening
  socket.on("enterchat", async (nickname) => {
    const user =await users.find((q) => q.userId === getuserid(nickname.userId));

    if (!user) {
      users.push({ nickname: socket.id, userId: getuserid(nickname.userId) });
    }
    
    console.log(users)

  });
  

  socket.on("disconnect", (socket) => {
    console.log(`User disconnected.`);
    const index = users.findIndex(
      (q) => q.id=== socket.id
    );
    users.splice(index, 1);
    console.log(users)

  });

  // socket.on("chat message", (data) => {
  //     io.sockets.emit("chat message", data);
  // });

  // socket.on("typing", (data) => {
  //     socket.broadcast.emit("typing", data);
  // });

  socket.on("pvChat", (data) => {
      console.log(`Private Chat Data: ${data}`);
      console.log(data);
      const user=users.find(r=>r.userId===data.to) 
      console.log(user)
      io.to(user?.nickname).emit("pvChat", data);
  });
});
