import Router from "next/router";
import Layout from "../components/layout";
export default function Home() {
    if (typeof window !== "undefined"){
        Router.push('/allpage')
        return <></>
    }
  return (
    <Layout className={"m-auto flex"}>
        <h1 className={"m-auto p-32 text-center text-6xl font-bold"}>Oops you might be lost.
            <a href="/allpage" className={"underline text-green-800"}> Go Home!</a>
        </h1>
    </Layout>
  )
}
