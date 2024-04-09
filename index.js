


const io = require("socket.io")(process.env.PORT, {
    cors: {
      origin: process.env.REACT_URL,
    },
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user?.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user?.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user?.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket?.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ sendUserId,receiveUserId,contentMessage,zoomId }) => {
      const user = getUser(receiveUserId);
      io.to(user?.socketId).emit("getMessage", {
        sendUserId,
        receiveUserId,
        contentMessage,
        zoomId,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket?.id);
      io.emit("getUsers", users);
    });
  });