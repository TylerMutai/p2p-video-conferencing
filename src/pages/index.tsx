import Head from 'next/head'
import MainVideoConferencing from "@/components/videoConferencing/MainVideoConferencing";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Example video streaming on the browser"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <MainVideoConferencing/>
    </>
  )
}
