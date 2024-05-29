// const userSocketMap = {}; // {userId: socketId}
// const getReceiverSocketId = (receiverId) => {
// 	return userSocketMap[receiverId];
// };

// const setReceiverSocketId = (receiverId, socketId) => {
// 	userSocketMap[receiverId] = socketId;
// };

// const deleteReceiverSocketId = (receiverId) => {
// 	delete userSocketMap[receiverId];
// };

// const ioMap = {};
// const getIoMap = () => {
// 	return ioMap.io;
// };
// const setIoMap = (io) => {
// 	ioMap.io = io;
// };

// module.exports = {
//   userSocketMap,
//   getReceiverSocketId,
//   getIoMap,
//   setReceiverSocketId,
//   setIoMap,
//   deleteReceiverSocketId
// };


class SocketMap {
  constructor() {
    this.userSocketMap = {};
    this.ioMap = {};
  }

  getReceiverSocketId(receiverId) {
    return this.userSocketMap[receiverId];
  }

  setReceiverSocketId(receiverId, socketId) {
    this.userSocketMap[receiverId] = socketId;
  }

  deleteReceiverSocketId(receiverId) {
    delete this.userSocketMap[receiverId];
  }

  getIoMap() {
    return this.ioMap.io;
  }
  setIoMap(io) {
    this.ioMap.io = io;
  }
}

module.exports = new SocketMap();


