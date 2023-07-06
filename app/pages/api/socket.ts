import { NextApiHandler } from "next";
import { Server } from "socket.io";

const SocketHandler: NextApiHandler = (req, res: any) => {
  if (res.socket?.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
