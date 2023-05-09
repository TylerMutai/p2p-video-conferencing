const fs = require("fs/promises")

const filename = "connected_clients.txt"

function replacer(key: string, value: any) {
  if (value instanceof Set) {
    return {
      dataType: 'Set',
      value: Array.from(value.values()),
    };
  } else {
    return value;
  }
}

function reviver(key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Set') {
      return new Set(value.value);
    }
  }
  return value;
}

const getConnectedClientsJsonString = async () => {
  return JSON.stringify(await getConnectedClients(), replacer)
}
const getConnectedClients = async () => {
  let connectedClients = new Set();
  try {
    const fileContents = await fs.readFile(filename)
    const data = fileContents.toString() || JSON.stringify(new Set(), replacer)
    const clients = JSON.parse(data, reviver)
    connectedClients = new Set(clients)
  } catch (e) {
    console.log(e);
  }

  return connectedClients
}

const addConnectedClient = async (client: string) => {
  const connectedClients = await getConnectedClients();
  try {
    connectedClients.add(client);
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