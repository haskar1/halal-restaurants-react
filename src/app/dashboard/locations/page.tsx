import Link from "next/link";
import prisma from "../../lib/prisma";
import DashboardHeader from "@/app/components/DashboardHeader";

const locations = await prisma.location.findMany();

export default function LocationList() {
  return (
    <>
      <DashboardHeader />

      <main>
        <div>
          <h1 className="text-3xl pb-8">Location List</h1>
          <ul>
            {locations.length > 0 ? (
              locations.map((location) => (
                <Link
                  href={`/dashboard/location/${encodeURIComponent(
                    location.id.toString()
                  )}`}
                  key={location.id}
                >
                  <li>
                    <p>
                      <span>
                        {location.city + ", "}
                        {location.state && location.state + ", "}
                        {location.country}
                      </span>
                    </p>
                  </li>
                </Link>
              ))
            ) : (
              <li>There are no locations.</li>
            )}
          </ul>
        </div>
      </main>
    </>
  );
}
