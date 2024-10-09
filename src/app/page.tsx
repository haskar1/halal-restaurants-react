import { Metadata } from "next";
import Link from "next/link";
import GeocoderNoMap from "@/components/GeocoderNoMap";
import FindNearMeButton from "@/components/FindNearMeButton";
import "./homepage-style.css";
import { sql } from "@vercel/postgres";
import HomePageRestaurantList from "@/components/HomePageRestaurantList";
import { headers } from "next/headers";
// import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Halal Food Near Me | Find Halal Restaurants",
};

export default async function Home() {
  const userLatitude = headers().get("cf-iplatitude") || "";
  const userLongitude = headers().get("cf-iplongitude") || "";

  return (
    <>
      {/* <header>
        <div className="navbar-container">
          <Navbar />
        </div>
      </header> */}
      <section className="hero">
        <div className="container">
          <h1 className="text-5xl pb-8 m-0 font-bold leading-[1.1]">
            Find Halal Restaurants
          </h1>
          <div>
            <div className="location-searchbar flex flex-wrap gap-4 items-center">
              {/* <FindNearMeButton />
              <p className="text-[1.2rem] px-4">or</p> */}
              <GeocoderNoMap />
            </div>
            {/* FindNearMeButton error message displays here if timeout error occurs */}
          </div>
        </div>
      </section>
      <main>
        <HomePageRestaurantList
          userLatitude={userLatitude}
          userLongitude={userLongitude}
          limit={12}
        />
      </main>
    </>
  );
}
