import Router from "next/router";
import Layout from "../components/layout";
export default function Home() {
    if (typeof window !== "undefined"){
        Router.push('/allpage')
        return <></>
    }
  return (
  <></>
  )
}
