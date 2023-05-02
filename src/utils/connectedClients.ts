const fs = require("fs/promises")

const filename = "connected_clients.txt"


const getConnectedClients = async () => {
  let connectedClients = new Set();
  try {
    const fileContents = await fs.readFile(filename)
    const clients = JSON.parse(fileContents.toString() ?? "{}")
    connectedClients = new Set(Array.from(clients))
  } catch (e) {
    console.log(e);
  }

  return connectedClients
}

const addConnectedClient = async (client) => {
  const connectedClients = await getConnectedClients();
  try {
    connectedClients.add(client);
    const jsonData = JSON.stringify(Array.from(connectedClients.values()));
    await fs.writeFile(filename, jsonData)
  } catch (e) {
    console.log(e)
  }
}

const deleteConnectedClient = async (client) => {
  const connectedClients = await getConnectedClients();
  try {
    connectedClients.delete(client);
    const jsonData = JSON.stringify(connectedClients);
    console.log(jsonData)
    await fs.writeFile(filename, jsonData)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getConnectedClients, addConnectedClient, deleteConnectedClient
}