const fs = require("fs/promises")

const filename = "connected_clients.txt"


const getConnectedClients = async () => {
  let connectedClients = new Map();
  try {
    const fileContents = await fs.readFile(filename)
    const data = fileContents.toString() || "{}"
    const clients = JSON.parse(data)
    connectedClients = new Map(Object.entries(clients))
  } catch (e) {
    console.log(e);
  }

  return connectedClients
}

const addConnectedClient = async (client: string, iceCandidate: RTCIceCandidateInit) => {
  const connectedClients = await getConnectedClients();
  try {
    connectedClients.set(client, iceCandidate);
    const jsonData = JSON.stringify(connectedClients.entries());
    console.log(jsonData)
    await fs.writeFile(filename, jsonData)
  } catch (e) {
    console.log(e)
  }
}

const deleteConnectedClient = async (client: string) => {
  const connectedClients = await getConnectedClients();
  try {
    connectedClients.delete(client);
    const jsonData = JSON.stringify(connectedClients.entries());
    await fs.writeFile(filename, jsonData)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getConnectedClients, addConnectedClient, deleteConnectedClient
}