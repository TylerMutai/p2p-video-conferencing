import Head from 'next/head'
import MainVideoPage from "@/components/videoConferencing/MainVideoPage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Example video streaming on the browser"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <MainVideoPage/>
    </>
  )
}
