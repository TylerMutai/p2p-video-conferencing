const {createServer} = require('http')
const {Server} = require("socket.io")
const next = require('next')
const connectedClientsHelper = require("./utils/connectedClients.ts")


const env = process.env.NODE_ENV || "development"
const serverPort = 3000
const serverHostName = env === "development" ? "localhost" : "localhost"

const app = next({dev: env === "development", hostname: serverHostName, port: serverPort})
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const server = createServer(async (req, res) => {
    try {
      await handle(req, res)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  });
  server.once('error', (err) => {
    console.error(err)
    process.exit(1)
  })

  const io = new Server(server);
  io.on("connection", async (socket) => {
    console.log("New connection with: ", socket.id);

    // register a listener on the socket to check for disconnection.
    socket.on("disconnect", async () => {
      console.log(`Connection id ${socket.id} has left`)
      await connectedClientsHelper.deleteConnectedClient(socket.id);
    })
    await connectedClientsHelper.addConnectedClient(socket.id)
  })

  server.listen(serverPort, () => {
    console.log(`> Ready on http://${serverHostName}:${serverPort}`)
  })
})