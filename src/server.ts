const {createServer, IncomingMessage, ServerResponse} = require('http')
const {Server, ReservedOrUserListener} = require("socket.io")
const next = require('next')
const connectedClientsHelper = require("./utils/connectedClients.ts")


const env = process.env.NODE_ENV || "development"
const serverPort = 3000
const serverHostName = env === "development" ? "localhost" : "localhost"

const app = next({dev: env === "development", hostname: serverHostName, port: serverPort})
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const server = createServer(async (req: typeof IncomingMessage, res: typeof ServerResponse) => {
    try {
      await handle(req, res)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  });
  server.once('error', (err: Error) => {
    console.error(err)
    process.exit(1)
  })

  const io = new Server(server);
  io.on("connection", async (socket: typeof ReservedOrUserListener) => {
    console.log("New connection with: ", socket.id);

    // Add this socket connection to the list of available clients. This list is rendered
    // on the frontend through the endpoint: '/api/clients'
    await connectedClientsHelper.addConnectedClient(socket.id)

    // When we receive an offer, we re-broadcast this to all available clients.
    // The client is responsible for handling its specific candidates by checking against
    // the [socketId] field.
    socket.on('offer', (data: { socketId: string; offer: RTCSessionDescriptionInit }) => {
      // Emit the offer. Client will handle checking whether this offer is for it's selected ICECandidate
      console.log(`Connection id: ${socket.id} has made an offer`)
      console.log(`socketId: ${data.socketId}`)
      io.emit('offer', data);
    });

    // Same here. The client checks against the [socketId] field
    socket.on('answer', (data: { socketId: string; answer: RTCSessionDescriptionInit }) => {
      // Emit the answer. Client will handle checking whether this offer is for it's selected ICECandidate
      console.log(`Connection id: ${socket.id} has made an answer`)
      io.emit('answer', data);
    });

    socket.on('icecandidate', async (data: { socketId: string; candidate: RTCIceCandidateInit }) => {
      console.log(`Connection id: ${socket.id} has is has an ICECandidate`)
      io.emit('icecandidate', data);
    });

    // register a listener on the socket to check for disconnection.
    socket.on("disconnect", async () => {
      console.log(`Connection id ${socket.id} has left`)
      await connectedClientsHelper.deleteConnectedClient(socket.id);
    })
  })

  server.listen(serverPort, () => {
    console.log(`> Ready on http://${serverHostName}:${serverPort}`)
  })

  server.once("close", async () => {
    await connectedClientsHelper.clearConnectedClients()
  })
})