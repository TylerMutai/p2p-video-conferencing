const fs = require("fs/promises")

const filename = "connected_clients.txt"

function replacer(key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

const getConnectedClientsJsonString = async () => {
  return JSON.stringify(await getConnectedClients(), replacer)
}
const getConnectedClients = async () => {
  let connectedClients = new Map();
  try {
    const fileContents = await fs.readFile(filename)
    const data = fileContents.toString() || "{}"
    const clients = JSON.parse(data, reviver)
    connectedClients = new Map(clients)
  } catch (e) {
    console.log(e);
  }

  return connectedClients
}

const addConnectedClient = async (client: string, iceCandidate: RTCIceCandidateInit) => {
  const connectedClients = await getConnectedClients();
  try {
    connectedClients.set(client, iceCandidate);
    const jsonData = JSON.stringify(connectedClients, replacer);
    await fs.writeFile(filename, jsonData)
  } catch (e) {
    console.log(e)
  }
}

const deleteConnectedClient = async (client: string) => {
  const connectedClients = await getConnectedClients();
  try {
    connectedClients.delete(client);
    const jsonData = JSON.stringify(connectedClients, replacer);
    await fs.writeFile(filename, jsonData)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getConnectedClients, addConnectedClient, deleteConnectedClient, getConnectedClientsJsonString
}