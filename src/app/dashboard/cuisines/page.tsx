import Link from "next/link";
import prisma from "../../lib/prisma";
import DashboardHeader from "@/app/components/DashboardHeader";

const cuisines = await prisma.cuisine.findMany();

export default function CuisineList() {
  return (
    <>
      <DashboardHeader />

      <main>
        <div>
          <h1 className="text-3xl pb-8">Cuisine List</h1>
          <ul>
            {cuisines.length > 0 ? (
              cuisines.map((cuisine) => (
                <Link
                  href={`/dashboard/cuisine/${encodeURIComponent(
                    cuisine.id.toString()
                  )}`}
                  key={cuisine.id}
                >
                  <li>
                    <p>
                      <span>{cuisine.name}</span>
                    </p>
                  </li>
                </Link>
              ))
            ) : (
              <li>There are no cuisines.</li>
            )}
          </ul>
        </div>
      </main>
    </>
  );
}
