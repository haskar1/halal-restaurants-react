import { Metadata } from "next";
import Link from "next/link";
import GeocoderNoMap from "@/components/GeocoderNoMap";
import "./homepage-style.css";

export const metadata: Metadata = {
  title: "Halal Restaurant Locator | Who Is Halal",
};

export default function Home() {
  return (
    <>
      <header>
        <div className="container">
          {/* <Link className="logo" href="#">
            <img src="path/to/image" alt="Who Is Halal Logo" />
          </Link> */}

          <nav>
            <ul>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1 className="text-5xl pb-8 m-0 font-bold leading-[1.1]">
            Find Halal Restaurants
          </h1>
          <GeocoderNoMap />
        </div>
      </section>

      <main></main>
    </>
  );
}
