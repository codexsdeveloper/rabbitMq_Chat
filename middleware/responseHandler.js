const responseHandler = (socket, en, data) => {
    socket.emit("res", ({ en, ...data }));
  };
  
  module.exports = responseHandler
  