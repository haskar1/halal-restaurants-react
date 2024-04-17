import getCuisines from "@/utils/get-cuisines";
import Link from "next/link";

export const fetchCache = "force-no-store";

export default async function CuisineList() {
  const cuisines = await getCuisines();

  return (
    <>
      <h1 className="text-3xl pb-8">Cuisine List</h1>
      <ul className="pl-0">
        {cuisines && cuisines.length > 0 ? (
          cuisines.map((cuisine) => (
            <li key={cuisine.id}>
              <Link href={`/dashboard/cuisines/${cuisine.id}`}>
                <p>
                  <span>{cuisine.name}</span>
                </p>
              </Link>
            </li>
          ))
        ) : (
          <li>No cuisines found.</li>
        )}
      </ul>
    </>
  );
}
