import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Halal Restaurants Near Me | Who Is Halal",
};

export default function Home() {
  return (
    <>
      <h1>Client Home</h1>;<Link href="/dashboard">Dashboard</Link>
    </>
  );
}
