// server.js

import {NextServer} from "next/dist/server/next";
import {Server} from "socket.io";
import {IncomingMessage, ServerResponse} from "http";
import {env, serverHostName, serverPort} from "@/values/globals";

const {createServer} = require('http')
const next = require('next')

// when using middleware `hostname` and `port` must be provided below
const app: NextServer = next({dev: env, hostname: serverHostName, port: serverPort})
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      await handle(req, res)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err: Error) => {
      console.error(err)
      process.exit(1)
    })

  const io = new Server(server);
  io.on("connection", socket => {
    console.log("New connection with: ", socket);
  })

  server.listen(serverPort, () => {
    console.log(`> Ready on http://${serverHostName}:${serverPort}`)
  })
})