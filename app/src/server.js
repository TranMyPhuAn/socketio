const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const Filter = require("bad-words");
const formatTime = require("date-format");
const { createMessages } = require("./utils/create-messages");
const { getUserList, addUser, removeUser, findUser } = require("./utils/users");

const app = express();
const httpServer = createServer(app);

const publicPathDirectory = path.join(__dirname, "../public");
app.use(express.static(publicPathDirectory));

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // console.log("new client connect");

  // xử lý join room
  socket.on("join room from client to server", ({ room, username }) => {
    socket.join(room);

    // chào
    // gửi cho client vừa kết nối vào
    socket.emit(
      "send message from server to client",
      createMessages(`Chào mừng bạn đến với phòng ${room}`, "Admin")
    );
    //gửi cho các client còn lại
    socket.broadcast
      .to(room)
      .emit(
        "send message from server to client",
        createMessages(`client ${username} mới vừa tham gia vào phòng ${room}`, "Admin")
      );

    //chat
    socket.on("send message from client to server", (messageText, callback) => {
      // kiểm tra từ tục tĩu
      const filter = new Filter();
      if (filter.isProfane(messageText)) {
        callback("messageText không hợp lệ vì có những từ khóa tục tĩu");
      }

      const id = socket.id;
      const user = findUser(id)

      // const message = createMessages(messageText);
      io.to(room).emit(
        "send message from server to client",
        createMessages(messageText, user.username)
      );
      callback();

    });
    // xử lý chia sẽ vị trí
    socket.on(
      "share location from client to server",
      ({ latitude, longitude }) => {
        const linkLocation = `https://www.google.com/maps?${latitude},${longitude}`;
        const id = socket.id;
        const user = findUser(id)
        io.to(room).emit(
          "share location from server to client",
          createMessages(linkLocation, user.username)
        );
      }
    );

    // xử lý userList
    const newUser = {
      id: socket.id,
      username,
      room,
    };
    addUser(newUser);

    io.to(room).emit(
      "send user list from server to client",
      getUserList(room)
    );



    // ngắt kết nối
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.to(room).emit(
        "send user list from server to client",
        getUserList(room)
      );
      console.log("client left server")
    });
  });
});

const port = process.env.PORT || 4567
httpServer.listen(port);
