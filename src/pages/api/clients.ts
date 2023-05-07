import {NextApiRequest, NextApiResponse} from "next";

const connectedClientsHelper = require("../../utils/connectedClients.ts")

// const {RTCIceCandidate} = require("werift")

interface RequestData {
  // Blank for now.
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestData>
) {
  if (req.method === "GET") {
    // Return list of clients who currently have a connection.
    let message = ""
    let statusCode = 500;
    let results: Array<string> = []
    try {
      results = await connectedClientsHelper.getConnectedClientsJsonString();
      statusCode = 200;
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