import {NextApiRequest, NextApiResponse} from "next";
import {Server} from "socket.io";
import {videoStreamingEndpoint} from "@/values/globals";

interface RequestData {
  // Blank for now.
}

const io = new Server({
  path: videoStreamingEndpoint,
  serveClient: false,
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Message received:", data);
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestData>
) {
  try {
    io.listen(3001)
    res.status(200).json({
      message: "Socket connection established successfully!"
    })
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Could not initialize socket connection. Please try again."
    })
  }
};