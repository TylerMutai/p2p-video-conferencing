import {NextApiRequest, NextApiResponse} from "next";

const {connectedClients} = require("../../server.ts");

interface RequestData {
  // Blank for now.
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestData>
) {
  // Return list of clients who currently have a connection.
  const connectedClients = JSON.parse(req.)
  console.log(connectedClients);
  if (req.method === "GET") {
    res.status(200).json({
      results: JSON.stringify(Array.from(connectedClients.values()))
    })
    return;
  }
  res.status(405).json({
    message: "HTTP method not supported"
  })
};