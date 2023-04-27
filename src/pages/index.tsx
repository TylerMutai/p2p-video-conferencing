import Head from 'next/head'
import VideoPageBroadcaster from "@/components/videoConferencing/VideoPageBroadcaster";
import VideoStreamSetup from "@/components/videoStreaming/VideoStreamSetup";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Example video streaming on the browser"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <VideoStreamSetup/>
      <VideoPageBroadcaster/>
    </>
  )
}
