import {NextApiRequest, NextApiResponse} from "next";

const connectedClientsHelper = require("../../utils/connectedClients.ts")

interface RequestData {
  // Blank for now.
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestData>
) {
  if (req.method === "GET") {
    // Return list of clients who currently have a connection.
    let connectedClients = new Set<string>;
    let message = ""
    let statusCode = 500;
    let results: Array<string> = []
    try {
      connectedClients = await connectedClientsHelper.getConnectedClients();
      results = Array.from(connectedClients.values())
    } catch (e) {
      message = (e as any).message
    }

    res.status(statusCode).json({
      results: results,
      message: message
    })
    return;
  }
  res.status(405).json({
    message: "HTTP method not supported"
  })
};