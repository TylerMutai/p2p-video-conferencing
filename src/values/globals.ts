export const env = process.env.NODE_ENV || "development"

export const videoStreamingEndpoint = "/api/video-streaming"

export const serverPort = 3001

export const serverHostName = env === "development" ? "localhost" : "localhost"