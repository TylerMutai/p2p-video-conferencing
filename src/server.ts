const {createServer} = require('http')
const {Server} = require("socket.io")
const next = require('next')

const env = process.env.NODE_ENV || "development"
const serverPort = 3000
const serverHostName = env === "development" ? "localhost" : "localhost"
const connectedClients = require("./dataStore.ts")

// when using middleware `hostname` and `port` must be provided below
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
  io.on("connection", (socket) => {
    console.log("New connection with: ", socket.id);
    connectedClients.add(socket.id)
    console.log(connectedClients)
  })

  server.listen(serverPort, () => {
    console.log(`> Ready on http://${serverHostName}:${serverPort}`)
  })
})