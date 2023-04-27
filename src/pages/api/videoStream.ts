import {NextApiRequest, NextApiResponse} from "next";
import io from "socket.io";

interface RequestData {
  // Blank for now.
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestData>
) {
  res.status(200).json({name: 'John Doe'})
}
